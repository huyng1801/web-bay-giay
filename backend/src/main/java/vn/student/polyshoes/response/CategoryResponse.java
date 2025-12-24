package vn.student.polyshoes.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho thông tin danh mục sản phẩm
 * Sử dụng để trả về dữ liệu category cho client
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Integer categoryId; // ID duy nhất của danh mục
    private String categoryName; // Tên danh mục sản phẩm
    private Boolean isActive; // Trạng thái hoạt động (true: hoạt động, false: đã xóa/tạm tắt)
    private Date createdAt; // Thời gian tạo danh mục
    private Date updatedAt; // Thời gian cập nhật gần nhất
}
