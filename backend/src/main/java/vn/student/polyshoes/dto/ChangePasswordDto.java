package vn.student.polyshoes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// DTO dùng để nhận dữ liệu khi thay đổi mật khẩu
@Data 
public class ChangePasswordDto {

    // Mật khẩu cũ (dùng để xác minh)
    @NotBlank(message = "Old password is required")
    private String oldPassword;

    // Mật khẩu mới (từ 8-16 ký tự)
    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 16, message = "New password must be between 8 and 16 characters")
    private String newPassword;
}
