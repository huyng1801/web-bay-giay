package vn.student.polyshoes.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Guest;

/**
 * Repository interface để tương tác với dữ liệu Guest trong database
 * Cung cấp các phương thức quản lý khách hàng vãng lai (không đăng ký)
 */
@Repository
public interface GuestRepository extends JpaRepository<Guest, Integer> {
	Optional<Guest> findByEmail(String email);

	Optional<Guest> findByPhone(String phone);
}