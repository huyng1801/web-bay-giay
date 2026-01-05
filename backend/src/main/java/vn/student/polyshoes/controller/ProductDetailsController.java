package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.student.polyshoes.model.ProductDetails;
import vn.student.polyshoes.service.ProductDetailsService;
import vn.student.polyshoes.response.ProductDetailsResponse;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller để quản lý chi tiết sản phẩm (màu sắc và kích cỡ)
 */
@RestController
@RequestMapping("/product-details")
public class ProductDetailsController {

    @Autowired
    private ProductDetailsService productDetailsService;

    // Lấy tất cả chi tiết sản phẩm
    @GetMapping
    public ResponseEntity<List<ProductDetailsResponse>> getAllProductDetails() {
        List<ProductDetailsResponse> productDetails = productDetailsService.getAllProductDetailsResponse();
        return ResponseEntity.ok(productDetails);
    }

    // Lấy chi tiết sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailsResponse> getProductDetailsById(@PathVariable Integer id) {
        Optional<ProductDetails> productDetails = productDetailsService.getProductDetailsById(id);
        return productDetails.map(pd -> ResponseEntity.ok(productDetailsService.mapToResponse(pd)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy chi tiết sản phẩm theo product ID
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductDetailsResponse>> getProductDetailsByProductId(@PathVariable Integer productId) {
        List<ProductDetailsResponse> productDetails = productDetailsService.getProductDetailsResponseByProductId(productId);
        return ResponseEntity.ok(productDetails);
    }

    // Lấy chi tiết sản phẩm có sẵn theo product ID
    @GetMapping("/product/{productId}/available")
    public ResponseEntity<List<ProductDetailsResponse>> getAvailableProductDetailsByProductId(@PathVariable Integer productId) {
        List<ProductDetails> productDetails = productDetailsService.getAvailableProductDetailsByProductId(productId);
        List<ProductDetailsResponse> response = productDetails.stream()
                .map(productDetailsService::mapToResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    // Tạo chi tiết sản phẩm mới
    @PostMapping
    public ResponseEntity<?> createProductDetails(
            @RequestParam Integer productId,
            @RequestParam Integer colorId,
            @RequestParam Integer sizeId,
            @RequestParam Integer stockQuantity) {
        try {
            ProductDetails productDetails = productDetailsService.createProductDetails(productId, colorId, sizeId, stockQuantity);
            return ResponseEntity.ok(productDetails);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật chi tiết sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProductDetails(@PathVariable Integer id, @RequestBody ProductDetails productDetails) {
        try {
            productDetails.setProductDetailsId(id);
            ProductDetails updated = productDetailsService.updateProductDetails(productDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật số lượng tồn kho
    @PutMapping("/{id}/stock")
    public ResponseEntity<?> updateStockQuantity(@PathVariable Integer id, @RequestParam Integer stockQuantity) {
        try {
            ProductDetails updated = productDetailsService.updateStockQuantity(id, stockQuantity);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa chi tiết sản phẩm (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductDetails(@PathVariable Integer id) {
        try {
            productDetailsService.deleteProductDetails(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Kiểm tra tồn kho
    @GetMapping("/{id}/in-stock")
    public ResponseEntity<Boolean> isInStock(@PathVariable Integer id) {
        boolean inStock = productDetailsService.isInStock(id);
        return ResponseEntity.ok(inStock);
    }

    // Lấy chi tiết sản phẩm có hàng tồn kho
    @GetMapping("/in-stock")
    public ResponseEntity<List<ProductDetails>> getInStockProductDetails() {
        List<ProductDetails> productDetails = productDetailsService.getInStockProductDetails();
        return ResponseEntity.ok(productDetails);
    }
}