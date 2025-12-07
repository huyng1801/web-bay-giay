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

@RestController
@RequestMapping("/users")
public class AdminUserController {
    private final AdminUserService userService;

    public AdminUserController(AdminUserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminUserDto userDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        if (userService.findByEmail(userDto.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Email already exists");
        }
        AdminUserResponse createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @Valid @RequestBody UpdateAdminUserDto userDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        AdminUserResponse updatedUser = userService.updateUser(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

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


    // Cập nhật profile admin hiện tại
    @PutMapping("/profile")
    public ResponseEntity<?> updateCurrentProfile(@Valid @RequestBody UpdateAdminProfileDto profileDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        String currentUserEmail = getCurrentUserEmail();
        AdminUserResponse updatedProfile = userService.updateCurrentAdminProfile(currentUserEmail, profileDto);
        return ResponseEntity.ok(updatedProfile);
    }

    // Thay đổi mật khẩu admin theo ID
    @PutMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable String userId, @Valid @RequestBody ChangePasswordDto changePasswordDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        return handleChangePassword(userId, changePasswordDto);
    }

    // Thay đổi mật khẩu của admin hiện tại
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
    // Helper method: get current authenticated user
    private AdminUserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        return userService.findByEmail(currentUserEmail);
    }

    // Helper method: handle password change
    private ResponseEntity<?> handleChangePassword(String userId, ChangePasswordDto changePasswordDto) {
        boolean success = userService.changePassword(userId, changePasswordDto);
        if (success) {
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } else {
            return ResponseEntity.badRequest().body("Mật khẩu cũ không đúng");
        }
    }

    // Helper method: handle bad request with validation errors
    private ResponseEntity<?> badRequest(BindingResult result) {
        return ResponseEntity.badRequest().body("Error: " + result.getAllErrors());
    }

    // Upload avatar admin
    @PostMapping("/{userId}/avatar")
    public ResponseEntity<?> uploadAvatar(@PathVariable String userId, @RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = userService.uploadAvatar(userId, file);
            return ResponseEntity.ok(avatarUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading avatar: " + e.getMessage());
        }
    }

    // Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<AdminUserResponse> getCurrentProfile() {
        String currentUserEmail = getCurrentUserEmail();
        AdminUserResponse profile = userService.getCurrentAdminProfile(currentUserEmail);
        return ResponseEntity.ok(profile);
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // This should return the email
    }

}
