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
    // ID của ProductDetails (chi tiết sản phẩm)
        @NotNull(message = "ID chi tiết sản phẩm không được để trống")
    private Integer productDetailsId;

    // Số lượng sản phẩm đắt (> 0)
        @NotNull(message = "Số lượng không được để trống")
        @Positive(message = "Số lượng phải lớn hơn 0")
    private Integer quantity;

    // Giá tiền của sản phẩm
        @NotNull(message = "Giá không được để trống")
        @PositiveOrZero(message = "Giá phải lớn hơn hoặc bằng 0")
    private Long price;
}
