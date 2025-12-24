package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.student.polyshoes.model.Category;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface để tương tác với dữ liệu Category trong database
 * Cung cấp các phương thức tìm kiếm và quản lý danh mục sản phẩm chính
 */
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
    // Kiểm tra tên danh mục đã tồn tại hay chưa
    boolean existsByCategoryName(String categoryName);

    // Kiểm tra tên danh mục đã tồn tại (trừ ID hiện tại khi update)
    boolean existsByCategoryNameAndCategoryIdNot(String categoryName, Integer categoryId);

    // Tìm danh mục theo tên
    Optional<Category> findByCategoryName(String categoryName);
    
    // Lấy tất cả danh mục đang hoạt động
    List<Category> findByIsActiveTrue();
}
