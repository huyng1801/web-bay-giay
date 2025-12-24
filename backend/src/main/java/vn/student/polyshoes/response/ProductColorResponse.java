package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho màu sắc của một sản phẩm cụ thể
 * Sử dụng để trả về thông tin màu và hình ảnh đại diện của sản phẩm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColorResponse {
    private Integer productColorId; // ID duy nhất của sản phẩm-màu
    private String colorName; // Tên màu sắc
    private String imageUrl; // URL hình ảnh đại diện của màu này
    private Boolean isActive; // Trạng thái hoạt động
}
