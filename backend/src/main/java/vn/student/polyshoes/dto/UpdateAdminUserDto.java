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
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 50, message = "Full name must have between 2 and 50 characters")
    private String fullName;

    // Email của quản trị viên
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 256, message = "Email must not exceed 256 characters")
    private String email;

    // Số điện thoại
    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    private String phone;

    // Địa chỉ chính
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    // Địa chỉ thứ hai
    @Size(max = 500, message = "Address2 must not exceed 500 characters")
    private String address2;

    // Vai trò của quản trị viên
    @NotNull(message = "Role is required")
    private Role role;

    // Trạng thái hoạt động
    @NotNull(message = "Active status is required")
    private Boolean isActive;
}