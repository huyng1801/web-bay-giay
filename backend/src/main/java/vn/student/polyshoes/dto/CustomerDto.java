package vn.student.polyshoes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
/**
 * DTO dùng để nhận dữ liệu thông tin khách hàng
 * Sử dụng annotation @Data của Lombok để tự động sinh các phương thức getter, setter, toString, equals, và hashCode.
 */
@AllArgsConstructor
public class CustomerDto {

    // Họ và tên khách hàng
        @NotBlank(message = "Họ và tên là bắt buộc")
        @Size(max = 50, message = "Họ và tên không vượt quá 50 ký tự")
    private String fullName;

    // Email của khách hàng
        @NotBlank(message = "Email là bắt buộc")
        @Email(message = "Email không hợp lệ")
        @Size(max = 255, message = "Email không vượt quá 255 ký tự")
    private String email;

    // Mật khẩu (có thể tùy chọn)
        @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String hashPassword;

    // Số điện thoại của khách hàng
        @NotBlank(message = "Số điện thoại là bắt buộc")
        @Size(max = 15, message = "Số điện thoại không vượt quá 15 ký tự")
    private String phone;

    // Địa chỉ cụ thể (số nhà, tên đường, ...)
    private String address;

    // GHN Province ID
    private Integer ghnProvinceId;

    // GHN District ID
    private Integer ghnDistrictId;

    // GHN Ward Code
    private String ghnWardCode;
}
