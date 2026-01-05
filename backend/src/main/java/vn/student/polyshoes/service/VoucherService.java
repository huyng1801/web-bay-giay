package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.student.polyshoes.dto.VoucherUsageDto;
import vn.student.polyshoes.enums.CustomerType;
import vn.student.polyshoes.model.*;
import vn.student.polyshoes.repository.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    public Optional<Voucher> getVoucherById(Long id) {
        return voucherRepository.findById(id);
    }

    public Voucher findByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại: " + code));
        if (!voucher.isValid()) {
            throw new RuntimeException("Voucher không còn hiệu lực: " + code);
        }
        return voucher;
    }

    public Voucher createVoucher(Voucher voucher) {
        voucher.setUsedCount(0);
        // Validate voucher rules before saving
        if (voucher.getDiscountType() == Voucher.DiscountType.FIXED && 
            voucher.getMaxDiscount() != null && voucher.getMinOrderValue() != null && 
            voucher.getMaxDiscount() > voucher.getMinOrderValue()) {
            throw new IllegalArgumentException("Giá trị giảm tối đa không được lớn hơn giá trị đơn hàng tối thiểu");
        }
        return voucherRepository.save(voucher);
    }

    public Voucher updateVoucher(Long id, Voucher voucherDetails) {
        return voucherRepository.findById(id)
                .map(voucher -> {
                    voucher.setCode(voucherDetails.getCode());
                    voucher.setName(voucherDetails.getName());
                    voucher.setDescription(voucherDetails.getDescription());
                    voucher.setDiscountType(voucherDetails.getDiscountType());
                    voucher.setDiscountValue(voucherDetails.getDiscountValue());
                    voucher.setMaxDiscount(voucherDetails.getMaxDiscount());
                    voucher.setMinOrderValue(voucherDetails.getMinOrderValue());
                    voucher.setConditionType(voucherDetails.getConditionType());
                    voucher.setConditionValue(voucherDetails.getConditionValue());
                    voucher.setStartDate(voucherDetails.getStartDate());
                    voucher.setEndDate(voucherDetails.getEndDate());
                    voucher.setUsageLimit(voucherDetails.getUsageLimit());
                    // Validate voucher rules before saving
                    if (voucher.getDiscountType() == Voucher.DiscountType.FIXED && 
                        voucher.getMaxDiscount() != null && voucher.getMinOrderValue() != null && 
                        voucher.getMaxDiscount() > voucher.getMinOrderValue()) {
                        throw new IllegalArgumentException("Giá trị giảm tối đa không được lớn hơn giá trị đơn hàng tối thiểu");
                    }
                    return voucherRepository.save(voucher);
                })
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));
    }

    public void deleteVoucher(Long id) {
        voucherRepository.deleteById(id);
    }

    public List<Voucher> getAvailableVouchersForCustomer(Integer customerId, Double orderValue) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        if (!customer.getIsActive()) {
            throw new RuntimeException("Tài khoản của bạn đã bị ngừng hoạt động. Không thể sử dụng voucher.");
        }
        boolean hasOrders = orderRepository.existsByCustomer(customer);
        Double totalPurchasedTemp = orderRepository.getTotalPurchasedByCustomer(customerId);
        final Double totalPurchased = (totalPurchasedTemp == null) ? 0.0 : totalPurchasedTemp;
        List<Voucher> allVouchers = voucherRepository.findAllByOrderByVoucherIdDesc();
        return allVouchers.stream()
                .filter(voucher -> isVoucherApplicable(voucher, customerId, hasOrders, totalPurchased, orderValue))
                .collect(Collectors.toList());
    }

    private boolean isVoucherApplicable(Voucher voucher, Integer customerId, boolean hasOrders, 
                                       Double totalPurchased, Double orderValue) {
        LocalDate now = LocalDate.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            return false;
        }
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            return false;
        }
        if (voucher.getMinOrderValue() != null && orderValue < voucher.getMinOrderValue()) {
            return false;
        }
        return checkVoucherCondition(voucher, hasOrders, totalPurchased, orderValue);
    }

    // Kiểm tra tính hợp lệ của voucher
    public VoucherValidationResult validateVoucher(String code, Integer customerId, Double orderValue) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(code);
        
        if (voucherOpt.isEmpty()) {
            return new VoucherValidationResult(false, "Mã voucher không tồn tại", null);
        }

        Voucher voucher = voucherOpt.get();
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Check if customer account is active
        if (!customer.getIsActive()) {
            return new VoucherValidationResult(false, "Tài khoản của bạn đã bị ngừng hoạt động. Không thể sử dụng voucher.", null);
        }

        // Kiểm tra các điều kiện
        if (!voucher.isValid()) {
            return new VoucherValidationResult(false, "Voucher đã hết hạn hoặc chưa đến thời gian sử dụng", null);
        }

        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            return new VoucherValidationResult(false, "Voucher đã hết lượt sử dụng", null);
        }

        if (voucher.getMinOrderValue() != null && orderValue < voucher.getMinOrderValue()) {
            return new VoucherValidationResult(false, 
                "Đơn hàng phải có giá trị tối thiểu " + voucher.getMinOrderValue() + " VND", null);
        }

        // Kiểm tra xem customer đã sử dụng voucher này chưa
        // Chỉ kiểm tra nếu đây là voucher giới hạn một lần mỗi khách hàng
        long customerUsageCount = voucherRepository.countVoucherUsageByCustomer(voucher.getVoucherId(), Long.valueOf(customerId));
        if (customerUsageCount > 0) {
            return new VoucherValidationResult(false, "Bạn đã sử dụng voucher này rồi", null);
        }

        // Kiểm tra điều kiện cụ thể
        boolean hasOrders = orderRepository.existsByCustomer(customer);
        Double totalPurchased = orderRepository.getTotalPurchasedByCustomer(customerId);
        if (totalPurchased == null) totalPurchased = 0.0;

        boolean conditionMet = checkVoucherCondition(voucher, hasOrders, totalPurchased, orderValue);
        if (!conditionMet) {
            String message = getConditionNotMetMessage(voucher);
            return new VoucherValidationResult(false, message, null);
        }

        // Tính toán giảm giá
        Double discountAmount = calculateDiscount(voucher, orderValue);
        
        return new VoucherValidationResult(true, "Voucher hợp lệ", discountAmount);
    }

    // Áp dụng voucher cho đơn hàng - phiên bản mới không sử dụng VoucherUsage
    @Transactional
    public void applyVoucherToOrder(String code, Integer customerId, String orderId) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(code);
        
        if (voucherOpt.isEmpty()) {
            throw new RuntimeException("Mã voucher không tồn tại");
        }

        Voucher voucher = voucherOpt.get();
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Validate voucher trước khi áp dụng
        VoucherValidationResult validation = validateVoucher(code, customerId, (double) order.getTotalPrice());
        if (!validation.isValid()) {
            throw new RuntimeException(validation.getMessage());
        }

        // Cập nhật thông tin voucher trong order
        order.setVoucher(voucher);
        
        // Cập nhật số lần sử dụng voucher
        voucher.incrementUsedCount();
        voucherRepository.save(voucher);
        orderRepository.save(order);
    }

    // Áp dụng voucher cho đơn hàng - phương thức dự phòng
    @Transactional
    public void applyVoucherDeprecated(String code, Integer customerId, String orderId) {
        throw new UnsupportedOperationException("Method deprecated. Use applyVoucherToOrder instead.");
    }

    // Tính toán giảm giá
    private Double calculateDiscount(Voucher voucher, Double orderValue) {
        double discount = 0.0;
        
        if (voucher.getDiscountType() == Voucher.DiscountType.PERCENTAGE) {
            discount = orderValue * (voucher.getDiscountValue() / 100.0);
            // Áp dụng giới hạn giảm giá tối đa nếu có
            if (voucher.getMaxDiscount() != null && discount > voucher.getMaxDiscount()) {
                discount = voucher.getMaxDiscount();
            }
        } else {
            discount = voucher.getDiscountValue();
            // Giảm giá cố định không được vượt quá giá trị đơn hàng
            if (discount > orderValue) {
                discount = orderValue;
            }
        }
        
        return discount;
    }

    // Kiểm tra điều kiện voucher
    private boolean checkVoucherCondition(Voucher voucher, boolean hasOrders, Double totalPurchased, Double orderValue) {
        switch (voucher.getConditionType()) {
            case ALL_CUSTOMERS:
                return true;
                
            case FIRST_ORDER:
                return !hasOrders;
                
            case TOTAL_PURCHASED:
                return totalPurchased >= voucher.getConditionValue();
                
            case ORDER_VALUE:
                return orderValue >= voucher.getConditionValue();
                
            case SPECIFIC_DATE:
                // Kiểm tra xem có phải ngày cụ thể không (có thể mở rộng để so sánh với conditionValue)
                return true; // Tạm thời return true, có thể customize sau
                
            default:
                return false;
        }
    }

    // Lấy thông báo khi không đáp ứng điều kiện
    private String getConditionNotMetMessage(Voucher voucher) {
        switch (voucher.getConditionType()) {
            case FIRST_ORDER:
                return "Voucher này chỉ dành cho khách hàng mua lần đầu";
                
            case TOTAL_PURCHASED:
                return "Bạn cần mua tổng cộng tối thiểu " + voucher.getConditionValue() + " VND để sử dụng voucher này";
                
            case ORDER_VALUE:
                return "Đơn hàng phải có giá trị tối thiểu " + voucher.getConditionValue() + " VND";
                
            case SPECIFIC_DATE:
                return "Voucher này chỉ có thể sử dụng vào ngày cụ thể";
                
            default:
                return "Không đáp ứng điều kiện sử dụng voucher";
        }
    }

    // Lấy lịch sử sử dụng voucher của customer từ Order entity
    public List<Order> getCustomerVoucherHistory(Long customerId) {
        return orderRepository.findByCustomerIdAndVoucherIsNotNullOrderByCreatedAtDesc(customerId);
    }

    // Lấy thống kê sử dụng voucher từ Order entity
    public List<Order> getVoucherUsageHistory(Long voucherId) {
        return orderRepository.findByVoucherIdOrderByCreatedAtDesc(voucherId);
    }

    // Lấy thống kê sử dụng voucher với DTO để tránh lỗi serialization - phiên bản mới từ Order
    public List<VoucherUsageDto> getVoucherUsageHistoryDTO(Long voucherId) {
        List<Order> orders = orderRepository.findByVoucherIdOrderByCreatedAtDesc(voucherId);
        return orders.stream().map(this::convertOrderToVoucherUsageDTO).collect(Collectors.toList());
    }

    // Chuyển đổi Order entity sang VoucherUsageDTO
    private VoucherUsageDto convertOrderToVoucherUsageDTO(Order order) {
        VoucherUsageDto dto = new VoucherUsageDto();
        dto.setUsageId(Long.valueOf(order.getOrderId().hashCode())); // Sử dụng hashCode của orderId làm usageId
        dto.setDiscountAmount(order.getVoucherDiscount() != null ? order.getVoucherDiscount().doubleValue() : 0.0);
        // Sử dụng createdAt làm thời gian sử dụng voucher
        dto.setUsedAt(order.getCreatedAt().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
        
        // Voucher info
        if (order.getVoucher() != null) {
            dto.setVoucherId(order.getVoucher().getVoucherId());
            dto.setVoucherCode(order.getVoucher().getCode());
        }
        
        // Customer info
        if (order.getCustomer() != null) {
            dto.setCustomerId(order.getCustomer().getCustomerId());
            dto.setCustomerName(order.getCustomer().getFullName());
            dto.setCustomerPhone(order.getCustomer().getPhone());
            dto.setCustomerEmail(order.getCustomer().getEmail());
        }
        
        // Guest info
        if (order.getCustomer() != null && order.getCustomer().getCustomerType() == CustomerType.GUEST) {
            dto.setGuestId(order.getCustomer().getCustomerId());
            dto.setGuestName(order.getCustomer().getFullName());
            dto.setGuestPhone(order.getCustomer().getPhone());
            dto.setGuestEmail(order.getCustomer().getEmail());
        }
        
        // Order info
        dto.setOrderId(order.getOrderId());
        dto.setOrderStatus(order.getOrderStatus() != null ? 
            order.getOrderStatus().toString() : null);
        dto.setOriginalPrice(order.getOriginalPrice());
        dto.setTotalPrice(Long.valueOf(order.getTotalPrice()));
        dto.setVoucherDiscount(order.getVoucherDiscount());
        dto.setCreatedAt(order.getCreatedAt());
        
        return dto;
    }



    // Kiểm tra lịch sử sử dụng voucher theo nhiều identifier - sử dụng Order
    public boolean checkVoucherUsageHistoryByIdentifier(String voucherCode, Integer customerId, String customerEmail, String customerPhone) {
        // Tìm voucher theo code
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(voucherCode);
        if (voucherOpt.isEmpty()) {
            throw new RuntimeException("Voucher không tồn tại: " + voucherCode);
        }

        Long voucherId = voucherOpt.get().getVoucherId();
        
        // Nếu có customerId, kiểm tra trực tiếp từ Order
        if (customerId != null && customerId > 0) {
            return voucherRepository.hasCustomerUsedVoucher(voucherId, customerId.longValue());
        }
        
        // Nếu có email hoặc phone, tìm customer trước
        if (customerEmail != null || customerPhone != null) {
            Customer customer = null;
            
            if (customerEmail != null) {
                customer = customerRepository.findByEmail(customerEmail).orElse(null);
            }
            
            if (customer == null && customerPhone != null) {
                customer = customerRepository.findByPhone(customerPhone).orElse(null);
            }
            
            if (customer != null) {
                return voucherRepository.hasCustomerUsedVoucher(voucherId, customer.getCustomerId().longValue());
            }
        }
        
        // Nếu không tìm thấy customer hoặc là guest, return false
        return false;
    }

    // Lấy lịch sử sử dụng voucher của customer - phiên bản cũ cho frontend
    public List<Order> getCustomerVoucherHistoryOld(Long customerId) {
        return orderRepository.findByCustomerIdAndVoucherIsNotNullOrderByCreatedAtDesc(customerId);
    }

    // Lấy lịch sử sử dụng voucher theo voucher id - phiên bản cũ cho frontend  
    public List<Order> getVoucherUsageHistoryOld(Long voucherId) {
        return orderRepository.findByVoucherIdOrderByCreatedAtDesc(voucherId);
    }

    // Lấy thống kê sử dụng voucher với DTO - phiên bản cũ cho frontend
    public List<VoucherUsageDto> getVoucherUsageHistoryDTOOld(Long voucherId) {
        List<Order> usageHistory = orderRepository.findByVoucherIdOrderByCreatedAtDesc(voucherId);
        return usageHistory.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Chuyển đổi Order sang VoucherUsageDto - phiên bản cũ cho frontend
    private VoucherUsageDto convertToDTO(Order order) {
        VoucherUsageDto dto = new VoucherUsageDto();
        dto.setUsageId(Long.valueOf(order.getOrderId().hashCode()));
        dto.setDiscountAmount(order.getVoucherDiscount() != null ? order.getVoucherDiscount().doubleValue() : 0.0);
        // Sử dụng createdAt làm thời gian sử dụng voucher
        dto.setUsedAt(order.getCreatedAt().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
        
        // Voucher info
        if (order.getVoucher() != null) {
            dto.setVoucherId(order.getVoucher().getVoucherId());
            dto.setVoucherCode(order.getVoucher().getCode());
        }
        
        // Customer info
        if (order.getCustomer() != null) {
            dto.setCustomerId(order.getCustomer().getCustomerId());
            dto.setCustomerName(order.getCustomer().getFullName());
            dto.setCustomerPhone(order.getCustomer().getPhone());
            dto.setCustomerEmail(order.getCustomer().getEmail());
        }
        
        // Guest info
        if (order.getCustomer() != null && order.getCustomer().getCustomerType() == CustomerType.GUEST) {
            dto.setGuestId(order.getCustomer().getCustomerId());
            dto.setGuestName(order.getCustomer().getFullName());
            dto.setGuestPhone(order.getCustomer().getPhone());
            dto.setGuestEmail(order.getCustomer().getEmail());
        }
        
        // Order info
        dto.setOrderId(order.getOrderId());
        dto.setOrderStatus(order.getOrderStatus() != null ? 
            order.getOrderStatus().toString() : null);
        dto.setOriginalPrice(order.getOriginalPrice());
        dto.setTotalPrice(Long.valueOf(order.getTotalPrice()));
        dto.setVoucherDiscount(order.getVoucherDiscount());
        dto.setCreatedAt(order.getCreatedAt());
        
        return dto;
    }

    // Kiểm tra lịch sử sử dụng voucher theo identifier - phiên bản cũ cho frontend
    public boolean checkVoucherUsageHistoryByIdentifierOld(String voucherCode, Integer customerId, String customerEmail, String customerPhone) {
        // Tìm voucher theo code
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(voucherCode);
        if (voucherOpt.isEmpty()) {
            throw new RuntimeException("Voucher không tồn tại: " + voucherCode);
        }

        Long voucherId = voucherOpt.get().getVoucherId();
        
        // Nếu có customerId, kiểm tra trực tiếp từ Order
        if (customerId != null && customerId > 0) {
            List<Order> orders = orderRepository.findByCustomerIdAndVoucherId(customerId.longValue(), voucherId);
            return !orders.isEmpty();
        }
        
        // Nếu có email hoặc phone, tìm customer trước
        if (customerEmail != null || customerPhone != null) {
            Customer customer = null;
            
            if (customerEmail != null) {
                customer = customerRepository.findByEmail(customerEmail).orElse(null);
            }
            
            if (customer == null && customerPhone != null) {
                customer = customerRepository.findByPhone(customerPhone).orElse(null);
            }
            
            if (customer != null && customer.getCustomerId() != null) {
                List<Order> orders = orderRepository.findByCustomerIdAndVoucherId(customer.getCustomerId().longValue(), voucherId);
                return !orders.isEmpty();
            }
        }
        
        // Nếu không tìm thấy customer hoặc là guest, return false
        return false;
    }



    // Inner class cho kết quả validation
    public static class VoucherValidationResult {
        private boolean valid;
        private String message;
        private Double discountAmount;

        public VoucherValidationResult(boolean valid, String message, Double discountAmount) {
            this.valid = valid;
            this.message = message;
            this.discountAmount = discountAmount;
        }

        // Getters
        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public Double getDiscountAmount() { return discountAmount; }
    }
}
