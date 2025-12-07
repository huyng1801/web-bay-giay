
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.student.polyshoes.dto.GuestDto;
import vn.student.polyshoes.dto.LoginUserDto;
import vn.student.polyshoes.dto.OrderDto;
import vn.student.polyshoes.dto.OrderItemDto;
import vn.student.polyshoes.dto.OrderRequestDto;
import vn.student.polyshoes.dto.ProductFeedbackDto;
import vn.student.polyshoes.dto.RegisterDto;
import vn.student.polyshoes.dto.ShippingDto;
import vn.student.polyshoes.enums.Gender;
import vn.student.polyshoes.exception.InvalidCredentialsException;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.Banner;
import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.Voucher;
import vn.student.polyshoes.response.CategoryResponse;
import vn.student.polyshoes.response.CustomerResponse;
import vn.student.polyshoes.response.OrderResponse;
import vn.student.polyshoes.response.OrderStatusHistoryResponse;
import vn.student.polyshoes.response.ProductColorImageResponse;
import vn.student.polyshoes.response.ProductColorResponse;
import vn.student.polyshoes.response.ProductFeedbackResponse;
import vn.student.polyshoes.response.ProductResponse;
import vn.student.polyshoes.response.ProductSizeResponse;
import vn.student.polyshoes.response.SubCategoryResponse;
import vn.student.polyshoes.service.BannerService;
import vn.student.polyshoes.service.CategoryService;
import vn.student.polyshoes.service.CustomerService;
import vn.student.polyshoes.service.HomeService;
import vn.student.polyshoes.service.OrderService;
import vn.student.polyshoes.service.OrderStatusHistoryService;
import vn.student.polyshoes.service.ProductColorImageService;
import vn.student.polyshoes.service.ProductColorService;
import vn.student.polyshoes.service.ProductFeedbackService;
import vn.student.polyshoes.service.ProductService;
import vn.student.polyshoes.service.ProductSizeService;
import vn.student.polyshoes.service.ShippingService;
import vn.student.polyshoes.service.SubCategoryService;
import vn.student.polyshoes.service.VoucherService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/home/")
public class HomeController {

    // Services
    @Autowired
    private BannerService bannerService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private SubCategoryService subCategoryService;
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductColorService productColorService;
    @Autowired
    private ProductSizeService productSizeService;
    @Autowired
    private ProductColorImageService productColorImageService;
    @Autowired
    private ProductFeedbackService productFeedbackService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderStatusHistoryService orderStatusHistoryService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private ShippingService shippingService;
    @Autowired
    private VoucherService voucherService;
    @Autowired
    private HomeService homeService;

    // ========== BANNER ENDPOINTS ==========
    @GetMapping("banners")
    public ResponseEntity<List<Banner>> getAllBanners() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    // ========== CATEGORY & SUBCATEGORY ENDPOINTS ==========
    @GetMapping("categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("subcategories")
    public ResponseEntity<List<SubCategoryResponse>> getSubCategories(
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "gender", required = false) Gender gender) {
        return ResponseEntity.ok(subCategoryService.getSubCategories(categoryId, gender));
    }

