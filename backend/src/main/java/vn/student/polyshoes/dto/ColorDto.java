package vn.student.polyshoes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật màu sản phẩm
@Data
public class ColorDto {
    
    // Tên màu sản phẩm (tiếng Việt)
    @NotBlank(message = "Tên màu không được để trống")
    @Size(max = 50, message = "Tên màu không vượt quá 50 ký tự")
    private String colorName;
    
    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;
}