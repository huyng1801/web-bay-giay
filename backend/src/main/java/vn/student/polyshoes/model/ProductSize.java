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
 * Entity class đại diện cho Kích cỡ cụ thể của một sản phẩm với một màu sắc
 * Chứa thông tin size, số lượng tồn kho
 */
@Entity
@Table(name = "product_size")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSize {
    
    // ID duy nhất của product-color-size combination, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_size_id")
    private Integer productSizeId;
    
    // Giá trị kích cỡ (vd: 39, 40, 41 cho giày)
    @Column(name = "size_value", nullable = false, length = 30, columnDefinition = "NVARCHAR(30)")
    private String sizeValue;
    
    // Số lượng tồn kho của kích cỡ này
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    // Trạng thái kích hoạt của kích cỡ này
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Tham chiếu tới product-color mà kích cỡ này thuộc về
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_color_id", nullable = false)
    private ProductColor productColor;
}
