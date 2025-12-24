package vn.student.polyshoes.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.student.polyshoes.model.Product;

/**
 * Repository interface để tương tác với dữ liệu Product trong database
 * Cung cấp các phương thức tìm kiếm, lọc và quản lý sản phẩm
 */
@Repository  
public interface ProductRepository extends JpaRepository<Product, Integer>{
     
     // Tìm sản phẩm theo tên
     Optional<Product> findByProductName(String productName);
     
     // Đếm số sản phẩm đang hoạt động của một thương hiệu
     long countByBrandBrandIdAndIsActiveTrue(Integer brandId);
     
     // Đếm số sản phẩm đang hoạt động của một danh mục con
     long countBySubCategorySubCategoryIdAndIsActiveTrue(Integer subCategoryId);
     
     // Vô hiệu hóa tất cả sản phẩm của một thương hiệu
     @Modifying
     @Transactional
     @Query("UPDATE Product p SET p.isActive = false WHERE p.brand.brandId = :brandId")
     void deactivateProductsByBrand(@Param("brandId") Integer brandId);
     
     // Vô hiệu hóa tất cả sản phẩm của một danh mục con
     @Modifying
     @Transactional
     @Query("UPDATE Product p SET p.isActive = false WHERE p.subCategory.subCategoryId = :subCategoryId")
     void deactivateProductsBySubCategory(@Param("subCategoryId") Integer subCategoryId);
}
