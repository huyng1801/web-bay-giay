package vn.student.polyshoes.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.AdminUser;

/**
 * Repository interface để tương tác với dữ liệu AdminUser trong database
 * Cung cấp các phương thức tìm kiếm và quản lý người dùng quản trị
 */
@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, String> {
    
    // Tìm admin user theo email đăng nhập
    Optional<AdminUser> findByEmail(String email);
}
