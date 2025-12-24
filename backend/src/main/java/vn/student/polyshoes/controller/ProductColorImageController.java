// Controller quản lý các chức năng liên quan đến hình ảnh màu sắc sản phẩm
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.dto.ProductColorImageDto;
import vn.student.polyshoes.response.ProductColorImageResponse;
import vn.student.polyshoes.service.ProductColorImageService;

import java.util.List;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến hình ảnh màu sắc sản phẩm
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/product-color-images")
public class ProductColorImageController {

    // Inject ProductColorImageService để xử lý logic liên quan đến hình ảnh màu sắc sản phẩm
    @Autowired
    private ProductColorImageService productColorImageService;

    // Lấy danh sách hình ảnh theo id màu sắc sản phẩm
    @GetMapping("/color/{productColorId}")
    public ResponseEntity<List<ProductColorImageResponse>> getImagesByProductColorId(@PathVariable Integer productColorId) {
        return ResponseEntity.ok(productColorImageService.findByProductColorId(productColorId));
    }

    // Tạo mới hình ảnh màu sắc sản phẩm
    @PostMapping
    public ResponseEntity<List<ProductColorImageResponse>> createProductColorImages(@ModelAttribute ProductColorImageDto productColorImageDto) {
        try {
            List<ProductColorImageResponse> createdImages = productColorImageService.createProductColorImages(productColorImageDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdImages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Cập nhật hình ảnh màu sắc sản phẩm theo id
    @PutMapping("/{imageId}")
    public ResponseEntity<ProductColorImageResponse> updateProductColorImage(@PathVariable Integer imageId,
                                                                     @ModelAttribute ProductColorImageDto productColorImageDto) {
        try {
            ProductColorImageResponse updatedImage = productColorImageService.updateProductColorImage(imageId, productColorImageDto);
            return ResponseEntity.ok(updatedImage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Xóa hình ảnh màu sắc sản phẩm theo id
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteProductColorImage(@PathVariable Integer imageId) {
        try {
            productColorImageService.deleteProductColorImage(imageId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
