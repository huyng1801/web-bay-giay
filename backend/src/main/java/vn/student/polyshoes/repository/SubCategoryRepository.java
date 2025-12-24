package vn.student.polyshoes.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vn.student.polyshoes.enums.Gender;
import vn.student.polyshoes.model.SubCategory;

/**
 * Repository interface để tương tác với dữ liệu SubCategory trong database
 * Cung cấp các phương thức tìm kiếm và quản lý danh mục con sản phẩm
 */
@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Integer> {
    
    // Tìm danh mục con theo tên
    Optional<SubCategory> findBySubCategoryName(String subCategoryName);
    
    // Lấy tất cả danh mục con của một danh mục chính
    List<SubCategory> findByCategory_CategoryId(Integer categoryId);
    
    // Lấy tất cả danh mục con theo giới tính (MALE, FEMALE, UNISEX)
    List<SubCategory> findByGender(Gender gender);
    
    // Lấy danh mục con của một danh mục chính với giới tính cụ thể
    List<SubCategory> findByCategory_CategoryIdAndGender(Integer categoryId, Gender gender);
    
    // Đếm số danh mục con đang hoạt động của một danh mục chính
    long countByCategoryCategoryIdAndIsActiveTrue(Integer categoryId);
    
    // Vô hiệu hóa tất cả danh mục con của một danh mục chính
    @Modifying
    @Transactional
    @Query("UPDATE SubCategory sc SET sc.isActive = false WHERE sc.category.categoryId = :categoryId")
    void deactivateSubCategoriesByCategory(@Param("categoryId") Integer categoryId);
}
