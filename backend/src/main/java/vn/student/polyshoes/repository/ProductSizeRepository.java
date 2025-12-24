package vn.student.polyshoes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.ProductSize;

/**
 * Repository interface để tương tác với dữ liệu ProductSize trong database
 * Cung cấp các phương thức tìm kiếm kích cỡ sản phẩm với tồn kho
 */
@Repository  
public interface ProductSizeRepository extends JpaRepository<ProductSize, Integer>{
    
    // Lấy tất cả kích cỡ của một product-color combination
    List<ProductSize> findByProductColor_ProductColorId(Integer productColorId);
    
    // Lấy tất cả kích cỡ của một sản phẩm (bất kỳ màu sắc)
    List<ProductSize> findByProductColor_Product_ProductId(Integer productId);
}
