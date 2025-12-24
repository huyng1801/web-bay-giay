package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.ProductColor;

import java.util.List;

/**
 * Repository interface để tương tác với dữ liệu ProductColor trong database
 * Cung cấp các phương thức tìm kiếm và quản lý màu sắc cụ thể của sản phẩm
 */
@Repository  
public interface ProductColorRepository extends JpaRepository<ProductColor, Integer> {
    
    // Lấy tất cả màu sắc của một sản phẩm dựa trên ID sản phẩm
    List<ProductColor> findByProduct_ProductId(Integer productId);
}
