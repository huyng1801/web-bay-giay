package vn.student.polyshoes.enums;

public enum OrderStatus {
    PENDING_PAYMENT,      // Đặt hàng
    PAYMENT_CONFIRMED,    // Chờ xác nhận
    PROCESSING,           // Đã xác nhận
    SHIPPED,              // Chờ vận chuyển
    OUT_FOR_DELIVERY,     // Đang vận chuyển
    DELIVERED,            // Đã giao hàng
    COMPLETED,            // Hoàn thành
    CANCELED,             // Đã hủy
    RETURN_REQUESTED,     // Yêu cầu trả hàng
    RETURNED,             // Đã trả hàng
    REFUNDED,             // Đã hoàn tiền
    FAILED                // Giao hàng/thanh toán thất bại
}
