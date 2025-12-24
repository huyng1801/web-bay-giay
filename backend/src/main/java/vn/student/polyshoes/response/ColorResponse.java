package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * Response DTO cho thông tin màu sắc sản phẩm
 * Sử dụng để trả về dữ liệu color cho client
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColorResponse {
    private Integer colorId; // ID duy nhất của màu sắc
    private String colorName; // Tên màu sắc (ví dụ: Đen, Trắng, Xanh, ...)
    private Boolean isActive; // Trạng thái hoạt động (true: hoạt động, false: đã xóa/tạm tắt)
    private Date createdAt; // Thời gian tạo màu sắc
    private Date updatedAt; // Thời gian cập nhật gần nhất
}