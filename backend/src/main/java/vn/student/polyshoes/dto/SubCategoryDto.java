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
        @NotBlank(message = "Tên danh mục con là bắt buộc")
        @Size(max = 50, message = "Tên danh mục con không vượt quá 50 ký tự")
    private String subCategoryName;

    // Giới tính (nam hoặc nữ)
        @NotNull(message = "Giới tính là bắt buộc")
    private Gender gender;

    // ID của danh mục cha
        @NotNull(message = "ID danh mục cha là bắt buộc")
    private Integer categoryId;  

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;

}
