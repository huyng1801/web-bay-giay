
package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.student.polyshoes.config.VNPAYConfig;
import vn.student.polyshoes.dto.GuestDto;
import vn.student.polyshoes.dto.OrderDto;
import vn.student.polyshoes.dto.OrderFilterDto;
import vn.student.polyshoes.dto.OrderItemDto;
import vn.student.polyshoes.dto.ShippingDto;
import vn.student.polyshoes.enums.OrderStatus;
import vn.student.polyshoes.enums.PaymentMethod;
import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.Guest;
import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.OrderItem;
import vn.student.polyshoes.model.ProductColor;
import vn.student.polyshoes.model.ProductSize;
import vn.student.polyshoes.model.Shipping;
import vn.student.polyshoes.repository.CustomerRepository;
import vn.student.polyshoes.repository.GuestRepository;
import vn.student.polyshoes.repository.OrderItemRepository;
import vn.student.polyshoes.repository.OrderRepository;
import vn.student.polyshoes.repository.ProductColorImageRepository;
import vn.student.polyshoes.repository.ProductSizeRepository;
import vn.student.polyshoes.response.OrderFilterResponse;
import vn.student.polyshoes.response.OrderItemResponse;
import vn.student.polyshoes.response.OrderResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private OrderStatusHistoryService orderStatusHistoryService;
    
    @Autowired
    private VoucherService voucherService;
    
    @Autowired
    private ShippingService shippingService;
    
    @Autowired
    private ProductColorImageRepository productColorImageRepository;
    
    @Autowired
    private vn.student.polyshoes.repository.AdminUserRepository adminUserRepository;

    @Transactional
    public OrderResponse createOrder(int customerId, GuestDto guestDto, OrderDto orderDto,
            List<OrderItemDto> orderItemDtos) {
        Guest savedGuest = null;
        Customer customer = null;

        // Handle the case when customerId is provided
        if (customerId != 0) {
            customer = customerRepository.findById(customerId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid customer ID"));

            // Check if customer account is active
            if (!customer.getIsActive()) {
                throw new IllegalArgumentException("Tài khoản của bạn đã bị ngừng hoạt động. Không thể đặt hàng.");
            }
        } else if (guestDto != null) {
            // Handle the case when guestDto is provided
            Guest guest = new Guest();
            guest.setFullName(guestDto.getFullName());
            guest.setEmail(guestDto.getEmail());
            guest.setPhone(guestDto.getPhone());
            guest.setAddress(guestDto.getAddress());
            guest.setAddress2(guestDto.getAddress2());
            guest.setCity(guestDto.getCity());
            guest.setCreatedAt(new Date());
            guest.setUpdatedAt(new Date());

            savedGuest = guestRepository.save(guest);
        } else {
            throw new IllegalArgumentException("Either customerId or guestDto must be provided");
        }

        // Generate Order ID based on current date and time (ddMMyyyyHHmmss)
        String orderId = generateOrderId();

        // Create Order entity and map from OrderDto
        Order order = new Order();
        order.setOrderId(orderId);
        order.setCustomer(customer); // Associate the customer if provided
        order.setGuest(savedGuest); // Associate the guest if provided
        order.setTotalPrice(orderDto.getTotalPrice() != null ? orderDto.getTotalPrice() : calculateTotalPrice(orderItemDtos)); // Use provided total or calculate
        order.setOriginalPrice(orderDto.getOriginalPrice());
        order.setVoucherDiscount(orderDto.getVoucherDiscount());
        order.setIsPaid(orderDto.isPaid());
        
        // Đặt phương thức thanh toán từ OrderDto, mặc định là COD nếu null
        PaymentMethod paymentMethod = orderDto.getPaymentMethod() != null 
            ? orderDto.getPaymentMethod() 
            : PaymentMethod.CASH_ON_DELIVERY;
        order.setPaymentMethod(paymentMethod);
        
        order.setOrderNote(orderDto.getOrderNote());
        
        // Set shipping if provided
        if (orderDto.getShippingId() != null) {
            ShippingDto shippingDto = shippingService.getShippingById(orderDto.getShippingId()).orElse(null);
            if (shippingDto != null) {
                Shipping shipping = new Shipping();
                shipping.setShippingId(shippingDto.getShippingId());
                order.setShipping(shipping);
            }
        }
        
        // Set assigned staff if provided
        if (orderDto.getAssignedStaffId() != null && !orderDto.getAssignedStaffId().trim().isEmpty()) {
            vn.student.polyshoes.model.AdminUser staff = adminUserRepository.findById(orderDto.getAssignedStaffId()).orElse(null);
            if (staff != null) {
                order.setAssignedStaff(staff);
            }
        }
        
        // Đặt trạng thái đơn hàng theo flow chính thức
        if (paymentMethod == PaymentMethod.IN_STORE || paymentMethod == PaymentMethod.QR_CODE) {
            // Đơn hàng tại cửa hàng tự động hoàn thành
            order.setOrderStatus(OrderStatus.COMPLETED);
            order.setIsPaid(true);
            order.setPaidAt(new Date());
        } else {
            // Đơn hàng online bắt đầu từ PENDING_PAYMENT
            order.setOrderStatus(OrderStatus.PENDING_PAYMENT);
        }
        
        order.setCreatedAt(new Date());
        order.setUpdatedAt(new Date());

        // Save the order to the database
        Order savedOrder = orderRepository.save(order);

        // Map and save order items from OrderItemDto
        List<OrderItem> orderItems = orderItemDtos.stream().map(orderItemDto -> {
            ProductSize productSize = productSizeRepository.findById(orderItemDto.getProductSizeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid product size ID"));

            // Only check and reduce stock if not skipping stock reduction
            if (!orderDto.isSkipStockReduction()) {
                // Check if there's enough stock
                if (productSize.getStockQuantity() < orderItemDto.getQuantity()) {
                    throw new IllegalArgumentException("Not enough stock for product size ID: " +
                            productSize.getProductSizeId() +
                            ". Available: " + productSize.getStockQuantity() +
                            ", Requested: " + orderItemDto.getQuantity());
                }

                // Reduce stock quantity
                productSize.setStockQuantity(productSize.getStockQuantity() - orderItemDto.getQuantity());
                productSizeRepository.save(productSize);
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProductSize(productSize);
            orderItem.setQuantity(orderItemDto.getQuantity());
            orderItem.setUnitPrice(orderItemDto.getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        // Save all order items
        orderItemRepository.saveAll(orderItems);

        // Ghi lại lịch sử trạng thái đơn hàng
        String changedBy = customer != null ? customer.getFullName()
                : (savedGuest != null ? savedGuest.getFullName() : "Khách vãng lai");
        
        if (paymentMethod == PaymentMethod.IN_STORE || paymentMethod == PaymentMethod.QR_CODE) {
            // Đơn hàng tại cửa hàng: ghi lịch sử trực tiếp đến DELIVERED
            orderStatusHistoryService.createStatusHistory(
                    savedOrder,
                    null, // fromStatus = null (tạo mới)
                    OrderStatus.DELIVERED,
                    changedBy,
                    "Đơn hàng tại cửa hàng - Đã giao hàng",
                    "127.0.0.1"
            );
        } else {
            // Đơn hàng online: bắt đầu từ PENDING_PAYMENT
            orderStatusHistoryService.createStatusHistory(
                    savedOrder,
                    null, // fromStatus = null (tạo mới)
                    OrderStatus.PENDING_PAYMENT,
                    changedBy,
                    "Đơn hàng được tạo mới",
                    "127.0.0.1"
            );
            
            // Tự động chuyển sang SHIPPED nếu đã thanh toán (VNPay hoặc đã xác nhận thanh toán)
            if (orderDto.isPaid() || paymentMethod == PaymentMethod.VNPAY) {
                savedOrder.setOrderStatus(OrderStatus.SHIPPED);
                savedOrder.setIsPaid(true);
                if (orderDto.isPaid()) {
                    savedOrder.setPaidAt(new Date());
                }
                Order updatedOrder = orderRepository.save(savedOrder);
                
                orderStatusHistoryService.createStatusHistory(
                        updatedOrder,
                        OrderStatus.PENDING_PAYMENT,
                        OrderStatus.SHIPPED,
                        "Hệ thống",
                        "Thanh toán đã được xác nhận",
                        "127.0.0.1"
                );
            }
        }

        // Xử lý voucher nếu có
        if (orderDto.getVoucherCode() != null && !orderDto.getVoucherCode().trim().isEmpty()) {
            try {
                // Lấy voucherCustomerId: nếu có customer thì dùng ID, nếu không thì dùng 0 (guest)
                int voucherCustomerId = customer != null ? customer.getCustomerId() : 0;
                
                System.out.println("Applying voucher: " + orderDto.getVoucherCode() + 
                                 " for customer ID: " + voucherCustomerId + 
                                 " on order: " + savedOrder.getOrderId());
                
                // Sử dụng method mới không tạo VoucherUsage
                voucherService.applyVoucherToOrder(orderDto.getVoucherCode(), voucherCustomerId, savedOrder.getOrderId());
                System.out.println("Voucher applied successfully!");
            } catch (Exception e) {
                System.err.println("Lỗi khi sử dụng voucher: " + e.getMessage());
                e.printStackTrace();
                // Không throw exception để không ảnh hưởng đến việc tạo đơn hàng
            }
        }

        // Return an OrderResponse
        return mapOrderToResponse(savedOrder, savedGuest, customer);
    }

    private String generateOrderId() {
        // Tạo mã đơn hàng có ý nghĩa: WBS + YYMMDD + số tự tăng trong ngày
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyMMdd");
        String dateStr = dateFormat.format(new Date());

        // Đếm số đơn hàng trong ngày
        String todayPrefix = "WBS" + dateStr;
        long todayCount = orderRepository.countByOrderIdStartingWith(todayPrefix);

        // Tạo mã với số thứ tự 4 chữ số
        String orderSequence = String.format("%04d", todayCount + 1);

        return todayPrefix + orderSequence;
        // Ví dụ: WBS2501010001 (WBS + 25/01/01 + 0001)
    }

    private long calculateTotalPrice(List<OrderItemDto> orderItemDtos) {
        return orderItemDtos.stream()
                .mapToLong(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    private OrderResponse mapOrderToResponse(Order savedOrder, Guest savedGuest, Customer customer) {
        // Map savedOrder to OrderResponse
        OrderResponse orderResponse = new OrderResponse();

        try {
            orderResponse.setOrderId(savedOrder.getOrderId());
            orderResponse.setOrderNote(savedOrder.getOrderNote());
            orderResponse.setPaymentMethod(savedOrder.getPaymentMethod());
            orderResponse.setTotalPrice(savedOrder.getTotalPrice());
            orderResponse.setOriginalPrice(savedOrder.getOriginalPrice());
            orderResponse.setVoucherDiscount(savedOrder.getVoucherDiscount());
            // Lấy mã voucher từ Order entity
            orderResponse.setVoucherCode(getVoucherCodeByOrderId(savedOrder.getOrderId()));
            orderResponse.setOrderStatus(savedOrder.getOrderStatus());

            // Set dates safely
            if (savedOrder.getCreatedAt() != null) {
                orderResponse.setOrderDate(savedOrder.getCreatedAt());
            }
            if (savedOrder.getPaidAt() != null) {
                orderResponse.setPaidAt(savedOrder.getPaidAt());
            }

            // Set payment status
            orderResponse.setPaid(savedOrder.getIsPaid() != null ? savedOrder.getIsPaid() : false);

            // Map guest or customer information based on association
            if (savedGuest != null) {
                orderResponse.setGuestName(savedGuest.getFullName());
                orderResponse.setGuestEmail(savedGuest.getEmail());
                orderResponse.setGuestPhone(savedGuest.getPhone());
                // Add shipping address from guest
                orderResponse.setShippingAddress(savedGuest.getAddress());
                orderResponse.setShippingAddress2(savedGuest.getAddress2());
                orderResponse.setShippingCity(savedGuest.getCity());
            }
            if (customer != null) {
                orderResponse.setCustomerName(customer.getFullName());
                orderResponse.setCustomerEmail(customer.getEmail());
                orderResponse.setCustomerPhone(customer.getPhone());
                // Add shipping address from customer
                orderResponse.setShippingAddress(customer.getAddress());
                orderResponse.setShippingAddress2(customer.getAddress2());
                orderResponse.setShippingCity(customer.getCity());
            }
            
            // Map shipping information
            if (savedOrder.getShipping() != null) {
                ShippingDto shippingDto = shippingService.getShippingById(savedOrder.getShipping().getShippingId()).orElse(null);
                if (shippingDto != null) {
                    orderResponse.setShippingId(shippingDto.getShippingId());
                    orderResponse.setShippingName(shippingDto.getShippingName());
                    orderResponse.setShippingFee(shippingDto.getShippingFee());
                    orderResponse.setDeliveryTime(shippingDto.getDeliveryTime());
                }
            }
            
            // Map assigned staff information
            if (savedOrder.getAssignedStaff() != null) {
                orderResponse.setAssignedStaffId(savedOrder.getAssignedStaff().getAdminUserId());
                orderResponse.setAssignedStaffName(savedOrder.getAssignedStaff().getFullName());
                orderResponse.setAssignedStaffEmail(savedOrder.getAssignedStaff().getEmail());
            }

            // Map order items
            if (savedOrder.getOrderItems() != null && !savedOrder.getOrderItems().isEmpty()) {
                System.out.println("Mapping " + savedOrder.getOrderItems().size() + " order items for order "
                        + savedOrder.getOrderId());
                List<OrderItemResponse> orderItems = savedOrder.getOrderItems().stream()
                        .map(this::mapOrderItemToResponse)
                        .collect(Collectors.toList());
                orderResponse.setOrderItems(orderItems);
                System.out.println("Successfully mapped " + orderItems.size() + " order items");
            } else {
                System.out.println("No order items found for order " + savedOrder.getOrderId());
                orderResponse.setOrderItems(new ArrayList<>());
            }

        } catch (Exception e) {
            System.err.println(
                    "Error in mapOrderToResponse for order " + savedOrder.getOrderId() + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error mapping order response", e);
        }

        return orderResponse;
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllOrderByCreatedAtDesc().stream()
                .map(order -> {
                    // Explicitly pass null for customer when no customer exists for the order
                    return mapOrderToResponse(order, order.getGuest(), order.getCustomer());
                })
                .collect(Collectors.toList());
    }

    public OrderFilterResponse getFilteredOrders(OrderFilterDto filterDto) {
        // Get all orders first
        List<Order> allOrders = orderRepository.findAllOrderByCreatedAtDesc();
        int totalOrdersBeforeFilter = allOrders.size();

        // Apply filters
        List<Order> filteredOrders = allOrders.stream()
                .filter(order -> applyFilters(order, filterDto))
                .collect(Collectors.toList());

        // Apply sorting
        applySorting(filteredOrders, filterDto);

        // Create filter summary
        OrderFilterResponse.OrderFilterSummary summary = new OrderFilterResponse.OrderFilterSummary(
                totalOrdersBeforeFilter,
                filteredOrders.size(),
                filterDto.hasDateRange(),
                filterDto.hasStatusFilter(),
                filterDto.hasPaymentFilter(),
                filterDto.hasSearchText(),
                filterDto.hasCustomerTypeFilter()
        );

        // Apply pagination
        int page = filterDto.getPage() != null ? filterDto.getPage() : 0;
        int size = filterDto.getSize() != null ? filterDto.getSize() : 10;
        
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, filteredOrders.size());
        
        List<Order> paginatedOrders = startIndex < filteredOrders.size() 
                ? filteredOrders.subList(startIndex, endIndex) 
                : new ArrayList<>();

        // Convert to OrderResponse
        List<OrderResponse> orderResponses = paginatedOrders.stream()
                .map(order -> mapOrderToResponse(order, order.getGuest(), order.getCustomer()))
                .collect(Collectors.toList());

        // Calculate pagination info
        int totalPages = (int) Math.ceil((double) filteredOrders.size() / size);
        boolean hasNext = page < totalPages - 1;
        boolean hasPrevious = page > 0;

        return new OrderFilterResponse(
                orderResponses,
                filteredOrders.size(),
                totalPages,
                page,
                size,
                hasNext,
                hasPrevious,
                summary
        );
    }

    private boolean applyFilters(Order order, OrderFilterDto filterDto) {
        // Search text filter
        if (filterDto.hasSearchText()) {
            String searchText = filterDto.getSearchText().toLowerCase().trim();
            boolean matchesSearch = false;

            // Check order ID
            if (order.getOrderId() != null && order.getOrderId().toLowerCase().contains(searchText)) {
                matchesSearch = true;
            }

            // Check customer name
            if (order.getCustomer() != null && order.getCustomer().getFullName() != null 
                    && order.getCustomer().getFullName().toLowerCase().contains(searchText)) {
                matchesSearch = true;
            }

            // Check guest name
            if (order.getGuest() != null && order.getGuest().getFullName() != null 
                    && order.getGuest().getFullName().toLowerCase().contains(searchText)) {
                matchesSearch = true;
            }

            // Check customer phone
            if (order.getCustomer() != null && order.getCustomer().getPhone() != null 
                    && order.getCustomer().getPhone().contains(searchText)) {
                matchesSearch = true;
            }

            // Check guest phone
            if (order.getGuest() != null && order.getGuest().getPhone() != null 
                    && order.getGuest().getPhone().contains(searchText)) {
                matchesSearch = true;
            }

            if (!matchesSearch) {
                return false;
            }
        }

        // Status filter
        if (filterDto.hasStatusFilter()) {
            if (!filterDto.getStatusFilter().equals(order.getOrderStatus().toString())) {
                return false;
            }
        }

        // Payment filter
        if (filterDto.hasPaymentFilter()) {
            boolean isPaid = order.getIsPaid();
            if ("paid".equals(filterDto.getPaymentFilter()) && !isPaid) {
                return false;
            }
            if ("unpaid".equals(filterDto.getPaymentFilter()) && isPaid) {
                return false;
            }
        }

        // Customer type filter
        if (filterDto.hasCustomerTypeFilter()) {
            boolean isOnlineOrder = isOnlinePaymentMethod(order.getPaymentMethod());
            if ("online".equals(filterDto.getCustomerTypeFilter()) && !isOnlineOrder) {
                return false;
            }
            if ("counter".equals(filterDto.getCustomerTypeFilter()) && isOnlineOrder) {
                return false;
            }
        }

        // Date range filter
        if (filterDto.hasDateRange()) {
            LocalDateTime orderDateTime = order.getCreatedAt().toInstant()
                    .atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
            
            LocalDate orderDate = orderDateTime.toLocalDate();
            
            if (orderDate.isBefore(filterDto.getStartDate()) || orderDate.isAfter(filterDto.getEndDate())) {
                return false;
            }
        }

        return true;
    }

    private boolean isOnlinePaymentMethod(PaymentMethod paymentMethod) {
        return paymentMethod == PaymentMethod.CASH_ON_DELIVERY || paymentMethod == PaymentMethod.VNPAY;
    }

    private void applySorting(List<Order> orders, OrderFilterDto filterDto) {
        if (filterDto.getSortBy() == null) {
            // Default sorting by createdAt desc
            orders.sort((o1, o2) -> {
                Date date1 = o1.getCreatedAt();
                Date date2 = o2.getCreatedAt();
                if (date1 == null && date2 == null) return 0;
                if (date1 == null) return 1;
                if (date2 == null) return -1;
                return date2.compareTo(date1); // Descending
            });
            return;
        }

        boolean ascending = "asc".equalsIgnoreCase(filterDto.getSortDirection());

        switch (filterDto.getSortBy().toLowerCase()) {
            case "orderdate":
            case "createdat":
                orders.sort((o1, o2) -> {
                    Date date1 = o1.getCreatedAt();
                    Date date2 = o2.getCreatedAt();
                    if (date1 == null && date2 == null) return 0;
                    if (date1 == null) return ascending ? 1 : -1;
                    if (date2 == null) return ascending ? -1 : 1;
                    return ascending ? date1.compareTo(date2) : date2.compareTo(date1);
                });
                break;
            case "orderid":
                orders.sort((o1, o2) -> {
                    String id1 = o1.getOrderId();
                    String id2 = o2.getOrderId();
                    if (id1 == null && id2 == null) return 0;
                    if (id1 == null) return ascending ? 1 : -1;
                    if (id2 == null) return ascending ? -1 : 1;
                    return ascending ? id1.compareTo(id2) : id2.compareTo(id1);
                });
                break;
            case "totalprice":
                orders.sort((o1, o2) -> {
                    Long price1 = o1.getTotalPrice();
                    Long price2 = o2.getTotalPrice();
                    if (price1 == null && price2 == null) return 0;
                    if (price1 == null) return ascending ? 1 : -1;
                    if (price2 == null) return ascending ? -1 : 1;
                    return ascending ? price1.compareTo(price2) : price2.compareTo(price1);
                });
                break;
            default:
                // Default sorting by createdAt desc
                orders.sort((o1, o2) -> {
                    Date date1 = o1.getCreatedAt();
                    Date date2 = o2.getCreatedAt();
                    if (date1 == null && date2 == null) return 0;
                    if (date1 == null) return 1;
                    if (date2 == null) return -1;
                    return date2.compareTo(date1);
                });
        }
    }

    public List<OrderResponse> getOrdersByCustomerId(Integer customerId) {
        try {
            System.out.println("Fetching orders for customer ID: " + customerId);
            List<Order> orders = orderRepository.findByCustomerCustomerIdWithItems(customerId);
            System.out.println("Found " + orders.size() + " orders");

            // Remove duplicates by orderId (in case JOIN FETCH creates duplicates)
            Map<String, Order> uniqueOrders = new LinkedHashMap<>();
            for (Order order : orders) {
                uniqueOrders.put(order.getOrderId(), order);
            }
            orders = new ArrayList<>(uniqueOrders.values());
            System.out.println("After deduplication: " + orders.size() + " orders");

            for (Order order : orders) {
                System.out.println("Order ID: " + order.getOrderId() +
                        ", Order Items count: "
                        + (order.getOrderItems() != null ? order.getOrderItems().size() : "null"));
            }

            return orders.stream()
                    .sorted((order1, order2) -> {
                        // Sắp xếp theo createdAt giảm dần (đơn hàng mới nhất lên trên)
                        Date date1 = order1.getCreatedAt();
                        Date date2 = order2.getCreatedAt();
                        if (date1 == null && date2 == null) return 0;
                        if (date1 == null) return 1;
                        if (date2 == null) return -1;
                        return date2.compareTo(date1); // Descending order
                    })
                    .map(order -> {
                        try {
                            return mapOrderToResponse(order, order.getGuest(), order.getCustomer());
                        } catch (Exception e) {
                            System.err.println("Error mapping order " + order.getOrderId() + ": " + e.getMessage());
                            e.printStackTrace();
                            throw new RuntimeException("Error processing order: " + order.getOrderId(), e);
                        }
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching orders for customer " + customerId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error fetching orders for customer: " + customerId, e);
        }
    }

    public OrderResponse getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    // Explicitly pass null for customer when no customer exists for the order
                    return mapOrderToResponse(order, order.getGuest(), order.getCustomer());
                })
                .orElse(null);
    }

    private OrderItemResponse mapOrderItemToResponse(OrderItem orderItem) {
        OrderItemResponse orderItemResponse = new OrderItemResponse();

        try {
            if (orderItem == null) {
                throw new IllegalArgumentException("OrderItem cannot be null");
            }

            if (orderItem.getProductSize() == null) {
                throw new IllegalArgumentException("ProductSize cannot be null for order item");
            }

            if (orderItem.getProductSize().getProductColor() == null) {
                throw new IllegalArgumentException("ProductColor cannot be null for order item");
            }

            if (orderItem.getProductSize().getProductColor().getProduct() == null) {
                throw new IllegalArgumentException("Product cannot be null for order item");
            }

            orderItemResponse
                    .setProductName(orderItem.getProductSize().getProductColor().getProduct().getProductName());
            orderItemResponse.setColorName(orderItem.getProductSize().getProductColor().getColorName());
            orderItemResponse.setSizeValue(orderItem.getProductSize().getSizeValue());
            orderItemResponse.setQuantity(orderItem.getQuantity());
            orderItemResponse.setUnitPrice(orderItem.getUnitPrice());

            // Set product ID
            orderItemResponse.setProductId(orderItem.getProductSize().getProductColor().getProduct().getProductId());

            // Set image URL from product color images (first image if available, fallback to product color image)
            ProductColor productColor = orderItem.getProductSize().getProductColor();
            String imageUrl = null;
            
            // Try to get first image from ProductColorImage collection
            try {
                var productColorImages = productColorImageRepository.findAll()
                    .stream()
                    .filter(img -> img.getProductColor().getProductColorId().equals(productColor.getProductColorId()))
                    .findFirst();
                
                if (productColorImages.isPresent()) {
                    imageUrl = productColorImages.get().getImageUrl();
                }
            } catch (Exception e) {
                System.err.println("Error fetching product color images: " + e.getMessage());
            }
            
            // Fallback to ProductColor imageUrl if no images found
            if (imageUrl == null || imageUrl.isEmpty()) {
                imageUrl = productColor.getImageUrl();
            }
            
            // Add BASE_URL if needed
            if (imageUrl != null && !imageUrl.isEmpty() &&
                !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
                imageUrl = "http://localhost:8080/uploads/" + imageUrl;
            }
            
            orderItemResponse.setImageUrl(imageUrl);

        } catch (Exception e) {
            System.err.println("Error mapping order item: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error mapping order item response", e);
        }

        return orderItemResponse;
    }

    public List<OrderItemResponse> getOrderItemsByOrderId(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));
        return orderItemRepository.findByOrder(order).stream()
                .map(this::mapOrderItemToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteOrder(String orderId) {
        // Fetch the order by its ID
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        // Restore stock if order is not cancelled (meaning stock was reduced when created)
        if (order.getOrderStatus() != OrderStatus.CANCELED) {
            restoreStock(order);
        }

        // Delete all OrderItems associated with the order
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
        if (!orderItems.isEmpty()) {
            orderItemRepository.deleteAll(orderItems);
        }

        // Delete the order
        orderRepository.delete(order);
    }

    @Transactional
    public OrderResponse updateOrder(String orderId, OrderDto orderDto) {
        Order order = orderRepository.findById(orderId)
                .orElse(null);
        if (order == null) {
            return null;
        }
        // Update fields as needed
        if (orderDto.getOrderNote() != null) {
            order.setOrderNote(orderDto.getOrderNote());
        }
        if (orderDto.getPaymentMethod() != null) {
            order.setPaymentMethod(orderDto.getPaymentMethod());
        }
        order.setIsPaid(orderDto.isPaid());
        order.setUpdatedAt(new java.util.Date());
        // Optionally update other fields (add as needed)
        Order savedOrder = orderRepository.save(order);
        return mapOrderToResponse(savedOrder, order.getGuest(), order.getCustomer());
    }
    
    public OrderResponse updateStaffAssignment(String orderId, String staffId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        if (staffId != null && !staffId.trim().isEmpty()) {
            vn.student.polyshoes.model.AdminUser staff = adminUserRepository.findById(staffId)
                    .orElseThrow(() -> new IllegalArgumentException("Staff not found"));
            order.setAssignedStaff(staff);
        } else {
            order.setAssignedStaff(null);
        }
        
        order.setUpdatedAt(new Date());
        Order savedOrder = orderRepository.save(order);
        return mapOrderToResponse(savedOrder, order.getGuest(), order.getCustomer());
    }
    
    public OrderResponse processReturnOrder(String orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        // Check if order can be returned
        if (order.getOrderStatus() != OrderStatus.FAILED && 
            order.getOrderStatus() != OrderStatus.OUT_FOR_DELIVERY &&
            order.getOrderStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Đơn hàng không thể trả về với trạng thái hiện tại");
        }
        
        // Update order status to RETURNED
        OrderStatus oldStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.RETURNED);
        order.setUpdatedAt(new Date());
        
        Order savedOrder = orderRepository.save(order);
        
        // Create status history
        orderStatusHistoryService.createStatusHistory(
            savedOrder,
            oldStatus,
            OrderStatus.RETURNED,
            "Admin",
            reason != null ? reason : "Xử lý trả hàng",
            "127.0.0.1"
        );
        
        // Restore stock for returned items
        if (savedOrder.getOrderItems() != null) {
            for (OrderItem item : savedOrder.getOrderItems()) {
                ProductSize productSize = item.getProductSize();
                productSize.setStockQuantity(productSize.getStockQuantity() + item.getQuantity());
                productSizeRepository.save(productSize);
            }
        }
        
        return mapOrderToResponse(savedOrder, order.getGuest(), order.getCustomer());
    }
    
    public OrderResponse cancelOrder(String orderId, String reason, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        // Check cancellation rules
        if (isAdmin) {
            // Admin cannot cancel from SHIPPED and beyond
            if (order.getOrderStatus() == OrderStatus.SHIPPED || 
                order.getOrderStatus() == OrderStatus.OUT_FOR_DELIVERY ||
                order.getOrderStatus() == OrderStatus.DELIVERED ||
                order.getOrderStatus() == OrderStatus.COMPLETED ||
                order.getOrderStatus() == OrderStatus.CANCELED ||
                order.getOrderStatus() == OrderStatus.RETURNED ||
                order.getOrderStatus() == OrderStatus.REFUNDED) {
                throw new IllegalArgumentException("Admin không thể hủy đơn hàng từ trạng thái 'Chờ vận chuyển' trở đi");
            }
        } else {
            // Customer cannot cancel from PROCESSING and beyond
            if (order.getOrderStatus() == OrderStatus.PROCESSING ||
                order.getOrderStatus() == OrderStatus.SHIPPED || 
                order.getOrderStatus() == OrderStatus.OUT_FOR_DELIVERY ||
                order.getOrderStatus() == OrderStatus.DELIVERED ||
                order.getOrderStatus() == OrderStatus.COMPLETED ||
                order.getOrderStatus() == OrderStatus.CANCELED ||
                order.getOrderStatus() == OrderStatus.RETURNED ||
                order.getOrderStatus() == OrderStatus.REFUNDED) {
                throw new IllegalArgumentException("Khách hàng không thể hủy đơn hàng từ trạng thái 'Đã xác nhận' trở đi");
            }
        }
        
        // Update order status to CANCELED
        OrderStatus oldStatus = order.getOrderStatus();
        order.setOrderStatus(OrderStatus.CANCELED);
        order.setUpdatedAt(new Date());
        
        Order savedOrder = orderRepository.save(order);
        
        // Create status history
        String changedBy = isAdmin ? "Admin" : "Customer";
        orderStatusHistoryService.createStatusHistory(
            savedOrder,
            oldStatus,
            OrderStatus.CANCELED,
            changedBy,
            reason != null ? reason : "Hủy đơn hàng",
            "127.0.0.1"
        );
        
        // Restore stock for canceled items
        if (savedOrder.getOrderItems() != null) {
            for (OrderItem item : savedOrder.getOrderItems()) {
                ProductSize productSize = item.getProductSize();
                productSize.setStockQuantity(productSize.getStockQuantity() + item.getQuantity());
                productSizeRepository.save(productSize);
            }
        }
        
        return mapOrderToResponse(savedOrder, order.getGuest(), order.getCustomer());
    }

    public String createVNPayPaymentUrl(String orderId, long amount) {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VNPAYConfig.vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(amount * 100)); // VNPay nhận số tiền theo đơn vị VND * 100
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", orderId);
        params.put("vnp_OrderInfo", "Thanh toan don hang: " + orderId);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", VNPAYConfig.vnp_Returnurl);
        params.put("vnp_IpAddr", "127.0.0.1");
        params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

        // Sắp xếp params theo thứ tự key (quan trọng để tạo chữ ký)
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String value = params.get(fieldName);
            if (value != null && !value.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8))
                        .append('&');
                query.append(fieldName).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8))
                        .append('&');
            }
        }

        // Xóa ký tự '&' cuối cùng
        hashData.setLength(hashData.length() - 1);
        query.setLength(query.length() - 1);

        // Tạo chữ ký bảo mật
        String secureHash = VNPAYConfig.hmacSHA512(VNPAYConfig.vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        return VNPAYConfig.vnp_PayUrl + "?" + query.toString();
    }

    @Transactional
    public OrderResponse updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        OrderStatus oldStatus = order.getOrderStatus();
        OrderStatus newStatus = OrderStatus.valueOf(status);

        // If order is being cancelled, restore stock
        if (newStatus == OrderStatus.CANCELED && oldStatus != OrderStatus.CANCELED) {
            restoreStock(order);
        }
        // If order is being uncancelled (from cancelled to other status), reduce stock
        // again
        else if (oldStatus == OrderStatus.CANCELED && newStatus != OrderStatus.CANCELED) {
            reduceStock(order);
        }

        // Tự động cập nhật trạng thái thanh toán
        if (newStatus == OrderStatus.DELIVERED) {
            // Nếu chuyển sang "Đã giao hàng" và là COD hoặc chưa thanh toán thì đánh dấu đã thanh toán
            if (order.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY || !order.getIsPaid()) {
                order.setIsPaid(true);
                order.setPaidAt(new Date());
            }
        }
        else if (newStatus == OrderStatus.COMPLETED) {
            // Nếu chuyển sang "Hoàn thành" thì đảm bảo đã được đánh dấu là đã thanh toán
            if (!order.getIsPaid()) {
                order.setIsPaid(true);
                order.setPaidAt(new Date());
            }
        }
        else if (newStatus == OrderStatus.RETURNED && order.getPaymentMethod() == PaymentMethod.VNPAY) {
            // Nếu chuyển sang "Đã trả hàng" và là VNPay thì đánh dấu đã thanh toán (để có thể hoàn tiền)
            if (!order.getIsPaid()) {
                order.setIsPaid(true);
                order.setPaidAt(new Date());
            }
        }
        else if (order.getPaymentMethod() == PaymentMethod.IN_STORE) {
            // Đơn hàng trong cửa hàng tự động được đánh dấu đã giao và đã thanh toán
            if (newStatus == OrderStatus.PROCESSING || newStatus == OrderStatus.PAYMENT_CONFIRMED) {
                newStatus = OrderStatus.DELIVERED; // Tự động chuyển thành đã giao
                order.setIsPaid(true);
                order.setPaidAt(new Date());
            }
        }
        order.setOrderStatus(newStatus);

        order.setUpdatedAt(new Date());

        Order savedOrder = orderRepository.save(order);
        return mapOrderToResponse(savedOrder, order.getGuest(), order.getCustomer());
    }

    private void restoreStock(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
        for (OrderItem item : orderItems) {
            ProductSize productSize = item.getProductSize();
            productSize.setStockQuantity(productSize.getStockQuantity() + item.getQuantity());
            productSizeRepository.save(productSize);
        }
    }

    private void reduceStock(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
        for (OrderItem item : orderItems) {
            ProductSize productSize = item.getProductSize();
            if (productSize.getStockQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock to process order. Product Size ID: " +
                        productSize.getProductSizeId() +
                        ". Available: " + productSize.getStockQuantity() +
                        ", Required: " + item.getQuantity());
            }
            productSize.setStockQuantity(productSize.getStockQuantity() - item.getQuantity());
            productSizeRepository.save(productSize);
        }
    }

    public OrderResponse paidOrder(String orderId) {
        // Fetch the order by ID
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + orderId));

        // Update the order status

        order.setOrderStatus(OrderStatus.PAYMENT_CONFIRMED);
        order.setPaidAt(new Date());
        order.setIsPaid(true);

        // Save the updated order
        Order updatedOrder = orderRepository.save(order);

        // Return the updated order response
        return mapOrderToResponse(updatedOrder, updatedOrder.getGuest(), updatedOrder.getCustomer());
    }

    // Cập nhật trạng thái đơn hàng với ghi lại lịch sử
    @Transactional
    public OrderResponse updateOrderStatus(String orderId, OrderStatus newStatus, String changedBy,
            String changeReason, String ipAddress) {
        // Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng với ID: " + orderId));

        // Lưu trạng thái cũ
        OrderStatus oldStatus = order.getOrderStatus();
        
        // Xử lý stock khi hủy đơn hoặc khôi phục đơn
        if (newStatus == OrderStatus.CANCELED && oldStatus != OrderStatus.CANCELED) {
            restoreStock(order);
        }
        else if (oldStatus == OrderStatus.CANCELED && newStatus != OrderStatus.CANCELED) {
            reduceStock(order);
        }

        // Cập nhật trạng thái mới
        order.setOrderStatus(newStatus);
        order.setUpdatedAt(new Date());
        
        // Tự động cập nhật trạng thái thanh toán
        if (newStatus == OrderStatus.DELIVERED) {
            // Nếu chuyển sang "Đã giao hàng" và là COD hoặc chưa thanh toán thì đánh dấu đã thanh toán
            if (order.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY || !order.getIsPaid()) {
                order.setIsPaid(true);
                order.setPaidAt(new Date());
            }
        }
        else if (newStatus == OrderStatus.COMPLETED) {
            // Nếu chuyển sang "Hoàn thành" thì đảm bảo đã được đánh dấu là đã thanh toán
            if (!order.getIsPaid()) {
                order.setIsPaid(true);
                order.setPaidAt(new Date());
            }
        }
        else if (newStatus == OrderStatus.RETURNED && order.getPaymentMethod() == PaymentMethod.VNPAY) {
            // Nếu chuyển sang "Đã trả hàng" và là VNPay thì đánh dấu đã thanh toán (để có thể hoàn tiền)
            if (!order.getIsPaid()) {
                order.setIsPaid(true);
                order.setPaidAt(new Date());
            }
        }
        else if (order.getPaymentMethod() == PaymentMethod.IN_STORE) {
            // Đơn hàng trong cửa hàng tự động được đánh dấu đã giao và đã thanh toán
            if (newStatus == OrderStatus.PROCESSING || newStatus == OrderStatus.PAYMENT_CONFIRMED) {
                order.setOrderStatus(OrderStatus.DELIVERED); // Tự động chuyển thành đã giao
                order.setIsPaid(true);
                order.setPaidAt(new Date());
                // Cập nhật newStatus để ghi lịch sử chính xác
                newStatus = OrderStatus.DELIVERED;
            }
        }

        // Lưu đơn hàng
        Order updatedOrder = orderRepository.save(order);

        // Ghi lại lịch sử thay đổi trạng thái
        orderStatusHistoryService.createStatusHistory(
                updatedOrder,
                oldStatus,
                newStatus,
                changedBy,
                changeReason != null ? changeReason : "Cập nhật trạng thái đơn hàng",
                ipAddress != null ? ipAddress : "127.0.0.1");

        return mapOrderToResponse(updatedOrder, updatedOrder.getGuest(), updatedOrder.getCustomer());
    }
    
    /**
     * Lấy mã voucher cho đơn hàng từ Order entity
     * @param orderId ID đơn hàng
     * @return mã voucher nếu tìm thấy, null nếu không
     */
    private String getVoucherCodeByOrderId(String orderId) {
        try {
            return orderRepository.findById(orderId)
                    .map(order -> {
                        // Lấy mã voucher từ relationship Voucher
                        if (order.getVoucher() != null) {
                            return order.getVoucher().getCode();
                        }
                        return null;
                    })
                    .orElse(null);
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy mã voucher cho đơn hàng " + orderId + ": " + e.getMessage());
            return null;
        }
    }


}
