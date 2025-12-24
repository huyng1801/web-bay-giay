package vn.student.polyshoes.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật thương hiệu (brand)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandDto {

    // Tên của thương hiệu
    @NotBlank(message = "Brand name is required")
    @Size(max = 50, message = "Brand name must not exceed 50 characters")
    private String brandName;

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;

    // File hình ảnh logo của thương hiệu
    private MultipartFile imageFile;
}
