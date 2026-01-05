package vn.student.polyshoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "dia_chi_khach_hang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_dia_chi")
    private Integer addressId;

    @Column(name = "dia_chi", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String address;

    @Column(name = "ma_tinh_thanh_ghn")
    private Integer ghnProvinceId; // GHN Province ID
    
    @Column(name = "ma_quan_huyen_ghn")
    private Integer ghnDistrictId; // GHN District ID
    
    @Column(name = "ma_phuong_xa_ghn", length = 20)
    private String ghnWardCode; // GHN Ward Code

    @Column(name = "mac_dinh", nullable = false)
    private Boolean isDefault = false;

    @Column(name = "loai_dia_chi", length = 20, columnDefinition = "NVARCHAR(20)")
    private String addressType; // HOME, OFFICE, OTHER

    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_khach_hang", nullable = false)
    private Customer customer;

    @PrePersist
    public void prePersist() {
        Date now = new Date();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = new Date();
    }
}