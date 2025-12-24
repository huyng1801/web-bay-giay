package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho kích cỡ của sản phẩm theo màu sắc
 * Sử dụng để trả về kích cỡ có sẵn và tồn kho cho mỗi màu
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSizeResponse {
    private Integer productSizeId; // ID duy nhất của kích cỡ sản phẩm
    private String sizeValue; // Giá trị kích cỡ (VD: 36, 37, 38, ...)
    private Integer stockQuantity; // Số lượng tồn kho
    private String colorName; // Tên màu sắc của sản phẩm
    private Boolean isActive; // Trạng thái hoạt động
}
