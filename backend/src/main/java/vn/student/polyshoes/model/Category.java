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
@Table(name = "category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    // ID duy nhất của danh mục, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    // Tên danh mục, phải duy nhất
    @Column(name = "category_name", nullable = false, unique = true, length = 50, columnDefinition = "NVARCHAR(50)")
    private String categoryName;

    // Trạng thái kích hoạt danh mục
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    // Thời gian tạo danh mục
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Danh sách các danh mục con thuộc danh mục này
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<SubCategory> subCategories;
}
