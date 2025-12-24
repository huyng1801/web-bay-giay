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
    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    // Số điện thoại của khách hàng
    @NotBlank(message = "Phone number must not be blank")
    @Size(max = 15, message = "Phone number must not exceed 15 characters")
    private String phone;

    // Địa chỉ chính của khách hàng
    @NotBlank(message = "Address must not be blank")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    // Địa chỉ thứ hai (tùy chọn)
    @Size(max = 255, message = "Address2 must not exceed 255 characters")
    private String address2;

    // Thành phố/Tỉnh thành của khách hàng
    @NotBlank(message = "City must not be blank")
    @Size(max = 50, message = "City must not exceed 50 characters")
    private String city;
}
