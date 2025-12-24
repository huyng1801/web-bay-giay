package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.PaymentMethod;
import jakarta.validation.constraints.*;


// DTO dùng để nhận dữ liệu tạo mới đơn hàng
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    // Tổng tiền thanh toán (đõ là giá gốc - chiếm giỊm voucher)
    @NotNull(message = "Total price must not be null")
    @PositiveOrZero(message = "Total price must be zero or positive")
    private Long totalPrice;

    // Giá gốc của đơn hàng (trước chiếm giỊm)
    @NotNull(message = "Original price must not be null")
    @PositiveOrZero(message = "Original price must be zero or positive")
    private Long originalPrice;

    // Tiền chiếm giỊm từ voucher
    @PositiveOrZero(message = "Voucher discount must be zero or positive")
    private Long voucherDiscount;    
    // Mã code của voucher (tùy chọn)
    private String voucherCode;
    // Trạng thái thanh toán (đã thanh toán hay chưa)
    private boolean isPaid;

    // Ghi chú thém của đơn hàng
    private String orderNote;

    // Phương thức thanh toán (thảng, chuyển khoản, ...)
    @NotNull(message = "Payment method must not be null")
    private PaymentMethod paymentMethod;

    // ID của phương thức vận chuyển
    @NotNull(message = "Shipping ID must not be null")
    private Integer shippingId;
    
    // ID của nhân viên được gán (tùy chọn)
    private String assignedStaffId;

    // Cơ chế bỏ qua giảm trừ tồn kho
    private boolean skipStockReduction = false;
}
