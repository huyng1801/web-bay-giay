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
 * Entity class đại diện cho Màu sắc sản phẩm
 * Lưu danh sách các màu có sẵn trong hệ thống
 */
@Entity
@Table(name = "color")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Color {
    
    // ID duy nhất của màu sắc, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "color_id") 
    private Integer colorId;  

    // Tên của màu sắc
    @Column(name = "color_name", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String colorName;

    // Trạng thái kích hoạt màu sắc
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Thời gian tạo màu sắc
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    // Thời gian cập nhật lần cuối
    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}