package vn.student.polyshoes.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "phieu_giam_gia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
    
    // ID duy nhất của voucher, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_voucher")
    private Long voucherId;

    // Mã code duy nhất của voucher
    @Column(name = "ma_code", unique = true, nullable = false, length = 50)
    private String code;

    // Tên/Tiêu đề của voucher
    @Column(name = "ten_voucher", nullable = false, length = 100, columnDefinition = "NVARCHAR(128)")
    private String name;

    // Mô tả chi tiết về voucher
    @Column(name = "mo_ta", length = 500, columnDefinition = "NVARCHAR(500)")
    private String description;

    // Loại giảm giá (PERCENTAGE = %, FIXED = số tiền cố định)
    @Enumerated(EnumType.STRING)
    @Column(name = "loai_giam_gia", nullable = false)
    private DiscountType discountType;

    // Giá trị giảm giá (% hoặc số tiền)
    @Column(name = "gia_tri_giam_gia", nullable = false)
    private Double discountValue;

    // Giới hạn giảm giá tối đa (nếu có)
    @Column(name = "giam_gia_toi_da")
    private Double maxDiscount;

    // Giá trị đơn hàng tối thiểu để áp dụng voucher
    @Column(name = "gia_tri_don_hang_toi_thieu")
    private Double minOrderValue;

    // Loại điều kiện áp dụng voucher
    @Enumerated(EnumType.STRING)
    @Column(name = "loai_dieu_kien", nullable = false)
    private ConditionType conditionType;

    // Giá trị của điều kiện (nếu có)
    @Column(name = "gia_tri_dieu_kien")
    private Double conditionValue;

    // Ngày bắt đầu hiệu lực voucher
    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDate startDate;

    // Ngày kết thúc hiệu lực voucher
    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDate endDate;

    // Giới hạn số lần sử dụng tổng cộng
    @Column(name = "gioi_han_su_dung", nullable = false)
    private Integer usageLimit;

    // Số lần voucher đã được sử dụng
    @Column(name = "so_lan_da_su_dung", nullable = false)
    private Integer usedCount = 0;

    // Enum định nghĩa loại giảm giá
    public enum DiscountType {
        PERCENTAGE,  // Giảm giá theo phần trăm
        FIXED        // Giảm giá số tiền cố định
    }

    // Enum định nghĩa loại điều kiện áp dụng voucher
    public enum ConditionType {
        ALL_CUSTOMERS,    // Áp dụng cho tất cả khách hàng
        FIRST_ORDER,      // Áp dụng cho đơn hàng đầu tiên
        TOTAL_PURCHASED,  // Dựa trên tổng tiền đã mua
        ORDER_VALUE,      // Dựa trên giá trị đơn hàng
        SPECIFIC_DATE     // Áp dụng vào ngày cụ thể
    }


    // Kiểm tra voucher đã hết hạn hay chưa
    public boolean isExpired() {
        return LocalDate.now().isAfter(endDate);
    }

    // Kiểm tra voucher đã dùng hết giới hạn sử dụng hay chưa
    public boolean isUsageLimitReached() {
        return usedCount >= usageLimit;
    }

    // Kiểm tra voucher đã bắt đầu hiệu lực hay chưa
    public boolean isStarted() {
        return LocalDate.now().isAfter(startDate) || LocalDate.now().isEqual(startDate);
    }

    // Kiểm tra voucher còn hiệu lực (đã bắt đầu, chưa hết hạn, chưa dùng hết)
    public boolean isValid() {
        return isStarted() && !isExpired() && !isUsageLimitReached();
    }
    
    // Lấy trạng thái voucher (UPCOMING, ACTIVE, EXPIRED, USED_UP)
    public String getVoucherStatus() {
        if (!isStarted()) {
            return "UPCOMING";  // Chưa bắt đầu
        } else if (isExpired()) {
            return "EXPIRED";   // Đã hết hạn
        } else if (isUsageLimitReached()) {
            return "USED_UP";    // Đã dùng hết
        } else {
            return "ACTIVE";    // Đang hoạt động
        }
    }

    // Tăng số lần sử dụng voucher
    public void incrementUsedCount() {
        this.usedCount++;
    }
}
