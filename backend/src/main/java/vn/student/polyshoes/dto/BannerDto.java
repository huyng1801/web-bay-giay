package vn.student.polyshoes.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật banner (biểu ngữ quảng cáo)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerDto {

    // Tiêu đề của banner
    @NotEmpty(message = "Tiêu đề không được để trống")
    @Size(max = 50, message = "Tiêu đề không vượt quá 50 ký tự")
    private String title;

    // Liên kết (link) khi click vào banner
    @Size(max = 512, message = "Liên kết không vượt quá 512 ký tự")
    private String link;

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;
    
    // ID admin user tạo banner (chỉ dùng cho tạo mới)
    private String createdByAdminId;
    
    // ID admin user cập nhật banner (chỉ dùng cho cập nhật)  
    private String updatedByAdminId;

    // File hình ảnh của banner
    private MultipartFile imageFile;
}
