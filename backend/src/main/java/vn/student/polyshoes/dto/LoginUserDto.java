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
    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email should be valid")
    private String email;

    // Mật khẩu (6-32 ký tự)
    @NotBlank(message = "Password must not be blank")
    @Size(min = 6, max = 32, message = "Password must be between 6 and 32 characters")
    private String password;
}