package vn.student.polyshoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.ShippingType;

import java.sql.Timestamp;

/**
 * Entity class đại diện cho Phương thức vận chuyển/Giao hàng
 * Chứa thông tin chi phí giao hàng, thời gian giao hàng và loại vận chuyển
 */
@Entity
@Table(name = "shipping")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipping {
    
    // ID duy nhất của phương thức vận chuyển, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipping_id")
    private Integer shippingId;
    
    // Mã code duy nhất của phương thức vận chuyển
    @Column(name = "shipping_code", nullable = false, unique = true, length = 50, columnDefinition = "NVARCHAR(50)")
    private String shippingCode;
    
    // Tên phương thức vận chuyển (vd: "Giao hàng nhanh", "Giao hàng tiêu chuẩn")
    @Column(name = "shipping_name", nullable = false, length = 200, columnDefinition = "NVARCHAR(200)")
    private String shippingName;
    
    // Chi phí giao hàng (tính bằng đơn vị tiền tệ)
    @Column(name = "shipping_fee", nullable = false)
    private Integer shippingFee;
    
    // Thời gian giao hàng ước tính (vd: "1-2 ngày", "3-5 ngày")
    @Column(name = "delivery_time", nullable = false, length = 100, columnDefinition = "NVARCHAR(100)")
    private String deliveryTime;
    
    // Loại vận chuyển (NORTHERN, CENTRAL, SOUTHERN, etc.)
    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_type", nullable = false)
    private ShippingType shippingType = ShippingType.NORTHERN;
    
    // Trạng thái kích hoạt phương thức vận chuyển
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Thời gian tạo phương thức vận chuyển (không thay đổi sau khi tạo)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;
    
    // Thời gian cập nhật lần cuối
    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;
    
    // Tự động gán thời gian tạo khi insert
    @PrePersist
    protected void onCreate() {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        createdAt = now;
        updatedAt = now;
    }
    
    // Tự động cập nhật thời gian khi update
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
