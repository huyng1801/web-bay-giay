package vn.student.polyshoes.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Color;

import java.util.List;

/**
 * Repository interface để tương tác với dữ liệu Color trong database
 * Cung cấp các phương thức tìm kiếm, lọc và quản lý màu sắc sản phẩm
 */
@Repository
public interface ColorRepository extends JpaRepository<Color, Integer> {
    
    // Lấy tất cả màu sắc đang hoạt động, sắp xếp theo tên từ A-Z
    List<Color> findByIsActiveTrueOrderByColorNameAsc();
    
    // Tìm kiếm màu sắc theo tên (không phân biệt chính xác)
    @Query("SELECT c FROM Color c WHERE c.colorName LIKE %:colorName% ORDER BY c.colorName ASC")
    List<Color> findByColorNameContaining(@Param("colorName") String colorName);
    
    // Lấy danh sách màu sắc với các bộ lọc và phân trang
    @Query("SELECT c FROM Color c WHERE " +
           "(:colorName IS NULL OR c.colorName LIKE %:colorName%) AND " +
           "(:isActive IS NULL OR c.isActive = :isActive)")
    Page<Color> findWithFilters(@Param("colorName") String colorName,
                               @Param("isActive") Boolean isActive,
                               Pageable pageable);
    
    // Kiểm tra tên màu sắc đã tồn tại (không phân biệt in/hoa thường)
    boolean existsByColorNameIgnoreCase(String colorName);
    
    // Kiểm tra tên màu sắc đã tồn tại (trừ ID hiện tại khi update)
    boolean existsByColorNameIgnoreCaseAndColorIdNot(String colorName, Integer colorId);
}