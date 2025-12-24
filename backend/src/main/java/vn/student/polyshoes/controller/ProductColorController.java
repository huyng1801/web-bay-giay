// Controller quản lý các chức năng liên quan đến màu sắc của sản phẩm
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.ProductColorDto;
import vn.student.polyshoes.exception.FileUploadException;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.response.ProductColorResponse;
import vn.student.polyshoes.service.ProductColorService;
import vn.student.polyshoes.util.ValidationUtils;

import java.util.List;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến màu sắc sản phẩm
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/product-colors")
public class ProductColorController {

    // Inject ProductColorService để xử lý logic liên quan đến màu sắc sản phẩm
    @Autowired
    private ProductColorService productColorService;

    // Lấy danh sách tất cả màu sắc sản phẩm
    @GetMapping
    public ResponseEntity<List<ProductColorResponse>> getAllProductColors() {
        return ResponseEntity.ok(productColorService.findAll());
    }

    // Tạo mới màu sắc sản phẩm
    @PostMapping
    public ResponseEntity<?> createProductColor(@ModelAttribute @Valid ProductColorDto productColorDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        try {
            ProductColorResponse productColor = productColorService.createProductColor(productColorDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(productColor);
        } catch (FileUploadException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error uploading file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    // Cập nhật màu sắc sản phẩm theo id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProductColor(@PathVariable Integer id, @ModelAttribute @Valid ProductColorDto productColorDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        try {
            ProductColorResponse updatedColor = productColorService.updateProductColor(id, productColorDto);
            return ResponseEntity.ok(updatedColor);
        } catch (FileUploadException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error uploading file: " + e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product color not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    // Xóa màu sắc sản phẩm theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductColor(@PathVariable Integer id) {
        try {
            productColorService.deleteProductColor(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product color not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    // Lấy danh sách màu sắc theo id sản phẩm
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductColorResponse>> findByProductId(@PathVariable Integer productId) {
        return ResponseEntity.ok(productColorService.findByProduct_ProductId(productId));
    }

    // Lấy thông tin màu sắc sản phẩm theo id
    @GetMapping("/{id}")
    public ResponseEntity<ProductColorResponse> findProductColorById(@PathVariable Integer id) {
        ProductColorResponse response = productColorService.findById(id);
        return ResponseEntity.ok(response);
    }

    // Đổi trạng thái hoạt động của màu sắc sản phẩm (ẩn/hiện)
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleProductColorStatus(@PathVariable Integer id) {
        try {
            ProductColorResponse response = productColorService.toggleProductColorStatus(id);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("Product color not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }
}
