package vn.student.polyshoes.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity class đại diện cho Chi tiết sản phẩm trong một đơn hàng
 * Mỗi OrderItem chứa thông tin về một sản phẩm cụ thể trong đơn hàng
 */
@Entity
@Table(name = "order_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    
    // ID duy nhất của chi tiết đơn hàng, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer orderItemId;
    
    // Số lượng sản phẩm đặt hàng
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    // Giá đơn vị (giá của một sản phẩm)
    @Column(name = "unit_price", nullable = false)
    private long unitPrice;
    
    // Tham chiếu tới đơn hàng cha (cascade delete: xóa OrderItem khi xóa Order)
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
   
    // Tham chiếu tới size và màu sắc cụ thể của sản phẩm
    @ManyToOne
    @JoinColumn(name = "product_size_id", nullable = false)
    private ProductSize productSize;
}
