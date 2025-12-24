package vn.student.polyshoes.dto;

import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật màu của sản phẩm
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColorDto {

    // Tên màu sản phẩm
    @NotBlank(message = "Color name is required")
    @Size(max = 30, message = "Color name must not exceed 30 characters")
    private String colorName;

    // File hình ảnh của màu sản phẩm
    private MultipartFile imageFile; // File upload for the image

    // ID của sản phẩm liên kết
    private Integer productId; // The associated product ID

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;
}
