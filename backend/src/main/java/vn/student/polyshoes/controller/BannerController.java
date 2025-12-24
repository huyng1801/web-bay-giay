// Controller quản lý các chức năng liên quan đến banner
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
import vn.student.polyshoes.dto.BannerDto;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.Banner;
import vn.student.polyshoes.service.BannerService;
import vn.student.polyshoes.util.ValidationUtils;

import java.util.List;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến banner
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/banners")
public class BannerController {

    // Inject BannerService để xử lý logic liên quan đến banner
    @Autowired
    private BannerService bannerService;

    // Lấy danh sách tất cả banner
    @GetMapping
    public ResponseEntity<List<Banner>> getAllBanners() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    // Lấy thông tin banner theo id
    @GetMapping("/{id}")
    public ResponseEntity<Banner> getBannerById(@PathVariable Integer id) {
        Banner banner = getBannerOrThrow(id);
        return ResponseEntity.ok(banner);
    }

    // Tạo mới một banner
    @PostMapping
    public ResponseEntity<?> createBanner(@ModelAttribute @Valid BannerDto bannerDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        Banner banner = bannerService.createBanner(bannerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(banner);
    }

    // Cập nhật thông tin banner theo id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBanner(@PathVariable Integer id, @ModelAttribute @Valid BannerDto bannerDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        Banner banner = bannerService.updateBanner(id, bannerDto);
        if (banner == null) {
            throw new ResourceNotFoundException("Banner với ID " + id + " không tồn tại");
        }
        return ResponseEntity.ok(banner);
    }

    // Xóa banner theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Integer id) {
        getBannerOrThrow(id);
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

    // Hàm hỗ trợ: lấy banner theo id hoặc báo lỗi không tìm thấy
    private Banner getBannerOrThrow(Integer id) {
        Banner banner = bannerService.getBannerById(id);
        if (banner == null) {
            throw new ResourceNotFoundException("Banner với ID " + id + " không tồn tại");
        }
        return banner;
    }

    // Hàm hỗ trợ: trả về lỗi khi validate dữ liệu
    private ResponseEntity<?> badRequest(BindingResult result) {
        return ResponseEntity.badRequest().body(ValidationUtils.getErrorMessages(result));
    }

    // Đổi trạng thái hoạt động của banner (ẩn/hiện)
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleBannerStatus(@PathVariable Integer id) {
        try {
            Banner banner = bannerService.toggleBannerStatus(id);
            vn.student.polyshoes.response.ToggleStatusResponse response = 
                new vn.student.polyshoes.response.ToggleStatusResponse(banner.getBannerId(), banner.getIsActive());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
