package vn.student.polyshoes.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Integer productId;
    private String productName;
    private String description;
    private Long sellingPrice;
    private Integer discountPercentage;
    private String subCategoryName;
    private String brandName;
    private Integer brandId; // New field for brandId
    private Integer subCategoryId; // New field for subCategoryId
    private Boolean isActive; // Added isActive field
    private String gender; // Added gender field
    private Integer totalStock; // Tổng số lượng tồn kho
    private Date createdAt;
    private Date updatedAt;
    private String imageUrl;
}
