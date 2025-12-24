package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * Response DTO cho thông tin danh mục con
 * Sử dụng để trả về dữ liệu danh mục con cùng danh mục cha
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubCategoryResponse {
    private Integer subCategoryId; // ID duy nhất của danh mục con
    private String subCategoryName; // Tên danh mục con
    private String gender; // Giới tính mục tiêu (Nam, Nữ, Unisex)
    private Boolean isActive; // Trạng thái hoạt động
    private Date createdAt; // Thời gian tạo danh mục con
    private Date updatedAt; // Thời gian cập nhật gần nhất
    private Integer categoryId; // ID của danh mục cha
    private String categoryName; // Tên danh mục cha 

}
