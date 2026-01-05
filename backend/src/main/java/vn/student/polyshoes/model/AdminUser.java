package vn.student.polyshoes.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.Role;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;

/**
 * Entity class đại diện cho người dùng quản trị (Admin/Nhân viên)
 * Chứa thông tin xác thực và chi tiết cá nhân của admin
 * Implements UserDetails để sử dụng với Spring Security
 */
@Entity
@Table(name = "quan_tri_vien")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUser implements UserDetails {

    // ID duy nhất của admin user, dùng UUID
    @Id
    @Column(name = "ma_quan_tri_vien", length = 36)
    private String adminUserId;

    // Email đăng nhập, phải duy nhất trong hệ thống
    @Column(name = "email", nullable = false, length = 256, unique = true, columnDefinition = "NVARCHAR(256)")
    private String email;

    // Họ và tên đầy đủ của admin
    @Column(name = "ho_ten", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String fullName;

    // Mật khẩu đã được mã hóa (hash)
    @Column(name = "mat_khau_ma_hoa", nullable = false, length = 128, columnDefinition = "NVARCHAR(128)")
    private String hashPassword;

    // Số điện thoại liên lạc
    @Column(name = "so_dien_thoai", nullable = false, length = 15, columnDefinition = "NVARCHAR(15)")
    private String phone;

    // Địa chỉ
    @Column(name = "dia_chi", length = 500, columnDefinition = "NVARCHAR(500)")
    private String address;

    // Quyền hạn (ADMIN, EMPLOYEE, etc.) - Enum type
    @Enumerated(EnumType.STRING)
    @Column(name = "quyen_han", nullable = false)
    private Role role;

    // Trạng thái kích hoạt tài khoản (true = đang hoạt động, false = đã khóa)
    @Column(name = "trang_thai_kich_hoat", nullable = false)
    private Boolean isActive = true;

    // Thời gian tạo tài khoản
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "thoi_gian_tao", nullable = false)
    private Date createdAt;

    // Thời gian cập nhật lần cuối
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "thoi_gian_cap_nhat", nullable = false)
    private Date updatedAt;


    // Lấy tên đăng nhập (email)
    @Override
    public String getUsername() {
        return email;
    }

    // Lấy mật khẩu đã mã hóa
    @Override
    public String getPassword() {
        return hashPassword;
    }

    // Kiểm tra tài khoản chưa hết hạn
    @Override
    public boolean isAccountNonExpired() {
        return isActive;
    }

    // Kiểm tra tài khoản không bị khóa
    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    // Kiểm tra thông tin xác thực chưa hết hạn
    @Override
    public boolean isCredentialsNonExpired() {
        return isActive;
    }

    // Kiểm tra tài khoản đã được kích hoạt
    @Override
    public boolean isEnabled() {
        return isActive;
    }

    // Lấy danh sách các quyền của người dùng
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.name()));
    }
}
