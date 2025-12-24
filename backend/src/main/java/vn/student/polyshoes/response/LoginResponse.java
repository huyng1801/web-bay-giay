package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho đăng nhập thành công
 * Sử dụng để trả về JWT token và thời gian hết hạn
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token; // JWT token để xác thực các request tiếp theo
    private long expiresIn; // Thời gian hết hạn của token (tính bằng milliseconds hoặc giây)
}