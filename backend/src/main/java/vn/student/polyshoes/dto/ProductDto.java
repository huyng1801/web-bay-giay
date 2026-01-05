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
        @NotBlank(message = "Tên sản phẩm không được để trống")
    private String productName;

    // Mô tả chi tiết của sản phẩm (tùy chọn)
    private String description; // Optional field

    // Giá bán đơn vị
        @NotNull(message = "Giá bán không được để trống")
        @Min(value = 0, message = "Giá bán phải lớn hơn hoặc bằng 0")
    private Long sellingPrice;

    // Phần trăm chính giữ (mặc định: 0)
        @NotNull(message = "Phần trăm giảm giá không được để trống")
        @Min(value = 0, message = "Phần trăm giảm giá phải lớn hơn hoặc bằng 0")
    private Integer discountPercentage = 0;

    // ID của thương hiệu
        @NotNull(message = "ID thương hiệu không được để trống")
    private int brandId;

    // ID của danh mục con
        @NotNull(message = "ID danh mục con không được để trống")
    private int subCategoryId;

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;
}
