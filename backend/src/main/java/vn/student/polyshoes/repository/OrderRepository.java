package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.Order;

import java.util.List;

/**
 * Repository interface để tương tác với dữ liệu Order trong database
 * Cung cấp các phương thức tìm kiếm, thống kê và quản lý đơn hàng
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    // Lấy danh sách đơn hàng theo ngày cụ thể (năm, tháng, ngày)
    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month AND DAY(o.createdAt) = :day")
    List<Order> findOrdersByDate(int year, int month, int day);

    // Đếm số đơn hàng theo ngày cụ thể
    @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month AND DAY(o.createdAt) = :day")
    long countOrdersByDate(int year, int month, int day);

    // Lấy danh sách đơn hàng theo tháng
    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month")
    List<Order> findOrdersByMonth(int year, int month);

    // Đếm số đơn hàng theo tháng
    @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month")
    long countOrdersByMonth(int year, int month);

    // Lấy danh sách đơn hàng theo năm
    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year")
    List<Order> findOrdersByYear(int year);

    // Lấy danh sách đơn hàng theo ngày và giờ
    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month AND DAY(o.createdAt) = :day AND HOUR(o.createdAt) = :hour")
    List<Order> findOrdersByDateAndHour(@Param("year") int year, @Param("month") int month, @Param("day") int day, @Param("hour") int hour);

    // Đếm số đơn hàng theo năm
    @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.createdAt) = :year")
    long countOrdersByYear(int year);
    
    // Đếm số đơn hàng của một khách hàng
    long countByCustomerCustomerId(Integer customerId);
    
    // Lấy tất cả đơn hàng, sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllOrderByCreatedAtDesc();
    
    // Lấy đơn hàng của một khách hàng theo ID
    List<Order> findByCustomerCustomerId(Integer customerId);
    
    // Lấy đơn hàng của khách hàng với các chi tiết sản phẩm được load sẵn (eager fetch)
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.productSize ps LEFT JOIN FETCH ps.productColor pc LEFT JOIN FETCH pc.product WHERE o.customer.customerId = :customerId ORDER BY o.createdAt DESC")
    List<Order> findByCustomerCustomerIdWithItems(@Param("customerId") Integer customerId);
    
    // Kiểm tra khách hàng có đơn hàng nào hay không
    boolean existsByCustomer(Customer customer);
    
    // Get total purchased amount by customer
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.customer.customerId = :customerId")
    Double getTotalPurchasedByCustomer(@Param("customerId") Integer customerId);
    
    // Count orders by orderId prefix (for generating meaningful order codes)
    long countByOrderIdStartingWith(String prefix);

    // Find orders by date range
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate AND o.createdAt <= :endDate")
    List<Order> findOrdersByDateRange(@Param("startDate") java.util.Date startDate, @Param("endDate") java.util.Date endDate);
    
    // Find orders with voucher by customer ID
    @Query("SELECT o FROM Order o WHERE o.customer.customerId = :customerId AND o.voucher IS NOT NULL ORDER BY o.createdAt DESC")
    List<Order> findByCustomerIdAndVoucherIsNotNullOrderByCreatedAtDesc(@Param("customerId") Long customerId);
    
    // Find orders by voucher ID
    @Query("SELECT o FROM Order o WHERE o.voucher.voucherId = :voucherId ORDER BY o.createdAt DESC")
    List<Order> findByVoucherIdOrderByCreatedAtDesc(@Param("voucherId") Long voucherId);
    
    // Count orders by voucher
    @Query("SELECT COUNT(o) FROM Order o WHERE o.voucher.voucherId = :voucherId")
    long countByVoucherId(@Param("voucherId") Long voucherId);
    
    // Find orders by customer ID and voucher ID
    @Query("SELECT o FROM Order o WHERE o.customer.customerId = :customerId AND o.voucher.voucherId = :voucherId")
    List<Order> findByCustomerIdAndVoucherId(@Param("customerId") Long customerId, @Param("voucherId") Long voucherId);
    
    // Find order by orderId
    java.util.Optional<Order> findByOrderId(String orderId);
}
