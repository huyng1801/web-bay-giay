package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.student.polyshoes.model.ProductImage;
import vn.student.polyshoes.response.ProductImageResponse;
import vn.student.polyshoes.service.ProductImageService;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller để quản lý hình ảnh sản phẩm
 */
@RestController
@RequestMapping("/product-images")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    // Lấy tất cả hình ảnh sản phẩm
    @GetMapping
    public ResponseEntity<List<ProductImageResponse>> getAllProductImages() {
        List<ProductImageResponse> productImages = productImageService.getAllProductImagesResponse();
        return ResponseEntity.ok(productImages);
    }

    // Lấy hình ảnh sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductImage> getProductImageById(@PathVariable Integer id) {
        Optional<ProductImage> productImage = productImageService.getProductImageById(id);
        return productImage.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy tất cả hình ảnh theo product ID
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImageResponse>> getProductImagesByProductId(@PathVariable Integer productId) {
        List<ProductImageResponse> productImages = productImageService.getProductImagesResponseByProductId(productId);
        return ResponseEntity.ok(productImages);
    }

    // Tạo hình ảnh sản phẩm mới
    @PostMapping
    public ResponseEntity<?> createProductImage(
            @RequestParam Integer productId,
            @RequestParam String imageUrl) {
        try {
            ProductImage productImage = productImageService.createProductImage(productId, imageUrl);
            return ResponseEntity.ok(productImage);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Upload multiple images for product
    @PostMapping("/upload")
    public ResponseEntity<?> uploadProductImages(
            @RequestParam Integer productId,
            @RequestParam("imageFiles") MultipartFile[] imageFiles) {
        try {
            List<ProductImage> uploadedImages = productImageService.uploadMultipleImages(productId, imageFiles);
            // Convert to response DTOs
            List<ProductImageResponse> responseList = uploadedImages.stream()
                    .map(productImageService::mapToResponse)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(responseList);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Set main image
    @PutMapping("/{id}/set-main")
    public ResponseEntity<?> setMainImage(@PathVariable Integer id) {
        try {
            ProductImage mainImage = productImageService.setMainImage(id);
            ProductImageResponse response = productImageService.mapToResponse(mainImage);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cập nhật hình ảnh sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProductImage(@PathVariable Integer id, @RequestBody ProductImage productImage) {
        try {
            productImage.setProductImageId(id);
            ProductImage updated = productImageService.updateProductImage(productImage);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa hình ảnh sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductImage(@PathVariable Integer id) {
        try {
            productImageService.deleteProductImage(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Đếm số lượng hình ảnh của sản phẩm
    @GetMapping("/product/{productId}/count")
    public ResponseEntity<Long> countImagesByProductId(@PathVariable Integer productId) {
        Long count = productImageService.countImagesByProductId(productId);
        return ResponseEntity.ok(count);
    }

    // Xóa tất cả hình ảnh của một sản phẩm
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<?> deleteAllImagesByProductId(@PathVariable Integer productId) {
        try {
            productImageService.deleteAllImagesByProductId(productId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}