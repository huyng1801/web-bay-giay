package vn.student.polyshoes.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật sản phẩm
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    // Tên của sản phẩm
    @NotBlank(message = "Product name cannot be blank")
    private String productName;

    // Mô tả chi tiết của sản phẩm (tùy chọn)
    private String description; // Optional field

    // Giá bán đơn vị
    @NotNull(message = "Selling price cannot be null")
    @Min(value = 0, message = "Selling price must be at least 0")
    private Long sellingPrice;

    // Phần trăm chính giữ (mặc định: 0)
    @NotNull(message = "Discount percentage cannot be null")
    @Min(value = 0, message = "Discount percentage must be at least 0")
    private Integer discountPercentage = 0;

    // ID của thương hiệu
    @NotNull(message = "Brand ID cannot be null")
    private int brandId;

    // ID của danh mục con
    @NotNull(message = "Unit price cannot be null")
    private int subCategoryId;

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;
}
