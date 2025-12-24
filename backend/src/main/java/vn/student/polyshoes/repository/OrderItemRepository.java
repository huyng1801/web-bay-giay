package vn.student.polyshoes.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.OrderItem;

/**
 * Repository interface để tương tác với dữ liệu OrderItem trong database
 * Cung cấp các phương thức tìm kiếm chi tiết sản phẩm trong đơn hàng
 */
@Repository  
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    // Lấy tất cả chi tiết sản phẩm của một đơn hàng
    List<OrderItem> findByOrder(Order order);

    // Lấy danh sách sản phẩm bán chạy nhất (sắp xếp theo số lượng bán giảm dần)
    @Query("SELECT oi.productSize.productColor.product.productName, SUM(oi.quantity) " +
           "FROM OrderItem oi " +
           "JOIN oi.productSize ps " +
           "JOIN ps.productColor pc " +
           "JOIN pc.product p " +
           "GROUP BY p.productName " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findBestSellingProducts();

}
