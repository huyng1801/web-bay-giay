package vn.student.polyshoes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật kích cở chung
@Data
public class SizeDto {
    
    // Giá trị kích cở (VD: 36, 37, 38, ...)
    @NotBlank(message = "Giá trị size không được để trống")
    @Size(max = 20, message = "Giá trị size không được vượt quá 20 ký tự")
    private String sizeValue;
    
    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;
}