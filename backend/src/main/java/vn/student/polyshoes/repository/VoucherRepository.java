package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Voucher;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface để tương tác với dữ liệu Voucher trong database
 * Cung cấp các phương thức tìm kiếm, kiểm tra và quản lý mã giảm giá/voucher
 */
@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    
    // Tìm voucher theo mã code duy nhất
    Optional<Voucher> findByCode(String code);
    
    // Lấy tất cả voucher, sắp xếp theo ID giảm dần (mới nhất trước)
    List<Voucher> findAllByOrderByVoucherIdDesc();
    
    // Kiểm tra khách hàng đã sử dụng voucher này chưa
    @Query("SELECT COUNT(o) > 0 FROM Order o " +
           "WHERE o.voucher.voucherId = :voucherId " +
           "AND o.customer.customerId = :customerId")
    boolean hasCustomerUsedVoucher(@Param("voucherId") Long voucherId, 
                                   @Param("customerId") Long customerId);
    
    // Đếm số lần khách hàng đã sử dụng voucher này
    @Query("SELECT COUNT(o) FROM Order o " +
           "WHERE o.voucher.voucherId = :voucherId " +
           "AND o.customer.customerId = :customerId")
    long countVoucherUsageByCustomer(@Param("voucherId") Long voucherId, 
                                     @Param("customerId") Long customerId);
    
    // Kiểm tra khách hàng đã sử dụng voucher này chưa (phương thức cũ - sử dụng Order entity)
    @Query("SELECT COUNT(o) > 0 FROM Order o " +
           "WHERE o.voucher.voucherId = :voucherId " +
           "AND o.customer.customerId = :customerId")
    boolean hasCustomerUsedVoucherOld(@Param("voucherId") Long voucherId, 
                                   @Param("customerId") Long customerId);
    
    // Đếm số lần khách hàng đã sử dụng voucher (phương thức cũ - sử dụng Order entity)
    @Query("SELECT COUNT(o) FROM Order o " +
           "WHERE o.voucher.voucherId = :voucherId " +
           "AND o.customer.customerId = :customerId")
    long countVoucherUsageByCustomerOld(@Param("voucherId") Long voucherId, 
                                     @Param("customerId") Long customerId);
    
    // Lấy danh sách voucher đã hết hạn
    @Query("SELECT v FROM Voucher v WHERE v.endDate < :currentDate")
    List<Voucher> findExpiredVouchers(@Param("currentDate") LocalDate currentDate);
    
    // Lấy danh sách voucher sắp hết hạn (trong khoảng ngày chỉ định)
    @Query("SELECT v FROM Voucher v WHERE v.endDate BETWEEN :currentDate AND :expiringSoon")
    List<Voucher> findExpiringSoonVouchers(@Param("currentDate") LocalDate currentDate,
                                          @Param("expiringSoon") LocalDate expiringSoon);
}
