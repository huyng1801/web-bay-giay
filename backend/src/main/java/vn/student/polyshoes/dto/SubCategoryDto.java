package vn.student.polyshoes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.Gender;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật danh mục con
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryDto {

    // Tên danh mục con
    @NotBlank(message = "Sub-category name is required")
    @Size(max = 50, message = "Sub-category name must not exceed 50 characters")
    private String subCategoryName;

    // Giới tính (nam hoặc nữ)
    @NotNull(message = "Gender is required")
    private Gender gender;

    // ID của danh mục cha
    @NotNull(message = "Category ID is required")
    private Integer categoryId;  

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;

}
