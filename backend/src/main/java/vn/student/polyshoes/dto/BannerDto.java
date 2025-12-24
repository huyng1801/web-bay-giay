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
    @NotEmpty(message = "Title cannot be empty")
    @Size(max = 50, message = "Title cannot exceed 50 characters")
    private String title;

    // Liên kết (link) khi click vào banner
    @Size(max = 512, message = "Link cannot exceed 512 characters")
    private String link;

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;

    // File hình ảnh của banner
    private MultipartFile imageFile;
}
