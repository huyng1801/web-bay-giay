package vn.student.polyshoes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.ProductSize;

@Repository  
public interface ProductSizeRepository extends JpaRepository<ProductSize, Integer>{
    List<ProductSize> findByProductColor_ProductColorId(Integer productColorId);
    List<ProductSize> findByProductColor_Product_ProductId(Integer productId);
}
