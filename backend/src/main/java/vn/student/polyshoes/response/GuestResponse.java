package vn.student.polyshoes.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho thông tin khách hàng không đăng ký (Guest)
 * Sử dụng để trả về dữ liệu guest cho client
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestResponse {
    private Integer guestId; // ID duy nhất của khách hàng guest
    private String fullName; // Họ tên đầy đủ
    private String email; // Địa chỉ email
    private String phone; // Số điện thoại liên lạc
    private String address; // Địa chỉ giao hàng chính
    private String address2; // Địa chỉ giao hàng thứ hai
    private String city; // Thành phố/Tỉnh
    private Date createdAt; // Thời gian tạo thông tin guest
    private Date updatedAt; // Thời gian cập nhật gần nhất
}
