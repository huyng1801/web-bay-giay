// Controller quản lý các chức năng liên quan đến danh mục sản phẩm (category)
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import vn.student.polyshoes.dto.CategoryDto;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.response.CategoryResponse;
import vn.student.polyshoes.service.CategoryService;
import vn.student.polyshoes.util.ValidationUtils;

import java.util.List;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến danh mục
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/categories")
public class CategoryController {

    // Inject CategoryService để xử lý logic liên quan đến danh mục
    @Autowired
    private CategoryService categoryService;

    // Lấy danh sách tất cả danh mục
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // Lấy danh sách các danh mục đang hoạt động
    @GetMapping("/active")
    public ResponseEntity<List<CategoryResponse>> getActiveCategories() {
        return ResponseEntity.ok(categoryService.getActiveCategories());
    }

    // Lấy thông tin danh mục theo id
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable("id") Integer categoryId) {
        CategoryResponse categoryResponse = getCategoryOrThrow(categoryId);
        return ResponseEntity.ok(categoryResponse);
    }

    // Tạo mới một danh mục
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody @Valid CategoryDto categoryDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        // Kiểm tra tên danh mục đã tồn tại chưa
        if (categoryService.isCategoryNameExists(categoryDto.getCategoryName())) {
            return ResponseEntity.badRequest().body("Category name already exists");
        }
        CategoryResponse createdCategory = categoryService.createCategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    // Cập nhật thông tin danh mục theo id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Integer categoryId, @RequestBody @Valid CategoryDto categoryDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        getCategoryOrThrow(categoryId);
        // Kiểm tra tên danh mục đã tồn tại ở id khác chưa
        if (categoryService.isCategoryNameExistsForOtherId(categoryDto.getCategoryName(), categoryId)) {
            return ResponseEntity.badRequest().body("Category name already exists for another category");
        }
        CategoryResponse updatedCategory = categoryService.updateCategory(categoryId, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    // Xóa danh mục theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Integer categoryId) {
        boolean isDeleted = categoryService.deleteCategory(categoryId);
        if (!isDeleted) {
            throw new ResourceNotFoundException("Category with ID " + categoryId + " not found");
        }
        return ResponseEntity.noContent().build();
    }

    // Đổi trạng thái hoạt động của danh mục (ẩn/hiện)
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleCategoryStatus(@PathVariable("id") Integer categoryId) {
        try {
            vn.student.polyshoes.model.Category category = categoryService.toggleCategoryStatus(categoryId);
            vn.student.polyshoes.response.ToggleStatusResponse response = 
                new vn.student.polyshoes.response.ToggleStatusResponse(category.getCategoryId(), category.getIsActive());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return badRequest(e.getMessage());
        }
    }

    // Hàm hỗ trợ: lấy danh mục theo id hoặc báo lỗi không tìm thấy
    private CategoryResponse getCategoryOrThrow(Integer categoryId) {
        CategoryResponse categoryResponse = categoryService.getCategoryById(categoryId);
        if (categoryResponse == null) {
            throw new ResourceNotFoundException("Category with ID " + categoryId + " not found");
        }
        return categoryResponse;
    }

    // Hàm hỗ trợ: trả về lỗi khi validate dữ liệu
    private ResponseEntity<?> badRequest(BindingResult result) {
        return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
    }

    // Hàm hỗ trợ: trả về lỗi với thông báo tuỳ chỉnh
    private ResponseEntity<?> badRequest(String message) {
        vn.student.polyshoes.response.ErrorResponse errorResponse = new vn.student.polyshoes.response.ErrorResponse(message, 400);
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
