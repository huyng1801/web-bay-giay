package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.student.polyshoes.model.ProductDetails;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailsRepository extends JpaRepository<ProductDetails, Integer> {
    
    // Tìm tất cả chi tiết sản phẩm theo product ID
    @Query("SELECT pd FROM ProductDetails pd WHERE pd.product.productId = :productId AND pd.isActive = true")
    List<ProductDetails> findByProductIdAndIsActiveTrue(@Param("productId") Integer productId);
    
    // Tìm chi tiết sản phẩm theo product ID, color ID và size ID
    @Query("SELECT pd FROM ProductDetails pd WHERE pd.product.productId = :productId " +
           "AND pd.color.colorId = :colorId AND pd.size.sizeId = :sizeId AND pd.isActive = true")
    Optional<ProductDetails> findByProductIdAndColorIdAndSizeIdAndIsActiveTrue(
        @Param("productId") Integer productId, 
        @Param("colorId") Integer colorId, 
        @Param("sizeId") Integer sizeId);
    
    // Tìm tất cả chi tiết sản phẩm theo color ID
    @Query("SELECT pd FROM ProductDetails pd WHERE pd.color.colorId = :colorId AND pd.isActive = true")
    List<ProductDetails> findByColorIdAndIsActiveTrue(@Param("colorId") Integer colorId);
    
    // Tìm tất cả chi tiết sản phẩm theo size ID
    @Query("SELECT pd FROM ProductDetails pd WHERE pd.size.sizeId = :sizeId AND pd.isActive = true")
    List<ProductDetails> findBySizeIdAndIsActiveTrue(@Param("sizeId") Integer sizeId);
    
    // Kiểm tra tồn kho
    @Query("SELECT pd FROM ProductDetails pd WHERE pd.stockQuantity > 0 AND pd.isActive = true")
    List<ProductDetails> findInStock();
    
    // Tìm chi tiết sản phẩm có sẵn theo product ID
    @Query("SELECT pd FROM ProductDetails pd WHERE pd.product.productId = :productId " +
           "AND pd.stockQuantity > 0 AND pd.isActive = true")
    List<ProductDetails> findAvailableByProductId(@Param("productId") Integer productId);
}