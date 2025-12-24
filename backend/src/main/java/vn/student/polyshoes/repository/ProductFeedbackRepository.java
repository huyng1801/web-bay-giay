package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.model.ProductFeedback;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface để tương tác với dữ liệu ProductFeedback trong database
 * Cung cấp các phương thức tìm kiếm, lọc và quản lý đánh giá sản phẩm từ khách hàng
 */
@Repository
public interface ProductFeedbackRepository extends JpaRepository<ProductFeedback, Long> {
    
    // Lấy tất cả đánh giá đang hoạt động của một sản phẩm
    List<ProductFeedback> findByProductAndIsActiveTrue(Product product);
    
    // Lấy tất cả đánh giá đang hoạt động của một khách hàng
    List<ProductFeedback> findByCustomerAndIsActiveTrue(Customer customer);
    
    // Lấy đánh giá của khách hàng cho một đơn hàng
    List<ProductFeedback> findByCustomerAndOrderAndIsActiveTrue(Customer customer, Order order);
    
    // Tìm một đánh giá cụ thể (sản phẩm, khách hàng, đơn hàng)
    Optional<ProductFeedback> findByProductAndCustomerAndOrderOrderIdAndIsActiveTrue(
            Product product, Customer customer, String orderId);
    
    // Lấy điểm trung bình rating của một sản phẩm
    @Query("SELECT AVG(pf.rating) FROM ProductFeedback pf WHERE pf.product = :product AND pf.isActive = true")
    Double getAverageRatingByProduct(@Param("product") Product product);
    
    // Lấy tổng số đánh giá của một sản phẩm
    @Query("SELECT COUNT(pf) FROM ProductFeedback pf WHERE pf.product = :product AND pf.isActive = true")
    Long getTotalFeedbackCountByProduct(@Param("product") Product product);
    
    // Lấy đánh giá của một sản phẩm sắp xếp theo ngày tạo mới nhất trước
    @Query("SELECT pf FROM ProductFeedback pf WHERE pf.product = :product AND pf.isActive = true ORDER BY pf.createdAt DESC")
    List<ProductFeedback> findByProductOrderByCreatedAtDesc(@Param("product") Product product);
    
    // Lấy tất cả đánh giá đang hoạt động sắp xếp theo ngày tạo mới nhất trước
    @Query("SELECT pf FROM ProductFeedback pf WHERE pf.isActive = true ORDER BY pf.createdAt DESC")
    List<ProductFeedback> findAllActiveOrderByCreatedAtDesc();
    
    // Kiểm tra khách hàng đã đánh giá sản phẩm này trong đơn hàng chưa
    boolean existsByProductAndCustomerAndOrderOrderIdAndIsActiveTrue(
            Product product, Customer customer, String orderId);
}
