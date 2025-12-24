package vn.student.polyshoes.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dùng để nhận dữ liệu kích cở sản phẩm và tồn kho
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSizeDto {

    // Giá trị kích cở (VD: 36, 37, 38, ...)
    @NotBlank(message = "Size value is required")
    @Size(max = 30, message = "Size value must not exceed 30 characters")
    private String sizeValue;

    // Số lượng tồn kho của kích cở này
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be greater than or equal to 0")
    private Integer stockQuantity;

    // ID của màu sản phẩm liên kết
    @NotNull(message = "Product color ID is required")
    private Integer productColorId; // Associated product color ID

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;
}
