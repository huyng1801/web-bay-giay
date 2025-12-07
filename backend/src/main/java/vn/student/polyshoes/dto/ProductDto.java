package vn.student.polyshoes.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    @NotBlank(message = "Product name cannot be blank")
    private String productName;

    private String description; // Optional field

    @NotNull(message = "Selling price cannot be null")
    @Min(value = 0, message = "Selling price must be at least 0")
    private Long sellingPrice;

    @NotNull(message = "Discount percentage cannot be null")
    @Min(value = 0, message = "Discount percentage must be at least 0")
    private Integer discountPercentage = 0;

    @NotNull(message = "Brand ID cannot be null")
    private int brandId;

    @NotNull(message = "Unit price cannot be null")
    private int subCategoryId;

    private Boolean isActive = true;
}
