package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.student.polyshoes.model.ProductImage;

import java.util.List;

/**
 * Repository interface để tương tác với dữ liệu ProductImage trong database
 * Cung cấp các phương thức quản lý hình ảnh của sản phẩm
 */
@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    
    // Tìm tất cả hình ảnh theo product ID
    @Query("SELECT pi FROM ProductImage pi WHERE pi.product.productId = :productId")
    List<ProductImage> findByProductId(@Param("productId") Integer productId);
    
    // Đếm số lượng hình ảnh của một sản phẩm
    @Query("SELECT COUNT(pi) FROM ProductImage pi WHERE pi.product.productId = :productId")
    Long countByProductId(@Param("productId") Integer productId);
}