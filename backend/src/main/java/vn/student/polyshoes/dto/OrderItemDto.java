package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

// DTO dùng để nhận dữ liệu chi tiết của từng sản phẩm trong đơn hàng
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    // ID của ProductSize (kích cở sản phẩm)
    @NotNull(message = "Product size ID must not be null")
    private Integer productSizeId;

    // Số lượng sản phẩm đắt (> 0)
    @NotNull(message = "Quantity must not be null")
    @Positive(message = "Quantity must be greater than 0")
    private Integer quantity;

    // Giá tiền của sản phẩm
    @NotNull(message = "Price must not be null")
    @PositiveOrZero(message = "Price must be zero or positive")
    private Long price;
}
