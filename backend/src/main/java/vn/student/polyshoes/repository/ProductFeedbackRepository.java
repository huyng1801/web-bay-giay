package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.model.ProductFeedback;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductFeedbackRepository extends JpaRepository<ProductFeedback, Long> {
    
    List<ProductFeedback> findByProductAndIsActiveTrue(Product product);
    
    List<ProductFeedback> findByCustomerAndIsActiveTrue(Customer customer);
    
    Optional<ProductFeedback> findByProductAndCustomerAndOrderOrderIdAndIsActiveTrue(
            Product product, Customer customer, String orderId);
    
    @Query("SELECT AVG(pf.rating) FROM ProductFeedback pf WHERE pf.product = :product AND pf.isActive = true")
    Double getAverageRatingByProduct(@Param("product") Product product);
    
    @Query("SELECT COUNT(pf) FROM ProductFeedback pf WHERE pf.product = :product AND pf.isActive = true")
    Long getTotalFeedbackCountByProduct(@Param("product") Product product);
    
    @Query("SELECT pf FROM ProductFeedback pf WHERE pf.product = :product AND pf.isActive = true ORDER BY pf.createdAt DESC")
    List<ProductFeedback> findByProductOrderByCreatedAtDesc(@Param("product") Product product);
    
    @Query("SELECT pf FROM ProductFeedback pf WHERE pf.isActive = true ORDER BY pf.createdAt DESC")
    List<ProductFeedback> findAllActiveOrderByCreatedAtDesc();
    
    boolean existsByProductAndCustomerAndOrderOrderIdAndIsActiveTrue(
            Product product, Customer customer, String orderId);
}
