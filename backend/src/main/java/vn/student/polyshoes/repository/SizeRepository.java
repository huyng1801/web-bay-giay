package vn.student.polyshoes.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Size;

import java.util.List;

@Repository
public interface SizeRepository extends JpaRepository<Size, Integer> {
    
    // Tìm tất cả size đang hoạt động (sắp xếp theo số)
    @Query("SELECT s FROM Size s WHERE s.isActive = true ORDER BY CAST(s.sizeValue AS int) ASC")
    List<Size> findByIsActiveTrueOrderBySizeValue();
    
    // Tìm size theo giá trị
    @Query("SELECT s FROM Size s WHERE s.sizeValue LIKE %:sizeValue% ORDER BY CAST(s.sizeValue AS int) ASC")
    List<Size> findBySizeValueContaining(@Param("sizeValue") String sizeValue);
    
    // Phân trang với tìm kiếm
    @Query("SELECT s FROM Size s WHERE " +
           "(:sizeValue IS NULL OR s.sizeValue LIKE %:sizeValue%) AND " +
           "(:isActive IS NULL OR s.isActive = :isActive) " +
           "ORDER BY CAST(s.sizeValue AS int) ASC")
    Page<Size> findWithFilters(@Param("sizeValue") String sizeValue,
                              @Param("isActive") Boolean isActive,
                              Pageable pageable);
    
    // Kiểm tra size đã tồn tại
    boolean existsBySizeValue(String sizeValue);
    
    // Kiểm tra size đã tồn tại (trừ ID hiện tại khi update)
    boolean existsBySizeValueAndSizeIdNot(String sizeValue, Integer sizeId);
}