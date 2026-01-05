package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

// DTO dùng để nhận dữ liệu đăng ký tài khoản khách hàng mới
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    // Họ và tên khách hàng
        @NotBlank(message = "Họ và tên không được để trống")
        @Size(max = 50, message = "Họ và tên không vượt quá 50 ký tự")
    private String fullName;

    // Email của khách hàng
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        @Size(max = 255, message = "Email không vượt quá 255 ký tự")
    private String email;

    // Mật khẩu (6-32 ký tự)
        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, max = 32, message = "Mật khẩu phải từ 6 đến 32 ký tự")
    private String password;

    // Số điện thoại của khách hàng
        @NotBlank(message = "Số điện thoại không được để trống")
        @Size(max = 15, message = "Số điện thoại không vượt quá 15 ký tự")
    private String phone;

    // Địa chỉ chính
        @NotBlank(message = "Địa chỉ không được để trống")
        @Size(max = 255, message = "Địa chỉ không vượt quá 255 ký tự")
    private String address;

    // Địa chỉ thứ hai (tùy chọn)
        @Size(max = 255, message = "Địa chỉ 2 không vượt quá 255 ký tự")
    private String address2;

    // Province ID từ GHN
        @NotNull(message = "ID tỉnh không được để trống")
    private Integer provinceId;

    // District ID từ GHN
        @NotNull(message = "ID quận/huyện không được để trống")
    private Integer districtId;

    // Ward Code từ GHN
        @NotBlank(message = "Mã phường/xã không được để trống")
    private String wardCode;
}