package vn.student.polyshoes.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * Entity class đại diện cho Thương hiệu (Brand) sản phẩm
 * Mỗi sản phẩm thuộc về một thương hiệu
 */
@Entity
@Table(name = "brand")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Brand {
    
    // ID duy nhất của thương hiệu, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id") 
    private Integer brandId;  

    // Tên thương hiệu
    @Column(name = "brand_name", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String brandName;

    // Logo hoặc hình ảnh đại diện thương hiệu
    @Column(name = "image_url", length = 128, columnDefinition = "NVARCHAR(128)")  
    private String imageUrl; 

    // Trạng thái kích hoạt thương hiệu
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Thời gian tạo thương hiệu
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    // Thời gian cập nhật lần cuối
    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}
