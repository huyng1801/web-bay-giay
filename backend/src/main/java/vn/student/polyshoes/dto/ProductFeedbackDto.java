package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

// DTO dùng để nhận dữ liệu phản hồi/đánh giá sản phẩm của khách hàng
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductFeedbackDto {
    // ID của sản phẩm
    @NotNull(message = "Product ID is required")
    private Integer productId;

    // ID của khách hàng
    @NotNull(message = "Customer ID is required")
    private Integer customerId;

    // ID của đơn hàng
    @NotNull(message = "Order ID is required")
    private String orderId;

    // Điểm đánh giá (1-5 sao)
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    // Nhận xét, bình luận của khách hàng
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String comment;
}
