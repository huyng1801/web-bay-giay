package vn.student.polyshoes.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.enums.CustomerType;

/**
 * Repository interface để tương tác với dữ liệu Customer trong database
 * Cung cấp các phương thức tìm kiếm và quản lý khách hàng (cả đăng ký và vãng lai)
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    
    // Tìm khách hàng đã đăng ký theo email (chỉ khách đăng ký)
    @Query("SELECT c FROM Customer c WHERE c.email = :email AND c.customerType = 'REGISTERED'")
    Optional<Customer> findByEmailAndRegistered(@Param("email") String email);
    
    // Tìm khách hàng theo email (tất cả loại)
    Optional<Customer> findByEmail(String email);
    
    // Lấy tất cả khách hàng có cùng số điện thoại
    List<Customer> findAllByPhone(String phone);
    
    // Tìm một khách hàng theo số điện thoại
    Optional<Customer> findByPhone(String phone);
    
    // Tìm khách hàng theo loại
    List<Customer> findByCustomerType(CustomerType customerType);
    
    // Tìm khách hàng đăng ký theo email và password không null
    @Query("SELECT c FROM Customer c WHERE c.email = :email AND c.customerType = 'REGISTERED' AND c.hashPassword IS NOT NULL")
    Optional<Customer> findRegisteredCustomerByEmail(@Param("email") String email);
    
    // Tìm khách vãng lai theo email và phone
    @Query("SELECT c FROM Customer c WHERE c.email = :email AND c.phone = :phone AND c.customerType = 'GUEST'")
    List<Customer> findGuestCustomers(@Param("email") String email, @Param("phone") String phone);
    
    // Tìm hoặc tạo khách vãng lai
    @Query("SELECT c FROM Customer c WHERE c.fullName = :fullName AND c.email = :email AND c.phone = :phone AND c.customerType = 'GUEST'")
    Optional<Customer> findExistingGuestCustomer(@Param("fullName") String fullName, @Param("email") String email, @Param("phone") String phone);
    
    // Đếm số lượng khách hàng theo loại
    long countByCustomerType(CustomerType customerType);
    
    // Tìm khách hàng hoạt động theo loại
    @Query("SELECT c FROM Customer c WHERE c.customerType = :customerType AND c.isActive = true ORDER BY c.createdAt DESC")
    List<Customer> findActiveCustomersByType(@Param("customerType") CustomerType customerType);
}