    // ========== PRODUCT ENDPOINTS ==========
    @GetMapping("products")
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) Integer subCategoryId,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) String productName) {
        List<ProductResponse> productResponses = productService.getAllProducts(subCategoryId, gender, productName);
        List<ProductResponse> activeProducts = productResponses.stream()
                .filter(product -> product.getIsActive() != null && product.getIsActive())
                .collect(Collectors.toList());
        return ResponseEntity.ok(activeProducts);
    }

    @GetMapping("product/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Integer productId) {
        ProductResponse productResponse = productService.getProductById(productId);
        if (productResponse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productResponse);
    }

    @GetMapping("product-color/{productId}")
    public ResponseEntity<List<ProductColorResponse>> findByProductId(@PathVariable Integer productId) {
        return ResponseEntity.ok(productColorService.findByProduct_ProductId(productId));
    }

    @GetMapping("product-size/product-color/{productColorId}")
    public ResponseEntity<List<ProductSizeResponse>> findByProductColorId(@PathVariable Integer productColorId) {
        return ResponseEntity.ok(productSizeService.findByProductColorId(productColorId));
    }

    @GetMapping("product-image/product-color/{productColorId}")
    public ResponseEntity<List<ProductColorImageResponse>> getImagesByProductColorId(@PathVariable Integer productColorId) {
        return ResponseEntity.ok(productColorImageService.findByProductColorId(productColorId));
    }

    // ========== PRODUCT FEEDBACK ENDPOINTS ==========
    @PostMapping("feedback")
    public ResponseEntity<ProductFeedbackResponse> createProductFeedback(@RequestBody ProductFeedbackDto feedbackDto) {
        try {
            ProductFeedbackResponse response = productFeedbackService.createFeedback(feedbackDto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("feedback/product/{productId}")
    public ResponseEntity<List<ProductFeedbackResponse>> getFeedbacksByProduct(@PathVariable Integer productId) {
        try {
            List<ProductFeedbackResponse> feedbacks = productFeedbackService.getFeedbacksByProduct(productId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Get top reviews for home page
    @GetMapping("reviews/top")
    public ResponseEntity<List<ProductFeedbackResponse>> getTopReviews(
            @RequestParam(value = "limit", defaultValue = "4") int limit) {
        try {
            List<ProductFeedbackResponse> topReviews = productFeedbackService.getTopReviews(limit);
            return ResponseEntity.ok(topReviews);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // ========== ORDER ENDPOINTS ==========
    @PostMapping("orders")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        GuestDto guestDto = orderRequestDto.getGuestDto();
        OrderDto orderDto = orderRequestDto.getOrderDto();
        int customerId = orderRequestDto.getCustomerId();
        List<OrderItemDto> orderItemDtos = orderRequestDto.getOrderItemDtos();
        OrderResponse orderResponse = orderService.createOrder(customerId, guestDto, orderDto, orderItemDtos);
        return ResponseEntity.ok(orderResponse);
    }

    @GetMapping("orders/customer/{customerId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomerId(@PathVariable Integer customerId) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByCustomerId(customerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("orders/{orderId}/history")
    public ResponseEntity<?> getOrderStatusHistory(@PathVariable String orderId) {
        try {
            List<OrderStatusHistoryResponse> history = orderStatusHistoryService.getOrderStatusHistory(orderId);
            history.forEach(h -> {
                h.setIpAddress("***");
                if (h.getChangedBy() != null && h.getChangedBy().startsWith("Admin:")) {
                    h.setChangedBy("Nhân viên hệ thống");
                }
            });
            return ResponseEntity.ok(Map.of(
                    "message", "Lấy lịch sử trạng thái thành công",
                    "history", history));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Lỗi khi lấy lịch sử: " + e.getMessage()));
        }
    }

    // ========== PAYMENT (VNPAY) ENDPOINTS ==========
    @PostMapping("vnpay-payment")
    public ResponseEntity<?> createVNPayPayment(@RequestParam String orderId, @RequestParam long amount) {
        String paymentUrl = orderService.createVNPayPaymentUrl(orderId, amount);
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("vnpay-return")
    public ResponseEntity<String> vnpayReturn(@RequestParam Map<String, String> params) {
        String orderId = params.get("vnp_TxnRef");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        if ("00".equals(vnp_ResponseCode)) {
            orderService.paidOrder(orderId);
            return ResponseEntity.ok("Thanh toán thành công! Đơn hàng #" + orderId + " đã được cập nhật.");
        } else {
            return ResponseEntity.ok("Thanh toán không thành công! Vui lòng thử lại.");
        }
    }

    // ========== VOUCHER ENDPOINTS ==========
    @GetMapping("vouchers/available")
    public ResponseEntity<List<Voucher>> getAvailableVouchers(
            @RequestParam Integer customerId,
            @RequestParam Double orderValue) {
        try {
            List<Voucher> availableVouchers = homeService.getAvailableVouchersForCustomer(customerId, orderValue);
            return ResponseEntity.ok(availableVouchers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("vouchers/validate")
    public ResponseEntity<HomeService.VoucherValidationResult> validateVoucher(
            @RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("voucherCode");
            Integer customerId = (Integer) request.get("customerId");
            Double orderValue = Double.parseDouble(request.get("orderValue").toString());
            HomeService.VoucherValidationResult result = homeService.validateVoucher(code, customerId, orderValue);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new HomeService.VoucherValidationResult(false, "Lỗi kiểm tra voucher: " + e.getMessage(), null, null));
        }
    }

    @PostMapping("vouchers/apply")
    public ResponseEntity<Map<String, Object>> applyVoucherForValidation(
            @RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("voucherCode");
            Integer customerId = (Integer) request.get("customerId");
            Double orderValue = Double.parseDouble(request.get("orderValue").toString());
            HomeService.VoucherValidationResult result = homeService.validateVoucher(code, customerId, orderValue);
            if (result.isValid()) {
                return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "message", "Voucher hợp lệ",
                        "discountAmount", result.getDiscountAmount(),
                        "voucher", result.getVoucher()));
            } else {
                return ResponseEntity.ok(Map.of(
                        "valid", false,
                        "message", result.getMessage(),
                        "discountAmount", 0));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Lỗi áp dụng voucher: " + e.getMessage(),
                    "discountAmount", 0));
        }
    }

    @PostMapping("vouchers/apply-to-order")
    public ResponseEntity<String> applyVoucherToOrder(
            @RequestParam String code,
            @RequestParam Integer customerId,
            @RequestParam String orderId) {
        try {
            voucherService.applyVoucher(code, customerId, orderId);
            return ResponseEntity.ok("Voucher đã được áp dụng thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========== CUSTOMER ENDPOINTS ==========
    @PostMapping("register")
    public ResponseEntity<Customer> register(@RequestBody RegisterDto registerDto) {
        try {
            Customer registeredCustomer = customerService.register(registerDto);
            return ResponseEntity.ok(registeredCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody LoginUserDto loginDto) {
        try {
            String token = customerService.login(loginDto);
            return ResponseEntity.ok(token);
        } catch (ResourceNotFoundException | InvalidCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid credentials.");
        }
    }

    @GetMapping("customer/{customerId}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Integer customerId) {
        Customer customer = customerService.getCustomerById(customerId);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toCustomerResponse(customer));
    }

    @GetMapping("customer/email/{email}")
    public ResponseEntity<CustomerResponse> getCustomerByEmail(@PathVariable("email") String email) {
        Customer customer = customerService.getCustomerByEmail(email);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toCustomerResponse(customer));
    }

    // ========== SHIPPING ENDPOINTS ==========
    @GetMapping("shippings/active")
    public ResponseEntity<List<ShippingDto>> getActiveShippings() {
        try {
            List<ShippingDto> shippings = shippingService.getActiveShippings();
            return ResponseEntity.ok(shippings);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("shippings/type/{shippingType}")
    public ResponseEntity<List<ShippingDto>> getShippingsByType(@PathVariable String shippingType) {
        try {
            List<ShippingDto> shippings = shippingService.getShippingsByType(shippingType);
            return ResponseEntity.ok(shippings);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(null);
        }
    }

    // ========== HELPER METHODS ==========
    private CustomerResponse toCustomerResponse(Customer customer) {
        return new CustomerResponse(
                customer.getCustomerId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getAddress2(),
                customer.getCity(),
                customer.getIsActive()
        );
    }
    // ========== ORDER CANCEL ENDPOINT ========== 

    @PostMapping("order/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrderForCustomer(
            @PathVariable String orderId,
            @RequestParam(required = true) Integer customerId,
            @RequestBody(required = false) Map<String, String> body) {
        // Validate input parameters
        if (orderId == null || orderId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        if (customerId == null) {
            return ResponseEntity.badRequest().body(null);
        }
        
        String cancelReason = body != null ? body.getOrDefault("cancelReason", null) : null;
        try {
            // Lấy tên khách hàng để ghi lịch sử
            String changedBy = null;
            try {
                Customer customer = customerService.getCustomerById(customerId);
                changedBy = customer != null ? customer.getFullName() : "Khách hàng";
            } catch (Exception e) {
                changedBy = "Khách hàng";
            }
            OrderResponse response = orderService.updateOrderStatus(
                orderId,
                vn.student.polyshoes.enums.OrderStatus.CANCELED,
                changedBy,
                cancelReason,
                "127.0.0.1"
            );
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

}