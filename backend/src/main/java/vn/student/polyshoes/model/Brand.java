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
@Table(name = "thuong_hieu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Brand {
    
    // ID duy nhất của thương hiệu, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_thuong_hieu") 
    private Integer brandId;  

    // Tên thương hiệu
    @Column(name = "ten_thuong_hieu", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String brandName;

    // Logo hoặc hình ảnh đại diện thương hiệu
    @Column(name = "duong_dan_hinh_anh", length = 128, columnDefinition = "NVARCHAR(128)")  
    private String imageUrl; 

    // Trạng thái kích hoạt thương hiệu
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;
    
    // Thời gian tạo thương hiệu
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}
