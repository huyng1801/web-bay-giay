// Controller quản lý các chức năng liên quan đến thương hiệu (brand)
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.BrandDto;
import vn.student.polyshoes.model.Brand;
import vn.student.polyshoes.service.BrandService;
import vn.student.polyshoes.util.ValidationUtils;

import java.io.IOException;
import java.util.List;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến thương hiệu
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/brands")
public class BrandController {

    // Inject BrandService để xử lý logic liên quan đến thương hiệu
    @Autowired
    private BrandService brandService;

    // Lấy danh sách tất cả thương hiệu
    @GetMapping
    public ResponseEntity<List<Brand>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    // Lấy thông tin thương hiệu theo id
    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Integer id) {
        Brand brand = brandService.getBrandById(id);
        return ResponseEntity.ok(brand);
    }

    // Tạo mới một thương hiệu
    @PostMapping
    public ResponseEntity<?> createBrand(@ModelAttribute @Valid BrandDto brandDto, BindingResult result) throws IOException {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        Brand brand = brandService.createBrand(brandDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(brand);
    }

    // Cập nhật thông tin thương hiệu theo id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBrand(@PathVariable Integer id, @ModelAttribute @Valid BrandDto brandDto, BindingResult result) throws IOException {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        Brand brand = brandService.updateBrand(id, brandDto);
        return ResponseEntity.ok(brand);
    }
    // Hàm hỗ trợ: trả về lỗi khi validate dữ liệu
    private ResponseEntity<?> badRequest(BindingResult result) {
        return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
    }

    // Xóa thương hiệu theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Integer id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }

    // Đổi trạng thái hoạt động của thương hiệu (ẩn/hiện)
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleBrandStatus(@PathVariable Integer id) {
        try {
            Brand brand = brandService.toggleBrandStatus(id);
            vn.student.polyshoes.response.ToggleStatusResponse response = 
                new vn.student.polyshoes.response.ToggleStatusResponse(brand.getBrandId(), brand.getIsActive());
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
