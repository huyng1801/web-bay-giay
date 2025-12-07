package vn.student.polyshoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.ShippingType;

import java.sql.Timestamp;

@Entity
@Table(name = "shipping")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipping {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipping_id")
    private Integer shippingId;
    
    @Column(name = "shipping_code", nullable = false, unique = true, length = 50, columnDefinition = "NVARCHAR(50)")
    private String shippingCode;
    
    @Column(name = "shipping_name", nullable = false, length = 200, columnDefinition = "NVARCHAR(200)")
    private String shippingName;
    
    @Column(name = "shipping_fee", nullable = false)
    private Integer shippingFee;
    
    @Column(name = "delivery_time", nullable = false, length = 100, columnDefinition = "NVARCHAR(100)")
    private String deliveryTime; // Thời gian giao hàng (VD: "1-2 ngày", "3-5 ngày")
    
    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_type", nullable = false)
    private ShippingType shippingType = ShippingType.NORTHERN; // Mặc định miền Bắc
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Timestamp createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;
    
    @PrePersist
    protected void onCreate() {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        createdAt = now;
        updatedAt = now;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
