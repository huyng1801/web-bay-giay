package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

// DTO dùng để nhận dữ liệu thông tin khách hàng mua hàng không đăng nhập
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestDto {
    // Họ và tên của khách hàng
    @NotBlank(message = "Full name must not be blank")
    @Size(max = 50, message = "Full name must not exceed 50 characters")
    private String fullName;

    // Email của khách hàng
    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 50, message = "Họ và tên không vượt quá 50 ký tự")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 255, message = "Email không vượt quá 255 ký tự")
    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    private String phone;
    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(max = 15, message = "Số điện thoại không vượt quá 15 ký tự")
    @NotBlank(message = "Address must not be blank")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(max = 255, message = "Địa chỉ không vượt quá 255 ký tự")
    // Địa chỉ thứ hai (tùy chọn)
    @Size(max = 255, message = "Address2 must not exceed 255 characters")
    @Size(max = 255, message = "Địa chỉ 2 không vượt quá 255 ký tự")

    // Thành phố/Tỉnh thành của khách hàng
    @NotBlank(message = "Thành phố không được để trống")
    @Size(max = 50, message = "Thành phố không vượt quá 50 ký tự")
    private String city;
}
