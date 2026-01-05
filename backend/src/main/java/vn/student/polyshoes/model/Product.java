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
@Table(name = "san_pham")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    // ID duy nhất của sản phẩm, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_san_pham") 
    private Integer productId;

    // Tên sản phẩm
    @Column(name = "ten_san_pham", nullable = false, length = 256, columnDefinition = "NVARCHAR(256)")
    private String productName;

    // Mô tả chi tiết về sản phẩm
    @Column(name = "mo_ta", columnDefinition = "NTEXT")
    private String description;

    // Giá bán của sản phẩm
    @Column(name = "gia_ban", nullable = false)
    private long sellingPrice;

    // Phần trăm giảm giá (0-100%)
    @Column(name = "phan_tram_giam_gia", nullable = false)
    private Integer discountPercentage = 0;

    // Trạng thái kích hoạt sản phẩm (true = hiển thị, false = ẩn)
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;

    // Thời gian tạo sản phẩm
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Thương hiệu của sản phẩm
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ma_thuong_hieu", nullable = false)
    private Brand brand;

    // Danh mục con của sản phẩm
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ma_danh_muc_con", nullable = false)
    private SubCategory subCategory;

    // Danh sách các chi tiết sản phẩm (màu sắc và kích cỡ)
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ProductDetails> productDetails;

    // Danh sách các hình ảnh của sản phẩm
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ProductImage> productImages;
}
