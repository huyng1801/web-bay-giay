package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.Voucher;
import vn.student.polyshoes.repository.CustomerRepository;
import vn.student.polyshoes.repository.OrderRepository;
import vn.student.polyshoes.repository.VoucherRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HomeService {
    
    @Autowired
    private VoucherRepository voucherRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    


    // Lấy danh sách voucher khả dụng cho customer
    public List<Voucher> getAvailableVouchersForCustomer(Integer customerId, Double orderValue) {
        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
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
                .filter(voucher -> isVoucherAvailable(voucher, customerId, hasOrders, totalPurchased, orderValue))
                .collect(Collectors.toList());
    }

    // Kiểm tra voucher có khả dụng không (bao gồm check khách hàng đã sử dụng chưa)
    private boolean isVoucherAvailable(Voucher voucher, Integer customerId, boolean hasOrders, 
                                     Double totalPurchased, Double orderValue) {
        // Kiểm tra thời gian hiệu lực
        LocalDate now = LocalDate.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            return false;
        }

        // Kiểm tra usage limit tổng thể của voucher
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            return false;
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (voucher.getMinOrderValue() != null && orderValue < voucher.getMinOrderValue()) {
            return false;
        }

        // Kiểm tra xem khách hàng đã sử dụng voucher này chưa
        long customerUsageCount = voucherRepository.countVoucherUsageByCustomer(voucher.getVoucherId(), Long.valueOf(customerId));
        if (customerUsageCount > 0) {
            return false; // Khách hàng đã sử dụng voucher này rồi
        }

        // Kiểm tra điều kiện voucher
        return checkVoucherCondition(voucher, hasOrders, totalPurchased, orderValue);
    }

    // Validate voucher với logic cải thiện
    public VoucherValidationResult validateVoucher(String code, Integer customerId, Double orderValue) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(code);
        
        if (voucherOpt.isEmpty()) {
            return new VoucherValidationResult(false, "Mã voucher không tồn tại", null, null);
        }

        Voucher voucher = voucherOpt.get();
        if (customerId == null) {
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Check if customer account is active
        if (!customer.getIsActive()) {
            return new VoucherValidationResult(false, "Tài khoản của bạn đã bị ngừng hoạt động. Không thể sử dụng voucher.", null, null);
        }

        // Kiểm tra các điều kiện cơ bản
        if (!voucher.isValid()) {
            return new VoucherValidationResult(false, "Voucher đã hết hạn hoặc chưa đến thời gian sử dụng", null, null);
        }

        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            return new VoucherValidationResult(false, "Voucher đã hết lượt sử dụng", null, null);
        }

        if (voucher.getMinOrderValue() != null && orderValue < voucher.getMinOrderValue()) {
            return new VoucherValidationResult(false, 
                "Đơn hàng phải có giá trị tối thiểu " + String.format("%,.0f", voucher.getMinOrderValue()) + " VNĐ", null, null);
        }

        // Kiểm tra xem khách hàng đã sử dụng voucher này chưa
        long customerUsageCount = voucherRepository.countVoucherUsageByCustomer(voucher.getVoucherId(), Long.valueOf(customerId));
        if (customerUsageCount > 0) {
            return new VoucherValidationResult(false, "Bạn đã sử dụng voucher này rồi", null, null);
        }
        
        // Kiểm tra điều kiện cụ thể
        boolean hasOrders = orderRepository.existsByCustomer(customer);
        Double totalPurchased = orderRepository.getTotalPurchasedByCustomer(customerId);
        if (totalPurchased == null) totalPurchased = 0.0;

        boolean conditionMet = checkVoucherCondition(voucher, hasOrders, totalPurchased, orderValue);
        if (!conditionMet) {
            String message = getConditionNotMetMessage(voucher);
            return new VoucherValidationResult(false, message, null, null);
        }

        // Tính toán giảm giá
        Double discountAmount = calculateDiscount(voucher, orderValue);
        
        return new VoucherValidationResult(true, "Voucher hợp lệ", discountAmount, voucher);
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
        } else if (voucher.getDiscountType() == Voucher.DiscountType.FIXED) {
            discount = voucher.getDiscountValue();
            // Giảm giá cố định không được vượt quá giá trị đơn hàng
            if (discount > orderValue) {
                discount = orderValue;
            }
        }
        
        return Math.max(0.0, discount);
    }

    // Kiểm tra điều kiện voucher
    private boolean checkVoucherCondition(Voucher voucher, boolean hasOrders, Double totalPurchased, Double orderValue) {
        switch (voucher.getConditionType()) {
            case ALL_CUSTOMERS:
                return true;
            case FIRST_ORDER:
                return !hasOrders;
            case TOTAL_PURCHASED:
                return voucher.getConditionValue() != null && totalPurchased >= voucher.getConditionValue();
            case ORDER_VALUE:
                return voucher.getConditionValue() != null && orderValue >= voucher.getConditionValue();
            case SPECIFIC_DATE:
                // Có thể implement logic kiểm tra ngày cụ thể ở đây
                return true;
            default:
                return false;
        }
    }

    // Lấy thông báo khi điều kiện không được đáp ứng
    private String getConditionNotMetMessage(Voucher voucher) {
        switch (voucher.getConditionType()) {
            case FIRST_ORDER:
                return "Voucher chỉ dành cho đơn hàng đầu tiên";
            case TOTAL_PURCHASED:
                return "Bạn chưa đạt điều kiện tổng giá trị mua hàng để sử dụng voucher này";
            case ORDER_VALUE:
                return "Giá trị đơn hàng chưa đạt điều kiện để sử dụng voucher này";
            case SPECIFIC_DATE:
                return "Voucher chỉ có thể sử dụng trong ngày cụ thể";
            default:
                return "Không đủ điều kiện sử dụng voucher";
        }
    }

    // Class kết quả validation
    public static class VoucherValidationResult {
        private boolean valid;
        private String message;
        private Double discountAmount;
        private Voucher voucher;

        public VoucherValidationResult(boolean valid, String message, Double discountAmount, Voucher voucher) {
            this.valid = valid;
            this.message = message;
            this.discountAmount = discountAmount;
            this.voucher = voucher;
        }

        // Getters and setters
        public boolean isValid() { return valid; }
        public void setValid(boolean valid) { this.valid = valid; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public Double getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }
        
        public Voucher getVoucher() { return voucher; }
        public void setVoucher(Voucher voucher) { this.voucher = voucher; }
    }
}