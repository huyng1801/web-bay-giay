package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response class cho ProductDetails
 * Chứa thông tin response khi trả về chi tiết sản phẩm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailsResponse {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ColorInfo {
        private Integer colorId;
        private String colorName;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SizeInfo {
        private Integer sizeId;
        private String sizeValue;
    }
    
    private Integer productDetailsId;
    private Integer productId;
    private String productName;
    private ColorInfo color;
    private SizeInfo size;
    private Integer stockQuantity;
    private Boolean isActive;
}