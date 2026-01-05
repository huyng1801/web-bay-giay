package vn.student.polyshoes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dùng để cập nhật thông tin hồ sơ cá nhân của khách hàng
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileDto {
    
    // Họ và tên khách hàng (2-50 ký tự)
    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min = 2, max = 50, message = "Họ và tên phải từ 2 đến 50 ký tự")
    private String fullName;
}
