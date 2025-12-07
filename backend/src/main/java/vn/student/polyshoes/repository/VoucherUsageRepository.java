package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.VoucherUsage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, Long> {
    
    // Lấy lịch sử sử dụng voucher của customer
    @Query("SELECT vu FROM VoucherUsage vu " +
           "WHERE vu.customer.customerId = :customerId " +
           "ORDER BY vu.usedAt DESC")
    List<VoucherUsage> findByCustomerIdOrderByUsedAtDesc(@Param("customerId") Long customerId);
    
    // Lấy lịch sử sử dụng của voucher
    @Query("SELECT vu FROM VoucherUsage vu " +
           "WHERE vu.voucher.voucherId = :voucherId " +
           "ORDER BY vu.usedAt DESC")
    List<VoucherUsage> findByVoucherIdOrderByUsedAtDesc(@Param("voucherId") Long voucherId);
    
    // Tổng số tiền đã giảm giá bởi một voucher
    @Query("SELECT SUM(vu.discountAmount) FROM VoucherUsage vu " +
           "WHERE vu.voucher.voucherId = :voucherId")
    Double getTotalDiscountByVoucher(@Param("voucherId") Long voucherId);
    
    // Thống kê sử dụng voucher trong khoảng thời gian
    @Query("SELECT vu FROM VoucherUsage vu " +
           "WHERE vu.usedAt BETWEEN :startDate AND :endDate " +
           "ORDER BY vu.usedAt DESC")
    List<VoucherUsage> findByUsedAtBetween(@Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
    
    // Kiểm tra xem customer đã sử dụng voucher này chưa
    @Query("SELECT COUNT(vu) > 0 FROM VoucherUsage vu " +
           "WHERE vu.voucher.voucherId = :voucherId AND vu.customer.customerId = :customerId")
    boolean existsByVoucherIdAndCustomerId(@Param("voucherId") Long voucherId, @Param("customerId") Long customerId);
    
    // Lấy voucher usage theo order ID
    @Query("SELECT vu FROM VoucherUsage vu " +
           "WHERE vu.order.orderId = :orderId")
    Optional<VoucherUsage> findByOrderId(@Param("orderId") String orderId);
}
