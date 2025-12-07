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

@Entity
@Table(name = "admin_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUser implements UserDetails {

    @Id
    @Column(name = "admin_user_id", length = 36)
    private String adminUserId;

    @Column(name = "email", nullable = false, length = 256, unique = true, columnDefinition = "NVARCHAR(256)")
    private String email;

    @Column(name = "full_name", nullable = false, length = 50, columnDefinition = "NVARCHAR(50)")
    private String fullName;

    @Column(name = "hash_password", nullable = false, length = 128, columnDefinition = "NVARCHAR(128)")
    private String hashPassword;

    @Column(name = "phone", nullable = false, length = 15, columnDefinition = "NVARCHAR(15)")
    private String phone;

    @Column(name = "address", length = 500, columnDefinition = "NVARCHAR(500)")
    private String address;

    @Column(name = "address2", length = 500, columnDefinition = "NVARCHAR(500)")
    private String address2;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at", nullable = false)
    private Date updatedAt;

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
        return isActive;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return isActive;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.name()));
    }
}
