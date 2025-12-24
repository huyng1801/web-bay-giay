package vn.student.polyshoes.response;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO cho đánh giá/bình luận sản phẩm
 * Sử dụng để trả về thông tin feedback của khách hàng về sản phẩm
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductFeedbackResponse {
    private Long feedbackId; // ID duy nhất của feedback
    private Integer productId; // ID của sản phẩm được đánh giá
    private String productName; // Tên sản phẩm
    private Integer customerId; // ID của khách hàng đánh giá
    private String customerName; // Tên khách hàng
    private String orderId; // ID của đơn hàng chứa sản phẩm
    private Integer rating; // Điểm đánh giá (1-5 sao)
    private String comment; // Nội dung bình luận/nhận xét
    private LocalDateTime createdAt; // Thời gian tạo feedback
    private LocalDateTime updatedAt; // Thời gian cập nhật gần nhất
    private Boolean isActive; // Trạng thái của feedback

}
