package vn.student.polyshoes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// DTO dùng để nhận dữ liệu khi thay đổi mật khẩu
@Data 
public class ChangePasswordDto {

    // Mật khẩu cũ (dùng để xác minh)
    @NotBlank(message = "Vui lòng nhập mật khẩu cũ")
    private String oldPassword;

    // Mật khẩu mới (từ 8-16 ký tự)
    @NotBlank(message = "Vui lòng nhập mật khẩu mới")
    @Size(min = 8, max = 16, message = "Mật khẩu mới phải từ 8 đến 16 ký tự")
    private String newPassword;
}
