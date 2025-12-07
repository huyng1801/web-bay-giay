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

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/active")
    public ResponseEntity<List<CategoryResponse>> getActiveCategories() {
        return ResponseEntity.ok(categoryService.getActiveCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable("id") Integer categoryId) {
        CategoryResponse categoryResponse = getCategoryOrThrow(categoryId);
        return ResponseEntity.ok(categoryResponse);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody @Valid CategoryDto categoryDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        if (categoryService.isCategoryNameExists(categoryDto.getCategoryName())) {
            return ResponseEntity.badRequest().body("Category name already exists");
        }
        CategoryResponse createdCategory = categoryService.createCategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable("id") Integer categoryId, @RequestBody @Valid CategoryDto categoryDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        getCategoryOrThrow(categoryId);
        if (categoryService.isCategoryNameExistsForOtherId(categoryDto.getCategoryName(), categoryId)) {
            return ResponseEntity.badRequest().body("Category name already exists for another category");
        }
        CategoryResponse updatedCategory = categoryService.updateCategory(categoryId, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Integer categoryId) {
        boolean isDeleted = categoryService.deleteCategory(categoryId);
        if (!isDeleted) {
            throw new ResourceNotFoundException("Category with ID " + categoryId + " not found");
        }
        return ResponseEntity.noContent().build();
    }

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

    // Helper: get category or throw not found
    private CategoryResponse getCategoryOrThrow(Integer categoryId) {
        CategoryResponse categoryResponse = categoryService.getCategoryById(categoryId);
        if (categoryResponse == null) {
            throw new ResourceNotFoundException("Category with ID " + categoryId + " not found");
        }
        return categoryResponse;
    }

    // Helper: handle bad request with validation errors
    private ResponseEntity<?> badRequest(BindingResult result) {
        return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
    }

    // Helper: handle bad request with message
    private ResponseEntity<?> badRequest(String message) {
        vn.student.polyshoes.response.ErrorResponse errorResponse = new vn.student.polyshoes.response.ErrorResponse(message, 400);
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
