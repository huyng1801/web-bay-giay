// Controller quản lý các chức năng liên quan đến banner
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.BannerDto;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.Banner;
import vn.student.polyshoes.model.AdminUser;
import vn.student.polyshoes.service.BannerService;

import vn.student.polyshoes.response.ToggleStatusResponse;
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
        
        // Get current authenticated admin user
        String currentAdminId = getCurrentAdminUserId();
        bannerDto.setCreatedByAdminId(currentAdminId);
        
        Banner banner = bannerService.createBanner(bannerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(banner);
    }

    // Cập nhật thông tin banner theo id
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBanner(@PathVariable Integer id, @ModelAttribute @Valid BannerDto bannerDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        
        // Get current authenticated admin user
        String currentAdminId = getCurrentAdminUserId();
        bannerDto.setUpdatedByAdminId(currentAdminId);
        
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
            ToggleStatusResponse response = new ToggleStatusResponse(banner.getBannerId(), banner.getIsActive());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Helper method to get current authenticated admin user ID
    private String getCurrentAdminUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof AdminUser) {
            AdminUser adminUser = (AdminUser) authentication.getPrincipal();
            return adminUser.getAdminUserId();
        }
        // Fallback to default admin ID if no authentication found (for development)
        return "admin-1";
    }
}
