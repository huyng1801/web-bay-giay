package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.ProductFeedbackDto;
import vn.student.polyshoes.response.ProductFeedbackResponse;
import vn.student.polyshoes.service.ProductFeedbackService;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class ProductFeedbackController {

    @Autowired
    private ProductFeedbackService productFeedbackService;

    // Tạo feedback mới
    @PostMapping
    public ResponseEntity<ProductFeedbackResponse> createFeedback(@Valid @RequestBody ProductFeedbackDto feedbackDto) {
        try {
            ProductFeedbackResponse response = productFeedbackService.createFeedback(feedbackDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy tất cả feedback
    @GetMapping
    public ResponseEntity<List<ProductFeedbackResponse>> getAllFeedbacks() {
        try {
            List<ProductFeedbackResponse> feedbacks = productFeedbackService.getAllFeedbacks();
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy feedback theo sản phẩm
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductFeedbackResponse>> getFeedbacksByProduct(@PathVariable Integer productId) {
        try {
            List<ProductFeedbackResponse> feedbacks = productFeedbackService.getFeedbacksByProduct(productId);
            return ResponseEntity.ok(feedbacks);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy feedback theo khách hàng
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ProductFeedbackResponse>> getFeedbacksByCustomer(@PathVariable Integer customerId) {
        try {
            List<ProductFeedbackResponse> feedbacks = productFeedbackService.getFeedbacksByCustomer(customerId);
            return ResponseEntity.ok(feedbacks);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy rating trung bình của sản phẩm
    @GetMapping("/product/{productId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Integer productId) {
        try {
            Double avgRating = productFeedbackService.getAverageRatingByProduct(productId);
            return ResponseEntity.ok(avgRating);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(0.0);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0.0);
        }
    }

    // Lấy tổng số feedback của sản phẩm
    @GetMapping("/product/{productId}/count")
    public ResponseEntity<Long> getFeedbackCount(@PathVariable Integer productId) {
        try {
            Long count = productFeedbackService.getTotalFeedbackCountByProduct(productId);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(0L);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }

    // Cập nhật feedback
    @PutMapping("/{feedbackId}")
    public ResponseEntity<ProductFeedbackResponse> updateFeedback(
            @PathVariable Long feedbackId, 
            @Valid @RequestBody ProductFeedbackDto feedbackDto) {
        try {
            ProductFeedbackResponse response = productFeedbackService.updateFeedback(feedbackId, feedbackDto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Xóa feedback (soft delete)
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId) {
        try {
            productFeedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
