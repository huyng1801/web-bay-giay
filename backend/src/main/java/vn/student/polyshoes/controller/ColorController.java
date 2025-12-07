package vn.student.polyshoes.controller;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.ColorDto;
import vn.student.polyshoes.response.ColorResponse;
import vn.student.polyshoes.service.ColorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/colors")
public class ColorController {
    
    @Autowired
    private ColorService colorService;
    
    // Lấy tất cả màu sắc
    @GetMapping
    public ResponseEntity<List<ColorResponse>> getAllColors() {
        List<ColorResponse> colors = colorService.getAllColors();
        return ResponseEntity.ok(colors);
    }
    
    // Lấy tất cả màu sắc đang hoạt động (cho dropdown)
    @GetMapping("/active")
    public ResponseEntity<List<ColorResponse>> getActiveColors() {
        List<ColorResponse> colors = colorService.getActiveColors();
        return ResponseEntity.ok(colors);
    }
    
    // Phân trang với tìm kiếm
    @GetMapping("/page")
    public ResponseEntity<Page<ColorResponse>> getColorsWithPagination(
            @RequestParam(required = false) String colorName,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ColorResponse> colorPage = colorService.getColorsWithFilters(colorName, isActive, pageable);
        return ResponseEntity.ok(colorPage);
    }
    
    // Lấy màu sắc theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ColorResponse> getColorById(@PathVariable Integer id) {
        return colorService.getColorById(id)
                .map(color -> ResponseEntity.ok(color))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Tạo màu sắc mới
    @PostMapping
    public ResponseEntity<?> createColor(@Valid @RequestBody ColorDto requestDTO) {
        try {
            ColorResponse createdColor = colorService.createColor(requestDTO);
            return ResponseEntity.ok(createdColor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Cập nhật màu sắc
    @PutMapping("/{id}")
    public ResponseEntity<?> updateColor(@PathVariable Integer id, 
                                        @Valid @RequestBody ColorDto requestDTO) {
        try {
            ColorResponse updatedColor = colorService.updateColor(id, requestDTO);
            return ResponseEntity.ok(updatedColor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Xóa màu sắc
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteColor(@PathVariable Integer id) {
        try {
            colorService.deleteColor(id);
            return ResponseEntity.ok("Xóa màu sắc thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}