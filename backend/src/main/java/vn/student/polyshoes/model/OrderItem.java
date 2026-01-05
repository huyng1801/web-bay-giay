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
@Table(name = "chi_tiet_don_hang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    
    // ID duy nhất của chi tiết đơn hàng, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_chi_tiet_don_hang")
    private Integer orderItemId;
    
    // Số lượng sản phẩm đặt hàng
    @Column(name = "so_luong", nullable = false)
    private Integer quantity;
    
    // Giá đơn vị (giá của một sản phẩm)
    @Column(name = "don_gia", nullable = false)
    private long unitPrice;
    
    // Tham chiếu tới đơn hàng cha (cascade delete: xóa OrderItem khi xóa Order)
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "ma_don_hang", nullable = false)
    private Order order;
   
    // Tham chiếu tới chi tiết sản phẩm (màu sắc và kích cỡ cụ thể)
    @ManyToOne
    @JoinColumn(name = "ma_chi_tiet_san_pham", nullable = false)
    private ProductDetails productDetails;
}
