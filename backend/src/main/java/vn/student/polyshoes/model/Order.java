package vn.student.polyshoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.OrderStatus;
import vn.student.polyshoes.enums.PaymentMethod;

import java.util.Date;
import java.util.List;

/**
 * Entity class đại diện cho Đơn hàng
 * Chứa thông tin chi tiết của một đơn hàng bao gồm thông tin khách hàng, sản phẩm, và trạng thái thanh toán
 */
@Entity
@Table(name = "`order`")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    // ID duy nhất của đơn hàng (dạng chuỗi)
    @Id
    @Column(name = "order_id", length = 20, columnDefinition = "NVARCHAR(20)")
    private String orderId;

    // Ghi chú của khách hàng cho đơn hàng
    @Column(name = "order_note", length = 1024, columnDefinition = "NVARCHAR(1024)")
    private String orderNote;

    // Phương thức thanh toán (BANK_TRANSFER, CASH_ON_DELIVERY, VNPAY, etc.)
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    // Tổng tiền phải trả sau khi áp dụng giảm giá
    @Column(name = "total_price", nullable = false)
    private long totalPrice;
    
    // Giá gốc trước khi áp dụng giảm giá
    @Column(name = "original_price")
    private Long originalPrice;
    
    // Số tiền giảm giá từ voucher
    @Column(name = "voucher_discount")
    private Long voucherDiscount;
    
    // Tham chiếu tới đối tượng Voucher
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    // Trạng thái thanh toán (true = đã thanh toán, false = chưa thanh toán)
    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid;

    // Thời gian thanh toán
    @Column(name = "paid_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date paidAt;

    // Trạng thái của đơn hàng (PENDING_PAYMENT, PROCESSING, SHIPPED, DELIVERED, etc.)
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 20)
    private OrderStatus orderStatus;

    // Thời gian tạo đơn hàng
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Tham chiếu tới khách hàng đã đăng ký (null nếu là khách vãng lai)
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "customer_id", nullable = true) 
    private Customer customer;
    
    // Tham chiếu tới khách vãng lai (null nếu là khách hàng đã đăng ký)
    @ManyToOne(fetch = FetchType.LAZY, optional = true) 
    @JoinColumn(name = "guest_id", nullable = true)
    private Guest guest;
    
    // Danh sách các sản phẩm trong đơn hàng
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;
    
    // Phương thức vận chuyển được chọn
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "shipping_id", nullable = true)
    private vn.student.polyshoes.model.Shipping shipping;
    
    // Nhân viên được gán xử lý đơn hàng
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "assigned_staff_id", nullable = true)
    private AdminUser assignedStaff;
    
}
