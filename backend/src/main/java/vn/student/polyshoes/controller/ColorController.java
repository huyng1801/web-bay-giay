// Controller quản lý các chức năng liên quan đến màu sắc sản phẩm
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

// Đánh dấu đây là REST controller, xử lý các API liên quan đến màu sắc
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/colors")
public class ColorController {
    
    // Inject ColorService để xử lý logic liên quan đến màu sắc
    @Autowired
    private ColorService colorService;
    
    // Lấy danh sách tất cả màu sắc
    @GetMapping
    public ResponseEntity<List<ColorResponse>> getAllColors() {
        List<ColorResponse> colors = colorService.getAllColors();
        return ResponseEntity.ok(colors);
    }
    
    // Lấy danh sách màu sắc đang hoạt động (dùng cho dropdown)
    @GetMapping("/active")
    public ResponseEntity<List<ColorResponse>> getActiveColors() {
        List<ColorResponse> colors = colorService.getActiveColors();
        return ResponseEntity.ok(colors);
    }
    
    // Phân trang và tìm kiếm màu sắc
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
    
    // Lấy thông tin màu sắc theo id
    @GetMapping("/{id}")
    public ResponseEntity<ColorResponse> getColorById(@PathVariable Integer id) {
        return colorService.getColorById(id)
                .map(color -> ResponseEntity.ok(color))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Tạo mới một màu sắc
    @PostMapping
    public ResponseEntity<?> createColor(@Valid @RequestBody ColorDto requestDTO) {
        try {
            ColorResponse createdColor = colorService.createColor(requestDTO);
            return ResponseEntity.ok(createdColor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Cập nhật thông tin màu sắc theo id
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
    
    // Xóa màu sắc theo id
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