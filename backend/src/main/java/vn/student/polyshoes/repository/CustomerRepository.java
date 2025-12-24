package vn.student.polyshoes.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Customer;

/**
 * Repository interface để tương tác với dữ liệu Customer trong database
 * Cung cấp các phương thức tìm kiếm và quản lý khách hàng đã đăng ký
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    
    // Tìm khách hàng theo email đăng nhập
    Optional<Customer> findByEmail(String email);
    
    // Lấy tất cả khách hàng có cùng số điện thoại
    List<Customer> findAllByPhone(String phone);
    
    // Tìm một khách hàng theo số điện thoại
    Optional<Customer> findByPhone(String phone);
}
