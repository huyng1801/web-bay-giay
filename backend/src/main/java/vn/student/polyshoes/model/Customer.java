package vn.student.polyshoes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.CustomerType;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Entity class đại diện cho Khách hàng (gộp cả khách đăng ký và khách vãng lai)
 * Chứa thông tin xác thực và chi tiết cá nhân của khách hàng
 * Implements UserDetails để sử dụng với Spring Security
 */
@Entity
@Table(name = "khach_hang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer implements UserDetails {

    // ID duy nhất của khách hàng, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_khach_hang")
    private Integer customerId;
    
    // Họ và tên đầy đủ của khách hàng
    @Column(name = "ho_ten", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String fullName;

    // Email (có thể trùng đối với khách vãng lai)
    @Column(name = "email", length = 200, columnDefinition = "NVARCHAR(255)")
    private String email;

    // Số điện thoại (có thể trùng đối với khách vãng lai)
    @Column(name = "so_dien_thoai", length = 15, columnDefinition = "NVARCHAR(15)")
    private String phone;

    // Mật khẩu đã được mã hóa (null cho khách vãng lai)
    @Column(name = "mat_khau_ma_hoa", length = 255, columnDefinition = "NVARCHAR(255)")
    private String hashPassword;

    // Loại khách hàng: REGISTERED hoặc GUEST
    @Enumerated(EnumType.STRING)
    @Column(name = "loai_khach_hang", nullable = false)
    private CustomerType customerType;

    // Trạng thái xác thực email (chỉ áp dụng cho khách đăng ký)
    @Column(name = "xac_thuc_email")
    private Boolean emailConfirmed = false;

    // Ngày sinh
    @Column(name = "ngay_sinh")
    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    // Giới tính
    @Column(name = "gioi_tinh", length = 10, columnDefinition = "NVARCHAR(10)")
    private String gender;
    
    // Trạng thái kích hoạt tài khoản
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;
    
    // Thời gian tạo tài khoản
    @Column(name = "thoi_gian_tao", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    // Danh sách địa chỉ của khách hàng
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CustomerAddress> addresses;

    // Danh sách các đơn hàng của khách hàng
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Order> orders;

    // Constructor cho khách đăng ký
    public Customer(String fullName, String email, String phone, String hashPassword) {
        this();
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.hashPassword = hashPassword;
        this.customerType = CustomerType.REGISTERED;
        this.emailConfirmed = false;
    }

    // Constructor cho khách vãng lai
    public Customer(String fullName, String email, String phone) {
        this();
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.hashPassword = null; // Khách vãng lai không có mật khẩu
        this.customerType = CustomerType.GUEST;
        this.emailConfirmed = null; // Không áp dụng cho khách vãng lai
    }

    // Utility methods
    public boolean isRegistered() {
        return customerType == CustomerType.REGISTERED;
    }

    public boolean isGuest() {
        return customerType == CustomerType.GUEST;
    }

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

    // Spring Security UserDetails implementation
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return hashPassword;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Chỉ khách đăng ký mới có thể đăng nhập
        return isActive != null && isActive && isRegistered() && hashPassword != null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("CUSTOMER"));
    }
}
