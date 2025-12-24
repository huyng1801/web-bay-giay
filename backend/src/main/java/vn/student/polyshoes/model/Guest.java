package vn.student.polyshoes.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

/**
 * Entity class đại diện cho Khách vãng lai (không đăng ký)
 * Chứa thông tin cá nhân của khách hàng khi mua hàng mà không đăng ký tài khoản
 */
@Entity
@Table(name = "guest")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guest {

    // ID duy nhất của khách vãng lai, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guest_id")
    private Integer guestId;

    // Họ và tên đầy đủ của khách
    @Column(name = "full_name", length = 50, columnDefinition = "NVARCHAR(50)")
    private String fullName;

    // Email liên lạc (có thể để trống)
    @Column(name = "email", length = 255, columnDefinition = "NVARCHAR(255)")
    private String email;

    // Số điện thoại liên lạc
    @Column(name = "phone", length = 15, columnDefinition = "NVARCHAR(15)")
    private String phone;

    // Địa chỉ giao hàng
    @Column(name = "address", length = 255, columnDefinition = "NVARCHAR(255)")
    private String address;

    // Địa chỉ thứ hai (nếu có)
    @Column(name = "address2", length = 255, columnDefinition = "NVARCHAR(255)")
    private String address2;

    // Thành phố/Tỉnh
    @Column(name = "city", length = 50, columnDefinition = "NVARCHAR(50)")
    private String city;

    // Thời gian tạo bản ghi khách vãng lai
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Danh sách các đơn hàng của khách vãng lai
    @OneToMany(mappedBy = "guest", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Order> orders;
}
