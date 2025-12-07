package vn.student.polyshoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.OrderStatus;

import java.util.Date;

@Entity
@Table(name = "order_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Integer historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status")
    private OrderStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false)
    private OrderStatus toStatus;

    @Column(name = "changed_by", nullable = false, length = 100, columnDefinition = "NVARCHAR(100)")
    private String changedBy; // Email của admin hoặc "SYSTEM"

    @Column(name = "change_reason", length = 500, columnDefinition = "NVARCHAR(500)")
    private String changeReason;

    @Column(name = "changed_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date changedAt;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    // Constructor for convenience
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
