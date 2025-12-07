package vn.student.polyshoes.controller;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.SizeDto;
import vn.student.polyshoes.response.SizeResponse;
import vn.student.polyshoes.service.SizeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sizes")
public class SizeController {
    
    @Autowired
    private SizeService sizeService;
    
    // Lấy tất cả size
    @GetMapping
    public ResponseEntity<List<SizeResponse>> getAllSizes() {
        List<SizeResponse> sizes = sizeService.getAllSizes();
        return ResponseEntity.ok(sizes);
    }
    
    // Lấy tất cả size đang hoạt động (cho dropdown)
    @GetMapping("/active")
    public ResponseEntity<List<SizeResponse>> getActiveSizes() {
        List<SizeResponse> sizes = sizeService.getActiveSizes();
        return ResponseEntity.ok(sizes);
    }
    
    // Phân trang với tìm kiếm
    @GetMapping("/page")
    public ResponseEntity<Page<SizeResponse>> getSizesWithPagination(
            @RequestParam(required = false) String sizeValue,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SizeResponse> sizePage = sizeService.getSizesWithFilters(sizeValue, isActive, pageable);
        return ResponseEntity.ok(sizePage);
    }
    
    // Lấy size theo ID
    @GetMapping("/{id}")
    public ResponseEntity<SizeResponse> getSizeById(@PathVariable Integer id) {
        return sizeService.getSizeById(id)
                .map(size -> ResponseEntity.ok(size))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Tạo size mới
    @PostMapping
    public ResponseEntity<?> createSize(@Valid @RequestBody SizeDto requestDTO) {
        try {
            SizeResponse createdSize = sizeService.createSize(requestDTO);
            return ResponseEntity.ok(createdSize);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Cập nhật size
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSize(@PathVariable Integer id, 
                                       @Valid @RequestBody SizeDto requestDTO) {
        try {
            SizeResponse updatedSize = sizeService.updateSize(id, requestDTO);
            return ResponseEntity.ok(updatedSize);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Xóa size
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSize(@PathVariable Integer id) {
        try {
            sizeService.deleteSize(id);
            return ResponseEntity.ok("Xóa size thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}