package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * Response DTO cho thông tin kích cỡ sản phẩm
 * Sử dụng để trả về dữ liệu các kích cỡ sẵn có trong hệ thống
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SizeResponse {
    private Integer sizeId; // ID duy nhất của kích cỡ
    private String sizeValue; // Giá trị kích cỡ (VD: 36, 37, 38, ...)
    private Boolean isActive; // Trạng thái hoạt động
    private Date createdAt; // Thời gian tạo kích cỡ
    private Date updatedAt; // Thời gian cập nhật gần nhất
}