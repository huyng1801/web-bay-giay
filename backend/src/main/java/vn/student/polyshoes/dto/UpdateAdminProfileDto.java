package vn.student.polyshoes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// DTO dùng để cập nhật thông tin hồ sơ quản trị viên
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAdminProfileDto {
    // Họ và tên quản trị viên
    private String fullName;
    // Số điện thoại
    private String phone;
    // Địa chỉ
    private String address;
}