package vn.student.polyshoes.enums;

// Enum định nghĩa các trạng thái của đơn hàng
public enum OrderStatus {
    PENDING_PAYMENT,      // Chờ thanh toán (Đặt hàng nhưng chưa thanh toán)
    PAYMENT_CONFIRMED,    // Thanh toán đã xác nhận (Đã nhận được tiền, chờ xác nhận)
    PROCESSING,           // Đang xử lý (Đã xác nhận và chuẩn bị hàng)
    SHIPPED,              // Đã gửi đi (Hàng sẽ được vận chuyển)
    OUT_FOR_DELIVERY,     // Đang vận chuyển (Hàng đang trên đường tới khách hàng)
    DELIVERED,            // Đã giao hàng (Khách hàng đã nhận hàng)
    COMPLETED,            // Hoàn thành (Giao dịch kết thúc thành công)
    CANCELED,             // Đã hủy (Đơn hàng bị hủy bởi khách hoặc hệ thống)
    RETURN_REQUESTED,     // Yêu cầu trả hàng (Khách hàng yêu cầu trả sản phẩm)
    RETURNED,             // Đã trả hàng (Sản phẩm được trả lại)
    REFUNDED,             // Đã hoàn tiền (Tiền hoàn lại cho khách hàng)
    FAILED                // Thất bại (Giao hàng hoặc thanh toán thất bại)
}
