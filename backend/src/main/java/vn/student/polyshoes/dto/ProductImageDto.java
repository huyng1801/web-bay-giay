package vn.student.polyshoes.dto;

import lombok.Data;

/**
 * DTO class cho ProductImage
 * Chứa thông tin hình ảnh sản phẩm
 */
@Data
public class ProductImageDto {
    
    private Integer productImageId;
    private Integer productId;
    private String imageUrl;
}