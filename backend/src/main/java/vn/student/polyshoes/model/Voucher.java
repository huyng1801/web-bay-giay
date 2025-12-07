package vn.student.polyshoes.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_id")
    private Long voucherId;

    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 100, columnDefinition = "NVARCHAR(128)")
    private String name;

    @Column(name = "description", length = 500, columnDefinition = "NVARCHAR(500)")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false)
    private Double discountValue;

    @Column(name = "max_discount")
    private Double maxDiscount;

    @Column(name = "min_order_value")
    private Double minOrderValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_type", nullable = false)
    private ConditionType conditionType;

    @Column(name = "condition_value")
    private Double conditionValue;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "usage_limit", nullable = false)
    private Integer usageLimit;

    @Column(name = "used_count", nullable = false)
    private Integer usedCount = 0;

    // Enums
    public enum DiscountType {
        PERCENTAGE, FIXED
    }

    public enum ConditionType {
        ALL_CUSTOMERS, FIRST_ORDER, TOTAL_PURCHASED, ORDER_VALUE, SPECIFIC_DATE
    }


    // Helper methods
    public boolean isExpired() {
        return LocalDate.now().isAfter(endDate);
    }

    public boolean isUsageLimitReached() {
        return usedCount >= usageLimit;
    }

    public boolean isStarted() {
        return LocalDate.now().isAfter(startDate) || LocalDate.now().isEqual(startDate);
    }

    public boolean isValid() {
        return isStarted() && !isExpired() && !isUsageLimitReached();
    }
    
    public String getVoucherStatus() {
        if (!isStarted()) {
            return "UPCOMING";
        } else if (isExpired()) {
            return "EXPIRED";
        } else if (isUsageLimitReached()) {
            return "USED_UP";
        } else {
            return "ACTIVE";
        }
    }

    public void incrementUsedCount() {
        this.usedCount++;
    }
}
