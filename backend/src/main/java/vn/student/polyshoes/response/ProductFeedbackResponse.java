package vn.student.polyshoes.response;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductFeedbackResponse {
    private Long feedbackId;
    private Integer productId;
    private String productName;
    private Integer customerId;
    private String customerName;
    private String orderId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;

}
