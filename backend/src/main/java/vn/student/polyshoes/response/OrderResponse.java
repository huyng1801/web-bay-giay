package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.dto.OrderDto;
import vn.student.polyshoes.enums.OrderStatus;
import vn.student.polyshoes.enums.PaymentMethod;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private String orderId;
    private String orderNote;
    private PaymentMethod paymentMethod;
    private long totalPrice;
    private Long originalPrice;
    private Long voucherDiscount;
    @Deprecated // Will be populated from VoucherUsage relationship
    private String voucherCode;
    private boolean isPaid;
    private OrderStatus orderStatus;
    private OrderDto orderDetails;
    private Date orderDate;
    private Date paidAt;
    private List<OrderItemResponse> orderItems;
    private String guestName;
    private String guestEmail;
    private String guestPhone;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Integer shippingId;
    private String shippingName;
    private Integer shippingFee;
    private String deliveryTime;
    private String assignedStaffId;
    private String assignedStaffName;
    private String assignedStaffEmail;
    // Shipping address fields
    private String shippingAddress;
    private String shippingAddress2;
    private String shippingCity;
}
