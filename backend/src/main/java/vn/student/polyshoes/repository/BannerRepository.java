package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Banner;

@Repository  
public interface BannerRepository extends JpaRepository<Banner, Integer> {
}
