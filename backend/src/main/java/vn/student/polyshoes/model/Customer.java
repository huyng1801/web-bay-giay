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

import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Entity class đại diện cho Khách hàng đăng ký
 * Chứa thông tin xác thực và chi tiết cá nhân của khách hàng
 * Implements UserDetails để sử dụng với Spring Security
 */
@Entity
@Table(name = "customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer implements UserDetails{

    // ID duy nhất của khách hàng, tự động tăng
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;
    
    // Họ và tên đầy đủ của khách hàng
    @Column(name = "full_name", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String fullName;

    // Email đăng nhập, phải duy nhất
    @Column(name = "email", nullable = false, length = 200, columnDefinition = "NVARCHAR(255)")
    private String email;

    // Mật khẩu đã được mã hóa (hash)
    @Column(name = "hash_password", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String hashPassword;

    // Trạng thái xác thực email (true = đã xác thực, false = chưa xác thực)
    @Column(name = "email_confirmed", nullable = false)
    private Boolean emailConfirmed;

    // Số điện thoại liên lạc
    @Column(name = "phone", nullable = false, length = 15, columnDefinition = "NVARCHAR(15)")
    private String phone;

    // Địa chỉ chính
    @Column(name = "address", nullable = false, length = 255, columnDefinition = "NVARCHAR(255)")
    private String address;

    // Địa chỉ thứ hai (nếu có)
    @Column(name = "address2", length = 255, columnDefinition = "NVARCHAR(255)")
    private String address2;

    // Thành phố/Tỉnh
    @Column(name = "city", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String city;
    
    // Trạng thái kích hoạt tài khoản
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Thời gian tạo tài khoản
    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Column(name = "updated_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Danh sách các đơn hàng của khách hàng
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Order> orders;

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
        return isActive != null ? isActive : true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("CUSTOMER"));
    }
    
}
