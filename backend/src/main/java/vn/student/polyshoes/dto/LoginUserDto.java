package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

// DTO dùng để nhận dữ liệu khi đăng nhập
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginUserDto {
    // Email của người dùng
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
    private String email;

    // Mật khẩu (6-32 ký tự)
        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, max = 32, message = "Mật khẩu phải từ 6 đến 32 ký tự")
    private String password;
}