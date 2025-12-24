package vn.student.polyshoes.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * Entity class đại diện cho Màu sắc cụ thể của một sản phẩm
 * Mỗi sản phẩm có thể có nhiều màu khác nhau
 */
@Entity
@Table(name = "product_color")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColor {
    
    // ID duy nhất của product-color combination, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_color_id")
    private Integer productColorId;
    
    // Tên màu sắc của sản phẩm này
    @Column(name = "color_name", nullable = false, length = 30, columnDefinition = "NVARCHAR(30)")
    private String colorName;

    // Hình ảnh đại diện cho màu sắc này
    @Column(name = "image_url", nullable = false, length = 256, columnDefinition = "NVARCHAR(256)")
    private String imageUrl;

    // Trạng thái kích hoạt của product-color này
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Tham chiếu tới sản phẩm chứa màu sắc này
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Danh sách các size có sẵn cho màu sắc và sản phẩm này
    @OneToMany(mappedBy = "productColor", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ProductSize> productSizes;
}
