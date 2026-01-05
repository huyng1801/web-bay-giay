package vn.student.polyshoes.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật danh mục sản phẩm
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    // Tên của danh mục sản phẩm
    @NotEmpty(message = "Tên danh mục không được để trống")
    @Size(max = 50, message = "Tên danh mục không vượt quá 50 ký tự")
    private String categoryName;
    
    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;
}
