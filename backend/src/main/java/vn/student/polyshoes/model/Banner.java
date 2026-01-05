package vn.student.polyshoes.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
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
    @Column(name = "ma_banner")
    private Integer bannerId;
    
    // Tiêu đề của banner
    @Column(name = "tieu_de", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String title;
    
    // Đường dẫn URL của hình ảnh banner
    @Column(name = "duong_dan_hinh_anh", nullable = false, length = 128, columnDefinition = "NVARCHAR(128)")
    private String imageUrl;
    
    // Đường link khi click vào banner
    @Column(name = "duong_link", length = 512, columnDefinition = "NVARCHAR(512)")
    private String link;
    
    // Trạng thái hiển thị banner
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;
    
    // Admin user đã tạo banner này
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_tao", referencedColumnName = "ma_quan_tri_vien")
    private AdminUser createdBy;
    
    // Admin user đã cập nhật banner lần cuối
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_cap_nhat", referencedColumnName = "ma_quan_tri_vien")
    private AdminUser updatedBy;
    
    // Thời gian tạo banner
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
}
