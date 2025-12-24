package vn.student.polyshoes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.Role;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật tài khoản quản trị viên
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    
    // Họ và tên của quản trị viên
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 50, message = "Full name must have between 2 and 50 characters")
    private String fullName;

    // Email của quản trị viên (phải là định dạng email hợp lệ)
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 256, message = "Email must not exceed 256 characters")
    private String email;

    // Mật khẩu của quản trị viên (từ 8-16 ký tự)
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 16, message = "Password must be at least 8 characters long and not exceed 128 characters")
    private String password;

    // Số điện thoại của quản trị viên (10-15 ký tự)
    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    private String phone;

    // Địa chỉ chính của quản trị viên
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    // Địa chỉ thứ hai (tùy chọn)
    @Size(max = 500, message = "Address2 must not exceed 500 characters")
    private String address2;

    // Vai trò của quản trị viên (ADMIN, STAFF, ...)
    @NotNull(message = "Role is required")
    private Role role;

    // Trạng thái hoạt động của tài khoản (mặc định: true)
    private Boolean isActive = true;
}
