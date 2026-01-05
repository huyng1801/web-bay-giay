package vn.student.polyshoes.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
 * Entity class đại diện cho Danh mục sản phẩm chính
 * Một danh mục có thể chứa nhiều danh mục con (SubCategory)
 */
@Entity
@Table(name = "danh_muc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    // ID duy nhất của danh mục, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_danh_muc")
    private Integer categoryId;

    // Tên danh mục, phải duy nhất
    @Column(name = "ten_danh_muc", nullable = false, unique = true, length = 50, columnDefinition = "NVARCHAR(50)")
    private String categoryName;

    // Trạng thái kích hoạt danh mục
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;

    // Thời gian tạo danh mục
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Danh sách các danh mục con thuộc danh mục này
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<SubCategory> subCategories;
}
