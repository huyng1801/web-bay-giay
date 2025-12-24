package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.OrderStatusHistory;

import java.util.List;

/**
 * Repository interface để tương tác với dữ liệu OrderStatusHistory trong database
 * Cung cấp các phương thức quản lý lịch sử thay đổi trạng thái đơn hàng
 */
@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Integer> {

    // Lấy lịch sử trạng thái của một đơn hàng, sắp xếp theo thời gian mới nhất trước
    List<OrderStatusHistory> findByOrderOrderByChangedAtDesc(Order order);

    // Lấy lịch sử trạng thái theo ID đơn hàng, sắp xếp theo thời gian mới nhất trước
    @Query("SELECT h FROM OrderStatusHistory h WHERE h.order.orderId = :orderId ORDER BY h.changedAt DESC")
    List<OrderStatusHistory> findByOrderIdOrderByChangedAtDesc(@Param("orderId") String orderId);

    // Lấy trạng thái thay đổi cuối cùng của đơn hàng
    @Query("SELECT h FROM OrderStatusHistory h WHERE h.order.orderId = :orderId ORDER BY h.changedAt DESC LIMIT 1")
    OrderStatusHistory findLatestByOrderId(@Param("orderId") String orderId);

    // Đếm tổng số lần thay đổi trạng thái của một đơn hàng
    long countByOrder(Order order);
}
