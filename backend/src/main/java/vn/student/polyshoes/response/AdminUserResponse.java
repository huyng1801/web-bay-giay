package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.Role;

import java.util.Date;

/**
 * Response DTO cho thông tin người dùng quản trị viên
 * Sử dụng để trả về dữ liệu admin user cho client
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private String adminUserId; // ID duy nhất của admin user
    private String email; // Email của admin user, dùng để đăng nhập
    private String fullName; // Họ tên đầy đủ của admin user
    private String phone; // Số điện thoại liên lạc
    private String address; // Địa chỉ chính
    private String address2; // Địa chỉ thứ hai
    private Role role; // Vai trò của admin (ADMIN, STAFF, ...)
    private Boolean isActive; // Trạng thái hoạt động (true: hoạt động, false: bị khóa)
    private Date createdAt; // Thời gian tạo tài khoản
    private Date updatedAt; // Thời gian cập nhật gần nhất
}
