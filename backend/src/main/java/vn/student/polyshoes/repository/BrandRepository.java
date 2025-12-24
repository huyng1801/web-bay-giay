package vn.student.polyshoes.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Brand;

/**
 * Repository interface để tương tác với dữ liệu Brand trong database
 * Cung cấp các phương thức tìm kiếm và quản lý thương hiệu sản phẩm
 */
@Repository  
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    
    // Tìm thương hiệu theo tên
    Optional<Brand> findByBrandName(String brandName);
}
