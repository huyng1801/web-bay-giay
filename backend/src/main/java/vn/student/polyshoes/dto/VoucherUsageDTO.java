package vn.student.polyshoes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * DTO lưu trữ lịch sử sử dụng voucher - được lấy từ đối tượng Order
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherUsageDto {
    // ID sử dụng voucher
    private Long usageId;
    // ID của voucher
    private Long voucherId;
    // Mã voucher
    private String voucherCode;
    // ID khách hàng (nếu là khách hàng đăng nhập)
    private Integer customerId;
    // Tên khách hàng
    private String customerName;
    // Số điện thoại khách hàng
    private String customerPhone;
    // Email khách hàng
    private String customerEmail;
    // ID khách khàng đăng nhập
    private Integer guestId;
    // Tên khách khàng đăng nhập
    private String guestName;
    // Số điện thoại khách khàng đăng nhập
    private String guestPhone;
    // Email khách khàng đăng nhập
    private String guestEmail;
    // ID đơn hàng
    private String orderId;
    // Trạng thái đơn hàng
    private String orderStatus;
    // Giá gốc của đơn hàng
    private Long originalPrice;
    // Tổng giá thanh toán
    private Long totalPrice;
    // Số tiền chiếm giỊm từ voucher
    private Long voucherDiscount;
    // Mức chiếm giỊm (đảm phăn đểu hoặc phần trăm)
    private Double discountAmount;
    // Thời gian sử dụng voucher
    private LocalDateTime usedAt;
    // Thời gian tạo
    private Date createdAt;
}