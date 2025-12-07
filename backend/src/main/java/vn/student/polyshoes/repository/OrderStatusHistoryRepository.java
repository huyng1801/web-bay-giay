package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.OrderStatusHistory;

import java.util.List;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Integer> {

    // Lấy lịch sử trạng thái theo order, sắp xếp theo thời gian
    List<OrderStatusHistory> findByOrderOrderByChangedAtDesc(Order order);

    // Lấy lịch sử trạng thái theo orderId
    @Query("SELECT h FROM OrderStatusHistory h WHERE h.order.orderId = :orderId ORDER BY h.changedAt DESC")
    List<OrderStatusHistory> findByOrderIdOrderByChangedAtDesc(@Param("orderId") String orderId);

    // Lấy trạng thái cuối cùng của đơn hàng
    @Query("SELECT h FROM OrderStatusHistory h WHERE h.order.orderId = :orderId ORDER BY h.changedAt DESC LIMIT 1")
    OrderStatusHistory findLatestByOrderId(@Param("orderId") String orderId);

    // Đếm số lần thay đổi trạng thái của đơn hàng
    long countByOrder(Order order);
}
