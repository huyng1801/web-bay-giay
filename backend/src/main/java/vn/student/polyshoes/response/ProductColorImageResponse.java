package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho hình ảnh của sản phẩm theo màu sắc
 * Sử dụng để trả về URL hình ảnh cho mỗi màu sắc của sản phẩm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColorImageResponse {
    private Integer productColorImageId; // ID duy nhất của hình ảnh
    private String imageUrl; // URL hoặc đường dẫn hình ảnh
    private Integer productColorId; // ID của sản phẩm-màu để tham chiếu (tùy chọn)
}
