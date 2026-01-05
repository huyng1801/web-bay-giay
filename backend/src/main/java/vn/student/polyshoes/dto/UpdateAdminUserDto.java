package vn.student.polyshoes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.Role;

// DTO dùng để cập nhật thông tin tài khoản quản trị viên (bỏi quản trị viên khác)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAdminUserDto {
    
    // Họ và tên quản trị viên
        @NotBlank(message = "Họ và tên không được để trống")
        @Size(min = 2, max = 50, message = "Họ và tên phải từ 2 đến 50 ký tự")
    private String fullName;

    // Email của quản trị viên
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        @Size(max = 256, message = "Email không vượt quá 256 ký tự")
    private String email;

    // Số điện thoại
        @NotBlank(message = "Số điện thoại không được để trống")
        @Size(min = 10, max = 15, message = "Số điện thoại phải từ 10 đến 15 ký tự")
    private String phone;

    // Địa chỉ
        @Size(max = 500, message = "Địa chỉ không vượt quá 500 ký tự")
    private String address;

    // Vai trò của quản trị viên
        @NotNull(message = "Vai trò là bắt buộc")
    private Role role;

    // Trạng thái hoạt động
        @NotNull(message = "Trạng thái hoạt động là bắt buộc")
    private Boolean isActive;
}