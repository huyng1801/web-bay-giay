package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.model.Voucher;
import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật voucher khuyến mãi
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherDto {
    // ID của voucher (nếu cập nhật)
    private Long voucherId;

    // Mã code của voucher (bắt buộc, không được để trống)
    @NotBlank(message = "Mã voucher không được để trống")
    private String code;

    // Tên voucher (bắt buộc)
    @NotBlank(message = "Tên voucher không được để trống")
    private String name;

    // Mô tả chi tiết voucher (tùy chọn)
    private String description;

    // Loại giảm giá (theo phần trăm hoặc số tiền cố định)
    @NotNull(message = "Loại giảm giá không được để trống")
    private Voucher.DiscountType discountType;

    // Giá trị giảm giá (bắt buộc, > 0)
    @NotNull(message = "Giá trị giảm giá không được để trống")
    @Positive(message = "Giá trị giảm giá phải lớn hơn 0")
    private Double discountValue;

    // Số tiền giảm tối đa (nếu có, >= 0)
    @PositiveOrZero(message = "Giảm giá tối đa phải lớn hơn hoặc bằng 0")
    private Double maxDiscount;

    // Giá trị đơn hàng tối thiểu để áp dụng voucher (>= 0)
    @PositiveOrZero(message = "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0")
    private Double minOrderValue;

    // Loại điều kiện áp dụng voucher (VD: theo giá trị đơn hàng, số lượng sản phẩm...)
    @NotNull(message = "Loại điều kiện không được để trống")
    private Voucher.ConditionType conditionType;

    // Giá trị điều kiện áp dụng (>= 0)
    @PositiveOrZero(message = "Giá trị điều kiện phải lớn hơn hoặc bằng 0")
    private Double conditionValue;

    // Ngày bắt đầu hiệu lực của voucher
    @NotNull(message = "Ngày bắt đầu không được để trống")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    // Ngày kết thúc hiệu lực của voucher
    @NotNull(message = "Ngày kết thúc không được để trống")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    // Số lượt sử dụng tối đa (>= 0, null = không giới hạn)
    @PositiveOrZero(message = "Số lượt sử dụng tối đa phải lớn hơn hoặc bằng 0")
    private Integer usageLimit;

    // Số lượt đã sử dụng (>= 0)
    @PositiveOrZero(message = "Số lượt đã sử dụng phải lớn hơn hoặc bằng 0")
    private Integer usedCount;

    // Hàm khởi tạo từ entity Voucher
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

    // Chuyển đổi về entity Voucher
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
    
    // Hàm kiểm tra logic nghiệp vụ voucher trước khi lưu
    public void validateVoucherRules() {
        if (discountType == Voucher.DiscountType.FIXED && 
            maxDiscount != null && minOrderValue != null && 
            maxDiscount > minOrderValue) {
            throw new IllegalArgumentException("Giá trị giảm tối đa không được lớn hơn giá trị đơn hàng tối thiểu");
        }
    }
}
