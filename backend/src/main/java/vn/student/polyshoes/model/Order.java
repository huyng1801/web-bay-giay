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
@Table(name = "don_hang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    // ID duy nhất của đơn hàng (dạng chuỗi)
    @Id
    @Column(name = "ma_don_hang", length = 36, columnDefinition = "NVARCHAR(36)")
    private String orderId;

    // Ghi chú của khách hàng cho đơn hàng
    @Column(name = "ghi_chu_don_hang", length = 1024, columnDefinition = "NVARCHAR(1024)")
    private String orderNote;

    // Phương thức thanh toán (BANK_TRANSFER, CASH_ON_DELIVERY, VNPAY, etc.)
    @Enumerated(EnumType.STRING)
    @Column(name = "phuong_thuc_thanh_toan", nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    // Giá gốc trước khi áp dụng giảm giá
    @Column(name = "gia_goc")
    private Long originalPrice;

    // Tổng tiền phải trả sau khi áp dụng giảm giá
    @Column(name = "tong_tien", nullable = false)
    private long totalPrice;
    
    // Số tiền giảm giá từ voucher
    @Column(name = "so_tien_giam_gia")
    private Long voucherDiscount;

    // Trạng thái thanh toán (true = đã thanh toán, false = chưa thanh toán)
    @Column(name = "da_thanh_toan", nullable = false)
    private Boolean isPaid;

    // Thời gian thanh toán
    @Column(name = "thoi_gian_thanh_toan")
    @Temporal(TemporalType.TIMESTAMP)
    private Date paidAt;

    // Trạng thái của đơn hàng (PENDING_PAYMENT, PROCESSING, SHIPPED, DELIVERED, etc.)
    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_don_hang", nullable = false, length = 20)
    private OrderStatus orderStatus;

    // Thời gian tạo đơn hàng
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Service ID từ GHN API
    @Column(name = "ma_dich_vu_ghn")
    private Integer ghnServiceId;

    // Phí vận chuyển
    @Column(name = "phi_van_chuyen", nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long shippingFee = 0L;


    // Tham chiếu tới đối tượng Voucher
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_voucher")
    private Voucher voucher;

    // Tham chiếu tới khách hàng (bao gồm cả khách đăng ký và khách vãng lai)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_khach_hang", nullable = false) 
    private Customer customer;
    
    // Danh sách các sản phẩm trong đơn hàng
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    // Địa chỉ giao hàng sẽ được lấy từ thông tin khách hàng
    
    // Nhân viên được gán xử lý đơn hàng
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ma_nhan_vien_phu_trach", nullable = true)
    private AdminUser assignedStaff;
    
}
