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
        @NotBlank(message = "Giá trị kích cỡ là bắt buộc")
        @Size(max = 30, message = "Giá trị kích cỡ không vượt quá 30 ký tự")
    private String sizeValue;

    // Số lượng tồn kho của kích cở này
        @NotNull(message = "Số lượng tồn kho là bắt buộc")
        @Min(value = 0, message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    private Integer stockQuantity;

    // ID của màu sản phẩm liên kết
        @NotNull(message = "ID màu sản phẩm là bắt buộc")
    private Integer productColorId; // Associated product color ID

    // Trạng thái hoạt động (mặc định: true)
    private Boolean isActive = true;
}
