package vn.student.polyshoes.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho thông tin sản phẩm
 * Sử dụng để trả về dữ liệu sản phẩm cùng với danh mục, thương hiệu và thống kê tồn kho
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Integer productId; // ID duy nhất của sản phẩm
    private String productName; // Tên sản phẩm
    private String description; // Mô tả chi tiết sản phẩm
    private Long sellingPrice; // Giá bán của sản phẩm
    private Integer discountPercentage; // Phần trăm chiết khấu
    private String subCategoryName; // Tên danh mục con
    private String brandName; // Tên thương hiệu
    private Integer brandId; // ID của thương hiệu
    private Integer subCategoryId; // ID của danh mục con
    private Boolean isActive; // Trạng thái hoạt động (true: bán được, false: tạm tắt/xóa)
    private String gender; // Giới tính mục tiêu (Nam, Nữ, Unisex)
    private Integer totalStock; // Tổng số lượng tồn kho
    private Date createdAt; // Thời gian tạo sản phẩm
    private Date updatedAt; // Thời gian cập nhật gần nhất
    private String imageUrl; // URL hình ảnh đại diện sản phẩm
}
