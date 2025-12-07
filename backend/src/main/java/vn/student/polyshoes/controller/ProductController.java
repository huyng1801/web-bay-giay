package vn.student.polyshoes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.ProductDto;
import vn.student.polyshoes.enums.Gender;
import vn.student.polyshoes.response.ProductResponse;
import vn.student.polyshoes.service.ProductService;
import vn.student.polyshoes.util.ValidationUtils;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    
  // Get all products with optional filters: subCategoryId, gender, productName
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) Integer subCategoryId,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) String productName) {
        return ResponseEntity.ok(productService.getAllProducts(subCategoryId, gender, productName));
    }

    // Create a new product
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductDto productDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        ProductResponse productResponse = productService.createProduct(productDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productResponse);
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Integer productId) {
        ProductResponse productResponse = productService.getProductById(productId);
        if (productResponse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productResponse);
    }

    // Update a product
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable("id") Integer productId, @Valid @RequestBody ProductDto productDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        ProductResponse productResponse = productService.updateProduct(productId, productDto);
        if (productResponse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productResponse);
    }

    // Delete a product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Integer productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleProductStatus(@PathVariable("id") Integer productId) {
        try {
            var product = productService.toggleProductStatus(productId);
            var response = new vn.student.polyshoes.response.ToggleStatusResponse(product.getProductId(), product.getIsActive());
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // AI-enhanced search endpoint with GET parameters
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Integer subCategoryId,
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false, defaultValue = "false") Boolean aiEnhanced) {
        
        List<ProductResponse> results = productService.searchProducts(
            query, subCategoryId, brandId, minPrice, maxPrice, isActive, aiEnhanced);
        return ResponseEntity.ok(results);
    }
}
