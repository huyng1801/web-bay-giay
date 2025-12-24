package vn.student.polyshoes.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Size;

import java.util.List;

/**
 * Repository interface để tương tác với dữ liệu Size trong database
 * Cung cấp các phương thức tìm kiếm, lọc và quản lý kích cỡ chung trong hệ thống
 */
@Repository
public interface SizeRepository extends JpaRepository<Size, Integer> {
    
    // Lấy tất cả kích cỡ đang hoạt động, sắp xếp theo giá trị số tăng dần
    @Query("SELECT s FROM Size s WHERE s.isActive = true ORDER BY CAST(s.sizeValue AS int) ASC")
    List<Size> findByIsActiveTrueOrderBySizeValue();
    
    // Tìm kiếm kích cỡ theo giá trị (không phân biệt chính xác)
    @Query("SELECT s FROM Size s WHERE s.sizeValue LIKE %:sizeValue% ORDER BY CAST(s.sizeValue AS int) ASC")
    List<Size> findBySizeValueContaining(@Param("sizeValue") String sizeValue);
    
    // Lấy danh sách kích cỡ với các bộ lọc và phân trang
    @Query("SELECT s FROM Size s WHERE " +
           "(:sizeValue IS NULL OR s.sizeValue LIKE %:sizeValue%) AND " +
           "(:isActive IS NULL OR s.isActive = :isActive) " +
           "ORDER BY CAST(s.sizeValue AS int) ASC")
    Page<Size> findWithFilters(@Param("sizeValue") String sizeValue,
                              @Param("isActive") Boolean isActive,
                              Pageable pageable);
    
    // Kiểm tra giá trị kích cỡ đã tồn tại hay chưa
    boolean existsBySizeValue(String sizeValue);
    
    // Kiểm tra giá trị kích cỡ đã tồn tại (trừ ID hiện tại khi update)
    boolean existsBySizeValueAndSizeIdNot(String sizeValue, Integer sizeId);
}