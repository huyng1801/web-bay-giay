package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.dto.OrderDto;
import vn.student.polyshoes.enums.OrderStatus;
import vn.student.polyshoes.enums.PaymentMethod;

import java.util.Date;
import java.util.List;

/**
 * Response DTO cho thông tin đơn hàng hoàn chỉnh
 * Sử dụng để trả về toàn bộ dữ liệu đơn hàng bao gồm sản phẩm, khách hàng, thanh toán, ...
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String orderId; // ID duy nhất của đơn hàng
    private String orderNote; // Ghi chú thêm về đơn hàng từ khách hàng
    private PaymentMethod paymentMethod; // Phương thức thanh toán (CASH, BANKING, ...)
    private long totalPrice; // Tổng giá sau khi trừ giảm giá voucher
    private Long originalPrice; // Giá gốc trước khi giảm
    private Long voucherDiscount; // Số tiền giảm từ voucher
    private String voucherCode; // Mã voucher được sử dụng (KHÔNG SỬ DỤNG)
    private boolean isPaid; // Đã thanh toán hay chưa
    private OrderStatus orderStatus; // Trạng thái đơn hàng (PENDING, CONFIRMED, SHIPPED, DELIVERED, ...)
    private OrderDto orderDetails; // Chi tiết đơn hàng (dto bổ sung)
    private Date orderDate; // Thời gian tạo đơn hàng
    private Date paidAt; // Thời gian thanh toán
    private List<OrderItemResponse> orderItems; // Danh sách các sản phẩm trong đơn hàng
    private String guestName; // Tên khách hàng guest (nếu là guest checkout)
    private String guestEmail; // Email khách hàng guest
    private String guestPhone; // Số điện thoại khách hàng guest
    private String customerName; // Tên khách hàng đã đăng ký (nếu là customer)
    private String customerEmail; // Email khách hàng đã đăng ký
    private String customerPhone; // Số điện thoại khách hàng đã đăng ký
    private Integer shippingId; // ID phương thức vận chuyển
    private String shippingName; // Tên phương thức vận chuyển
    private Integer shippingFee; // Phí vận chuyển
    private String deliveryTime; // Thời gian giao hàng dự kiến
    private String assignedStaffId; // ID nhân viên được phân công xử lý
    private String assignedStaffName; // Tên nhân viên được phân công
    private String assignedStaffEmail; // Email nhân viên được phân công
    // Các trường địa chỉ giao hàng
    private String shippingAddress; // Địa chỉ giao hàng chính
    private String shippingAddress2; // Địa chỉ giao hàng thứ hai
    private String shippingCity; // Thành phố/Tỉnh giao hàng
}
