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
    @NotBlank(message = "Vui lòng nhập họ tên")
    @Size(min = 2, max = 50, message = "Họ tên phải từ 2 đến 50 ký tự")
    private String fullName;

    // Email của quản trị viên (phải là định dạng email hợp lệ)
    @NotBlank(message = "Vui lòng nhập email")
    @Email(message = "Email không hợp lệ")
    @Size(max = 256, message = "Email không vượt quá 256 ký tự")
    private String email;

    // Mật khẩu của quản trị viên (từ 8-16 ký tự)
    @NotBlank(message = "Vui lòng nhập mật khẩu")
    @Size(min = 8, max = 16, message = "Mật khẩu phải từ 8 đến 16 ký tự")
    private String password;

    // Số điện thoại của quản trị viên (10-15 ký tự)
    @NotBlank(message = "Vui lòng nhập số điện thoại")
    @Size(min = 10, max = 15, message = "Số điện thoại phải từ 10 đến 15 ký tự")
    private String phone;

    // Địa chỉ của quản trị viên
    @Size(max = 500, message = "Địa chỉ không vượt quá 500 ký tự")
    private String address;

    // Vai trò của quản trị viên (ADMIN, STAFF, ...)
    @NotNull(message = "Vui lòng chọn vai trò")
    private Role role;

    // Trạng thái hoạt động của tài khoản (mặc định: true)
    private Boolean isActive = true;
}
