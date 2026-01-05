package vn.student.polyshoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.OrderStatus;

import java.util.Date;

/**
 * Entity class đại diện cho Lịch sử thay đổi trạng thái đơn hàng
 * Ghi lại tất cả các lần thay đổi trạng thái của một đơn hàng từ khi được tạo
 */
@Entity
@Table(name = "lich_su_trang_thai")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistory {

    // ID duy nhất của bản ghi lịch sử, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lich_su_trang_thai")
    private Integer historyId;

    // Tham chiếu tới đơn hàng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_don_hang", nullable = false)
    private Order order;

    // Trạng thái cũ của đơn hàng (trước khi thay đổi)
    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_cu")
    private OrderStatus fromStatus;

    // Trạng thái mới của đơn hàng (sau khi thay đổi)
    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai_moi", nullable = false)
    private OrderStatus toStatus;

    // Email của admin hoặc nhân viên thực hiện thay đổi, hoặc "SYSTEM" nếu tự động
    @Column(name = "nguoi_thay_doi", nullable = false, length = 100, columnDefinition = "NVARCHAR(100)")
    private String changedBy;

    // Lý do thay đổi trạng thái
    @Column(name = "ly_do_thay_doi", length = 500, columnDefinition = "NVARCHAR(500)")
    private String changeReason;

    // Thời gian thực hiện thay đổi
    @Column(name = "thoi_gian_thay_doi", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date changedAt;

    // Địa chỉ IP của người thực hiện thay đổi
    @Column(name = "dia_chi_ip", length = 50, columnDefinition = "NVARCHAR(50)")
    private String ipAddress;

    // Constructor để tiện sử dụng
    public OrderStatusHistory(Order order, OrderStatus fromStatus, OrderStatus toStatus, 
                            String changedBy, String changeReason) {
        this.order = order;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.changedBy = changedBy;
        this.changeReason = changeReason;
        this.changedAt = new Date();
    }
}
