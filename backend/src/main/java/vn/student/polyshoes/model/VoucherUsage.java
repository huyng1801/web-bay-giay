
package vn.student.polyshoes.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "voucher_usage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usage_id")
    private Long usageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = true)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id", nullable = true)
    private Guest guest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "discount_amount", nullable = false)
    private Double discountAmount;

    @Column(name = "used_at", nullable = false)
    private LocalDateTime usedAt;

    public VoucherUsage(Voucher voucher, Customer customer, Order order, Double discountAmount) {
        this.voucher = voucher;
        this.customer = customer;
        this.order = order;
        this.discountAmount = discountAmount;
        this.usedAt = LocalDateTime.now();
    }

    public VoucherUsage(Voucher voucher, Guest guest, Order order, Double discountAmount) {
        this.voucher = voucher;
        this.guest = guest;
        this.order = order;
        this.discountAmount = discountAmount;
        this.usedAt = LocalDateTime.now();
    }
}
