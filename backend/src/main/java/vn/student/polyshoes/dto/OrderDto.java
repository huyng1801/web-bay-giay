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
        @NotNull(message = "Tổng tiền không được để trống")
        @PositiveOrZero(message = "Tổng tiền phải lớn hơn hoặc bằng 0")
    private Long totalPrice;

    // Giá gốc của đơn hàng (trước chiếm giỊm)
        @NotNull(message = "Giá gốc không được để trống")
        @PositiveOrZero(message = "Giá gốc phải lớn hơn hoặc bằng 0")
    private Long originalPrice;

    // Tiền chiếm giỊm từ voucher
        @PositiveOrZero(message = "Giảm giá voucher phải lớn hơn hoặc bằng 0")
    private Long voucherDiscount;    
    // Mã code của voucher (tùy chọn)
    private String voucherCode;
    // Trạng thái thanh toán (đã thanh toán hay chưa)
    private boolean isPaid;

    // Ghi chú thém của đơn hàng
    private String orderNote;

    // Phương thức thanh toán (thảng, chuyển khoản, ...)
        @NotNull(message = "Phương thức thanh toán không được để trống")
    private PaymentMethod paymentMethod;

    // ID của phương thức vận chuyển
        @NotNull(message = "ID vận chuyển không được để trống")
    private Integer shippingId;
    
    // ID của nhân viên được gán (tùy chọn)
    private String assignedStaffId;

    // Cơ chế bỏ qua giảm trừ tồn kho
    private boolean skipStockReduction = false;
}
