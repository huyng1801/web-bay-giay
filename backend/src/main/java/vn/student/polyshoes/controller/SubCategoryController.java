package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.SubCategoryDto;
import vn.student.polyshoes.enums.Gender;
import vn.student.polyshoes.model.SubCategory;
import vn.student.polyshoes.response.SubCategoryResponse;
import vn.student.polyshoes.response.ToggleStatusResponse;
import vn.student.polyshoes.service.SubCategoryService;
import vn.student.polyshoes.util.ValidationUtils;

import java.util.List;

// Controller quản lý các API liên quan đến danh mục con (SubCategory)
@RestController
@RequestMapping("/subcategories")
public class SubCategoryController {

    // Inject service xử lý logic liên quan đến SubCategory
    @Autowired
    private SubCategoryService subCategoryService;

    // Lấy danh sách các danh mục con, có thể lọc theo categoryId và giới tính (gender)
    @GetMapping
    public ResponseEntity<List<SubCategoryResponse>> getSubCategories(
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "gender", required = false) Gender gender) {
        List<SubCategoryResponse> subCategories = subCategoryService.getSubCategories(categoryId, gender);
        return ResponseEntity.ok(subCategories);
    }
    

    // Lấy thông tin danh mục con theo id
    @GetMapping("/{id}")
    public ResponseEntity<SubCategoryResponse> getSubCategoryById(@PathVariable Integer id) {
        SubCategoryResponse subCategory = subCategoryService.getSubCategoryById(id);
        return ResponseEntity.ok(subCategory);
    }



    // Tạo mới một danh mục con
    // Kiểm tra dữ liệu đầu vào, trả về lỗi nếu không hợp lệ
    @PostMapping
    public ResponseEntity<?> createSubCategory(@Valid @RequestBody SubCategoryDto subCategoryDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        SubCategoryResponse subCategory = subCategoryService.createSubCategory(subCategoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(subCategory);
    }

    // Cập nhật thông tin danh mục con theo id
    // Kiểm tra dữ liệu đầu vào, trả về lỗi nếu không hợp lệ
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubCategory(@PathVariable Integer id, @Valid @RequestBody SubCategoryDto subCategoryDto, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
        }
        SubCategoryResponse subCategory = subCategoryService.updateSubCategory(id, subCategoryDto);
        return ResponseEntity.ok(subCategory);
    }

    // Xóa danh mục con theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubCategory(@PathVariable Integer id) {
        subCategoryService.deleteSubCategory(id);
        return ResponseEntity.noContent().build();
    }

    // Đổi trạng thái hoạt động của danh mục con (active/inactive)
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleSubCategoryStatus(@PathVariable Integer id) {
        SubCategory subCategory = subCategoryService.toggleSubCategoryStatus(id);
        ToggleStatusResponse response = new ToggleStatusResponse(subCategory.getSubCategoryId(), subCategory.getIsActive());
        return ResponseEntity.ok(response);
    }
}
