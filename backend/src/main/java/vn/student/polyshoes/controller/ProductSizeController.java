package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.ProductSizeDto;
import vn.student.polyshoes.response.ProductSizeResponse;
import vn.student.polyshoes.service.ProductSizeService;
import vn.student.polyshoes.util.ValidationUtils;

import java.util.List;

@RestController
@RequestMapping("/product-sizes")
// Controller quản lý các API liên quan đến kích thước sản phẩm
public class ProductSizeController {

    // Inject service xử lý logic liên quan đến ProductSize
    @Autowired
    private ProductSizeService productSizeService;

    // Lấy danh sách tất cả các kích thước sản phẩm
    @GetMapping
    public ResponseEntity<List<ProductSizeResponse>> getAllProductSizes() {
        List<ProductSizeResponse> response = productSizeService.findAll();
        return ResponseEntity.ok(response);
    }

    // Tạo mới một kích thước sản phẩm
    // Kiểm tra dữ liệu đầu vào, trả về lỗi nếu không hợp lệ
    @PostMapping
    public ResponseEntity<?> createProductSize(@RequestBody @Valid ProductSizeDto productSizeDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        ProductSizeResponse productSize = productSizeService.createProductSize(productSizeDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productSize);
    }

    // Cập nhật thông tin kích thước sản phẩm theo id
    // Kiểm tra dữ liệu đầu vào, trả về lỗi nếu không hợp lệ
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProductSize(@PathVariable Integer id, @RequestBody @Valid ProductSizeDto productSizeDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        ProductSizeResponse updatedSize = productSizeService.updateProductSize(id, productSizeDto);
        return ResponseEntity.ok(updatedSize);
    }

    // Xóa kích thước sản phẩm theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductSize(@PathVariable Integer id) {
        productSizeService.deleteProductSize(id);
        return ResponseEntity.noContent().build();
    }

    // Tìm kích thước sản phẩm theo id
    @GetMapping("/{id}")
    public ResponseEntity<ProductSizeResponse> findProductSizeById(@PathVariable Integer id) {
        ProductSizeResponse response = productSizeService.findById(id);
        return ResponseEntity.ok(response);
    }

    // Lấy danh sách kích thước theo productColorId
    @GetMapping("/product-color/{productColorId}")
    public ResponseEntity<List<ProductSizeResponse>> findByProductColorId(@PathVariable Integer productColorId) {
        List<ProductSizeResponse> response = productSizeService.findByProductColorId(productColorId);
        return ResponseEntity.ok(response);
    }

    // Đổi trạng thái kích thước sản phẩm (active/inactive)
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleProductSizeStatus(@PathVariable Integer id) {
        ProductSizeResponse response = productSizeService.toggleProductSizeStatus(id);
        return ResponseEntity.ok(response);
    }

    // Cập nhật số lượng tồn kho cho kích thước sản phẩm
    @PutMapping("/{id}/stock")
    public ResponseEntity<?> updateProductSizeStock(@PathVariable Integer id, @RequestBody StockUpdateRequest request) {
        ProductSizeResponse response = productSizeService.updateStockQuantity(id, request.getStockQuantity());
        return ResponseEntity.ok(response);
    }

    // Lớp nội bộ dùng để nhận dữ liệu cập nhật số lượng tồn kho
    public static class StockUpdateRequest {
        private Integer stockQuantity;

        public Integer getStockQuantity() {
            return stockQuantity;
        }

        public void setStockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
        }
    }
}
