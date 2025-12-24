package vn.student.polyshoes.exception;

// Exception tùy chỉnh khi thông tin đăng nhập không hợp lệ (sai email hoặc mật khẩu)
public class InvalidCredentialsException extends RuntimeException {
    // Constructor với thông báo lỗi
    public InvalidCredentialsException(String message) {
        super(message);
    }
}