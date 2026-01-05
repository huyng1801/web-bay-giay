package vn.student.polyshoes.dto;

import lombok.Data;

/**
 * DTO class cho ProductDetails
 * Chứa thông tin chi tiết sản phẩm (product, color, size, stock)
 */
@Data
public class ProductDetailsDto {
    
    private Integer productDetailsId;
    private Integer productId;
    private Integer colorId;
    private Integer sizeId;
    private Integer stockQuantity;
    private Boolean isActive;
}