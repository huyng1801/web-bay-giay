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
 * Entity class đại diện cho Banner quảng cáo trên website
 * Chứa thông tin hình ảnh, tiêu đề và đường link của banner
 */
@Entity
@Table(name = "banner")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Banner {
    
    // ID duy nhất của banner, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id")
    private Integer bannerId;
    
    // Tiêu đề của banner
    @Column(name = "title", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String title;
    
    // Đường dẫn URL của hình ảnh banner
    @Column(name = "image_url", nullable = false, length = 128, columnDefinition = "NVARCHAR(128)")
    private String imageUrl;
    
    // Đường link khi click vào banner
    @Column(name = "link", length = 512, columnDefinition = "NVARCHAR(512)")
    private String link;
    
    // Trạng thái hiển thị banner
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Thời gian tạo banner
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    // Thời gian cập nhật lần cuối
    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}
