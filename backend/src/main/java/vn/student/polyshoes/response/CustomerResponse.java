package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho thông tin khách hàng đã đăng ký
 * Sử dụng để trả về dữ liệu customer cho client
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private Integer customerId; // ID duy nhất của khách hàng
    private String fullName; // Họ tên đầy đủ
    private String email; // Địa chỉ email, dùng để đăng nhập
    private String phone; // Số điện thoại liên lạc
    private String address; // Địa chỉ giao hàng chính
    private String address2; // Địa chỉ giao hàng thứ hai
    private String city; // Thành phố/Tỉnh
    private Boolean isActive; // Trạng thái hoạt động (true: hoạt động, false: bị khóa)
}
