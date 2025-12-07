package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.model.Voucher;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherDto {
    private Long voucherId;

    @NotBlank(message = "Voucher code must not be blank")
    private String code;

    @NotBlank(message = "Voucher name must not be blank")
    private String name;

    private String description;

    @NotNull(message = "Discount type must not be null")
    private Voucher.DiscountType discountType;

    @NotNull(message = "Discount value must not be null")
    @Positive(message = "Discount value must be greater than 0")
    private Double discountValue;

    @PositiveOrZero(message = "Max discount must be zero or positive")
    private Double maxDiscount;

    @PositiveOrZero(message = "Minimum order value must be zero or positive")
    private Double minOrderValue;

    @NotNull(message = "Condition type must not be null")
    private Voucher.ConditionType conditionType;

    @PositiveOrZero(message = "Condition value must be zero or positive")
    private Double conditionValue;

    @NotNull(message = "Start date must not be null")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @NotNull(message = "End date must not be null")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    @PositiveOrZero(message = "Usage limit must be zero or positive")
    private Integer usageLimit;

    @PositiveOrZero(message = "Used count must be zero or positive")
    private Integer usedCount;

    // Constructor from entity
    public VoucherDto(Voucher voucher) {
        this.voucherId = voucher.getVoucherId();
        this.code = voucher.getCode();
        this.name = voucher.getName();
        this.description = voucher.getDescription();
        this.discountType = voucher.getDiscountType();
        this.discountValue = voucher.getDiscountValue();
        this.maxDiscount = voucher.getMaxDiscount();
        this.minOrderValue = voucher.getMinOrderValue();
        this.conditionType = voucher.getConditionType();
        this.conditionValue = voucher.getConditionValue();
        this.startDate = voucher.getStartDate();
        this.endDate = voucher.getEndDate();
        this.usageLimit = voucher.getUsageLimit();
        this.usedCount = voucher.getUsedCount();
    }

    // Convert to entity
    public Voucher toEntity() {
        Voucher voucher = new Voucher();
        voucher.setVoucherId(this.voucherId);
        voucher.setCode(this.code);
        voucher.setName(this.name);
        voucher.setDescription(this.description);
        voucher.setDiscountType(this.discountType);
        voucher.setDiscountValue(this.discountValue);
        voucher.setMaxDiscount(this.maxDiscount);
        voucher.setMinOrderValue(this.minOrderValue);
        voucher.setConditionType(this.conditionType);
        voucher.setConditionValue(this.conditionValue);
        voucher.setStartDate(this.startDate);
        voucher.setEndDate(this.endDate);
        voucher.setUsageLimit(this.usageLimit);
        voucher.setUsedCount(this.usedCount);
        return voucher;
    }
    
    // Custom validation method - to be called before save
    public void validateVoucherRules() {
        if (discountType == Voucher.DiscountType.FIXED && 
            maxDiscount != null && minOrderValue != null && 
            maxDiscount > minOrderValue) {
            throw new IllegalArgumentException("Giá trị giảm tối đa không được lớn hơn giá trị đơn hàng tối thiểu");
        }
    }
}
