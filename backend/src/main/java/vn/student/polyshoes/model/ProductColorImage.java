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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity class đại diện cho Hình ảnh bổ sung của một màu sắc sản phẩm
 * Mỗi product-color có thể có nhiều hình ảnh để hiển thị
 */
@Entity
@Table(name = "product_color_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColorImage {

    // ID duy nhất của hình ảnh, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_color_image_id")
    private Integer productColorImageId;

    // Đường dẫn URL của hình ảnh
    @Column(name = "image_url", nullable = false, length = 256, columnDefinition = "NVARCHAR(256)")
    private String imageUrl;

    // Tham chiếu tới product-color mà hình ảnh này thuộc về
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_color_id", nullable = false)
    private ProductColor productColor;
}
