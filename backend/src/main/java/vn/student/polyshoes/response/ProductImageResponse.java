package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response class cho ProductImage
 * Chứa thông tin response khi trả về hình ảnh sản phẩm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageResponse {
    
    private Integer productImageId;
    private Integer productId;
    private String productName;
    private String imageUrl;
    private Boolean isMainImage; // Đánh dấu có phải hình ảnh chính hay không
    private java.util.Date createdAt; // Thời gian tạo
    private java.util.Date updatedAt; // Thời gian cập nhật
}