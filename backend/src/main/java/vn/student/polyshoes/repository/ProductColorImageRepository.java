package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.student.polyshoes.model.ProductColorImage;

/**
 * Repository interface để tương tác với dữ liệu ProductColorImage trong database
 * Cung cấp các phương thức quản lý hình ảnh bổ sung của các màu sắc sản phẩm
 */
public interface ProductColorImageRepository extends JpaRepository<ProductColorImage, Integer> {
}