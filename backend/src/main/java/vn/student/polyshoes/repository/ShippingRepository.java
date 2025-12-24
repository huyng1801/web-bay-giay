package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.enums.ShippingType;
import vn.student.polyshoes.model.Shipping;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface để tương tác với dữ liệu Shipping trong database
 * Cung cấp các phương thức tìm kiếm và quản lý phương thức vận chuyển/giao hàng
 */
@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Integer> {
    
    // Lấy tất cả phương thức vận chuyển đang hoạt động
    List<Shipping> findByIsActiveTrue();
    
    // Tìm phương thức vận chuyển theo mã code
    Optional<Shipping> findByShippingCode(String shippingCode);
    
    // Lấy phương thức vận chuyển theo loại (NORTHERN, CENTRAL, SOUTHERN, etc.)
    List<Shipping> findByShippingTypeAndIsActiveTrue(ShippingType shippingType);
    
    // Tìm phương thức vận chuyển theo tên (không phân biệt chính xác)
    @Query("SELECT s FROM Shipping s WHERE s.shippingName LIKE %:name% AND s.isActive = true")
    List<Shipping> findByShippingNameContainingAndIsActiveTrue(@Param("name") String name);
}
