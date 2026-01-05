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
 * Entity class đại diện cho Kích cỡ chung trong hệ thống
 * Lưu danh sách các kích cỡ có sẵn có thể được gán cho sản phẩm
 */
@Entity
@Table(name = "kich_co")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Size {
    
    // ID duy nhất của kích cỡ, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_kich_co") 
    private Integer sizeId;  

    // Giá trị kích cỡ (vd: "39", "40", "41" cho giày)
    @Column(name = "gia_tri_kich_co", nullable = false, length = 20, columnDefinition = "NVARCHAR(20)")
    private String sizeValue;

    // Trạng thái kích hoạt kích cỡ này
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;
    
    // Thời gian tạo kích cỡ
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}