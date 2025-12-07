package vn.student.polyshoes.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Color;

import java.util.List;

@Repository
public interface ColorRepository extends JpaRepository<Color, Integer> {
    
    // Tìm tất cả màu sắc đang hoạt động
    List<Color> findByIsActiveTrueOrderByColorNameAsc();
    
    // Tìm màu sắc theo tên
    @Query("SELECT c FROM Color c WHERE c.colorName LIKE %:colorName% ORDER BY c.colorName ASC")
    List<Color> findByColorNameContaining(@Param("colorName") String colorName);
    
    // Phân trang với tìm kiếm
    @Query("SELECT c FROM Color c WHERE " +
           "(:colorName IS NULL OR c.colorName LIKE %:colorName%) AND " +
           "(:isActive IS NULL OR c.isActive = :isActive)")
    Page<Color> findWithFilters(@Param("colorName") String colorName,
                               @Param("isActive") Boolean isActive,
                               Pageable pageable);
    
    // Kiểm tra tên màu đã tồn tại
    boolean existsByColorNameIgnoreCase(String colorName);
    
    // Kiểm tra tên màu đã tồn tại (trừ ID hiện tại khi update)
    boolean existsByColorNameIgnoreCaseAndColorIdNot(String colorName, Integer colorId);
}