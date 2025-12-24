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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

/**
 * Entity class đại diện cho Sản phẩm
 * Chứa thông tin chi tiết về sản phẩm bao gồm giá, brand, danh mục và các màu sắc có sẵn
 */
@Entity
@Table(name = "product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    // ID duy nhất của sản phẩm, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id") 
    private Integer productId;

    // Tên sản phẩm
    @Column(name = "product_name", nullable = false, length = 256, columnDefinition = "NVARCHAR(256)")
    private String productName;

    // Mô tả chi tiết về sản phẩm
    @Column(name = "description", columnDefinition = "NTEXT")
    private String description;

    // Giá bán của sản phẩm
    @Column(name = "selling_price", nullable = false)
    private long sellingPrice;

    // Phần trăm giảm giá (0-100%)
    @Column(name = "discount_percentage", nullable = false)
    private Integer discountPercentage = 0;

    // Trạng thái kích hoạt sản phẩm (true = hiển thị, false = ẩn)
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // Thời gian tạo sản phẩm
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Thương hiệu của sản phẩm
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    // Danh mục con của sản phẩm
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sub_category_id", nullable = false)
    private SubCategory subCategory;

    // Danh sách các màu sắc có sẵn của sản phẩm
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ProductColor> productColors;
}
