package vn.student.polyshoes.model;

import java.util.Date;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import vn.student.polyshoes.enums.Gender;

/**
 * Entity class đại diện cho Danh mục con của sản phẩm
 * Mỗi danh mục con thuộc về một danh mục chính và có thể chứa nhiều sản phẩm
 */
@Entity
@Table(name = "danh_muc_con")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCategory {

    // ID duy nhất của danh mục con, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_danh_muc_con")
    private Integer subCategoryId;

    // Tên danh mục con
    @Column(name = "ten_danh_muc_con", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String subCategoryName;

    // Giới tính mục tiêu (MALE, FEMALE, UNISEX)
    @Column(name = "gioi_tinh", nullable = false)
    @Enumerated(EnumType.STRING)  
    private Gender gender;

    // Trạng thái kích hoạt danh mục con
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;

    // Thời gian tạo danh mục con
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Danh mục chính mà danh mục con này thuộc về
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_danh_muc", nullable = false)
    private Category category;

    // Danh sách các sản phẩm thuộc danh mục con này
    @OneToMany(mappedBy = "subCategory", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Product> products;
}
