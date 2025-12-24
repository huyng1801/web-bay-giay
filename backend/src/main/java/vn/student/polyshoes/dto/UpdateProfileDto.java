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
    @NotBlank(message = "Full name must not be blank")
    @Size(min = 2, max = 50, message = "Full name must be between 2 and 50 characters")
    private String fullName;
}
