package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.student.polyshoes.dto.ProductFeedbackDto;
import vn.student.polyshoes.model.*;
import vn.student.polyshoes.repository.*;
import vn.student.polyshoes.response.ProductFeedbackResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductFeedbackService {

    @Autowired
    private ProductFeedbackRepository productFeedbackRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public ProductFeedbackResponse createFeedback(ProductFeedbackDto feedbackDto) {
        Product product = productRepository.findById(feedbackDto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Customer customer = customerRepository.findById(feedbackDto.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        if (!customer.getIsActive()) {
            throw new IllegalArgumentException("Tài khoản của bạn đã bị ngừng hoạt động. Không thể tạo đánh giá.");
        }
        Order order = orderRepository.findById(feedbackDto.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        boolean alreadyExists = productFeedbackRepository.existsByProductAndCustomerAndOrderOrderIdAndIsActiveTrue(
                product, customer, feedbackDto.getOrderId());
        if (alreadyExists) {
            throw new IllegalArgumentException("Customer has already provided feedback for this product in this order");
        }
        ProductFeedback feedback = new ProductFeedback(
                product, customer, order, feedbackDto.getRating(), feedbackDto.getComment());
        return mapToResponse(productFeedbackRepository.save(feedback));
    }

    public List<ProductFeedbackResponse> getFeedbacksByProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return productFeedbackRepository.findByProductOrderByCreatedAtDesc(product)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductFeedbackResponse> getFeedbacksByCustomer(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        return productFeedbackRepository.findByCustomerAndIsActiveTrue(customer)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductFeedbackResponse> getAllFeedbacks() {
        return productFeedbackRepository.findAllActiveOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get top reviews for home page (highest rated and most recent)
    public List<ProductFeedbackResponse> getTopReviews(int limit) {
        return productFeedbackRepository.findAllActiveOrderByCreatedAtDesc()
                .stream()
                .sorted((a, b) -> {
                    // Sort by rating descending, then by creation date descending
                    int ratingCompare = Integer.compare(b.getRating(), a.getRating());
                    if (ratingCompare != 0) {
                        return ratingCompare;
                    }
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(limit)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Double getAverageRatingByProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Double avgRating = productFeedbackRepository.getAverageRatingByProduct(product);
        return avgRating != null ? avgRating : 0.0;
    }

    public Long getTotalFeedbackCountByProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return productFeedbackRepository.getTotalFeedbackCountByProduct(product);
    }

    @Transactional
        public ProductFeedbackResponse updateFeedback(Long feedbackId, ProductFeedbackDto feedbackDto) {
                ProductFeedback feedback = productFeedbackRepository.findById(feedbackId)
                                .orElseThrow(() -> new IllegalArgumentException("Feedback not found"));
                feedback.setRating(feedbackDto.getRating());
                feedback.setComment(feedbackDto.getComment());
                feedback.setUpdatedAt(LocalDateTime.now());
                return mapToResponse(productFeedbackRepository.save(feedback));
    }

    @Transactional
        public void deleteFeedback(Long feedbackId) {
                ProductFeedback feedback = productFeedbackRepository.findById(feedbackId)
                                .orElseThrow(() -> new IllegalArgumentException("Feedback not found"));
                feedback.setIsActive(false);
                feedback.setUpdatedAt(LocalDateTime.now());
                productFeedbackRepository.save(feedback);
    }

        private ProductFeedbackResponse mapToResponse(ProductFeedback feedback) {
                return new ProductFeedbackResponse(
                                feedback.getFeedbackId(),
                                feedback.getProduct().getProductId(),
                                feedback.getProduct().getProductName(),
                                feedback.getCustomer().getCustomerId(),
                                feedback.getCustomer().getFullName(),
                                feedback.getOrder().getOrderId(),
                                feedback.getRating(),
                                feedback.getComment(),
                                feedback.getCreatedAt(),
                                feedback.getUpdatedAt(),
                                feedback.getIsActive()
                );
        }
}
