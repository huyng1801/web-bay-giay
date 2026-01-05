package vn.student.polyshoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

/**
 * Entity class đại diện cho Chi tiết sản phẩm (bao gồm màu sắc và kích cỡ)
 * Thay thế cho ProductColor và ProductSize để đơn giản hóa cấu trúc
 */
@Entity
@Table(name = "chi_tiet_san_pham")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetails {
    
    // ID duy nhất của chi tiết sản phẩm, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_chi_tiet_san_pham")
    private Integer productDetailsId;
    
    // Số lượng tồn kho
    @Column(name = "so_luong_ton_kho", nullable = false)
    private Integer stockQuantity;

    // Trạng thái kích hoạt
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;

    // Thời gian tạo chi tiết sản phẩm
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    // Tham chiếu tới sản phẩm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private Product product;
    
    // Tham chiếu tới màu sắc
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ma_mau_sac", nullable = false)
    private Color color;
    
    // Tham chiếu tới kích cỡ
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ma_kich_co", nullable = false)
    private Size size;
}