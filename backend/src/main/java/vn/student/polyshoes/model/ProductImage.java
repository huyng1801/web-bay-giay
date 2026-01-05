package vn.student.polyshoes.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

/**
 * Entity class đại diện cho Hình ảnh của sản phẩm
 * Mỗi sản phẩm có thể có nhiều hình ảnh để hiển thị
 */
@Entity
@Table(name = "hinh_anh_san_pham")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImage {

    // ID duy nhất của hình ảnh, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_hinh_anh_san_pham")
    private Integer productImageId;

    // Đường dẫn URL của hình ảnh
    @Column(name = "url_hinh_anh", nullable = false, length = 256, columnDefinition = "NVARCHAR(256)")
    private String imageUrl;

    // Đánh dấu có phải hình ảnh chính hay không
    @Column(name = "la_hinh_chinh", nullable = false)
    private Boolean isMainImage = false;

    // Thời gian tạo hình ảnh
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Tham chiếu tới sản phẩm mà hình ảnh này thuộc về
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_san_pham", nullable = false)
    private Product product;
}
