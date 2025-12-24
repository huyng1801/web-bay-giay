package vn.student.polyshoes.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity class đại diện cho Đánh giá/Nhận xét sản phẩm từ khách hàng
 * Chứa thông tin rating, bình luận và thời gian đánh giá
 */
@Entity
@Table(name = "product_feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductFeedback {
    
    // ID duy nhất của đánh giá, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;

    // Sản phẩm được đánh giá
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Khách hàng thực hiện đánh giá
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // Đơn hàng liên quan đến đánh giá này
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Rating từ 1-5 sao
    @Column(name = "rating", nullable = false)
    private Integer rating;

    // Nội dung bình luận/nhận xét về sản phẩm
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    // Thời gian tạo đánh giá
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Thời gian chỉnh sửa lần cuối (nếu có)
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Trạng thái hiển thị của đánh giá (true = hiển thị, false = ẩn)
    @Column(name = "is_active")
    private Boolean isActive = true;

    // Constructor tiện dụng
    public ProductFeedback(Product product, Customer customer, Order order, Integer rating, String comment) {
        this.product = product;
        this.customer = customer;
        this.order = order;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    // Tự động cập nhật thời gian chỉnh sửa khi update
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
