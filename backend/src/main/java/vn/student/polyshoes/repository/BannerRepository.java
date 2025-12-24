package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Banner;

/**
 * Repository interface để tương tác với dữ liệu Banner trong database
 * Cung cấp các phương thức quản lý banner quảng cáo trên website
 */
@Repository  
public interface BannerRepository extends JpaRepository<Banner, Integer> {
}
