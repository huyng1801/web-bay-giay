// Controller quản lý tài khoản admin user
package vn.student.polyshoes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.AdminUserDto;
import vn.student.polyshoes.dto.ChangePasswordDto;
import vn.student.polyshoes.dto.UpdateAdminProfileDto;
import vn.student.polyshoes.dto.UpdateAdminUserDto;
import vn.student.polyshoes.response.AdminUserResponse;
import vn.student.polyshoes.service.AdminUserService;

import java.util.List;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến admin user
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/users")
public class AdminUserController {
    // Service xử lý logic liên quan đến admin user
    private final AdminUserService userService;

    // Hàm khởi tạo, inject AdminUserService
    public AdminUserController(AdminUserService userService) {
        this.userService = userService;
    }

    // Lấy danh sách tất cả admin user
    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Tạo mới admin user
    @PostMapping("/create")
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminUserDto userDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        // Kiểm tra email đã tồn tại chưa
        if (userService.findByEmail(userDto.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Lỗi: Email đã tồn tại");
        }
        AdminUserResponse createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // Cập nhật thông tin admin user theo ID
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @Valid @RequestBody UpdateAdminUserDto userDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        AdminUserResponse updatedUser = userService.updateUser(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    // Xóa admin user theo ID
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // Đổi trạng thái hoạt động của admin user (active/inactive)
    @PutMapping("/{userId}/toggle-status")
    public ResponseEntity<AdminUserResponse> toggleUserStatus(@PathVariable String userId) {
        AdminUserResponse updatedUser = userService.toggleUserStatus(userId);
        return ResponseEntity.ok(updatedUser);
    }

    // Lấy thông tin admin user theo ID
    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable String userId) {
        AdminUserResponse user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    // Cập nhật profile của admin hiện tại
    @PutMapping("/profile")
    public ResponseEntity<?> updateCurrentProfile(@Valid @RequestBody UpdateAdminProfileDto profileDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        String currentUserEmail = getCurrentUserEmail();
        AdminUserResponse updatedProfile = userService.updateCurrentAdminProfile(currentUserEmail, profileDto);
        return ResponseEntity.ok(updatedProfile);
    }

    // Đổi mật khẩu cho admin hiện tại
    @PutMapping("/profile/password")
    public ResponseEntity<?> changeCurrentPassword(@Valid @RequestBody ChangePasswordDto changePasswordDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        String currentUserEmail = getCurrentUserEmail();
        boolean success = userService.changeCurrentPassword(currentUserEmail, changePasswordDto);
        if (success) {
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } else {
            return ResponseEntity.badRequest().body("Mật khẩu cũ không đúng");
        }
    }

    // Hàm hỗ trợ trả về lỗi khi validate dữ liệu
    private ResponseEntity<?> badRequest(BindingResult result) {
        return ResponseEntity.badRequest().body("Error: " + result.getAllErrors());
    }

    // Upload avatar cho admin user
    @PostMapping("/{userId}/avatar")
    public ResponseEntity<?> uploadAvatar(@PathVariable String userId, @RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = userService.uploadAvatar(userId, file);
            return ResponseEntity.ok(avatarUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tải lên ảnh đại diện: " + e.getMessage());
        }
    }

    // Lấy thông tin profile của admin hiện tại
    @GetMapping("/profile")
    public ResponseEntity<AdminUserResponse> getCurrentProfile() {
        String currentUserEmail = getCurrentUserEmail();
        AdminUserResponse profile = userService.getCurrentAdminProfile(currentUserEmail);
        return ResponseEntity.ok(profile);
    }

    // Lấy email của user hiện tại từ context bảo mật
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // Trả về email của user hiện tại
    }

}
