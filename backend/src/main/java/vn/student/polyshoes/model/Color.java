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
@Table(name = "mau_sac")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Color {
    
    // ID duy nhất của màu sắc, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_mau_sac") 
    private Integer colorId;  

    // Tên của màu sắc
    @Column(name = "ten_mau_sac", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String colorName;

    // Trạng thái kích hoạt màu sắc
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;
    
    // Thời gian tạo màu sắc
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}