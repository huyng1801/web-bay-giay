package vn.student.polyshoes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.student.polyshoes.dto.ChangePasswordDto;
import vn.student.polyshoes.dto.LoginUserDto;
import vn.student.polyshoes.model.AdminUser;
import vn.student.polyshoes.response.AdminUserResponse;
import vn.student.polyshoes.response.LoginResponse;
import vn.student.polyshoes.service.AdminUserService;
import vn.student.polyshoes.service.AuthenticationService;
import vn.student.polyshoes.service.JwtService;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final AdminUserService adminUserService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService, AdminUserService adminUserService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.adminUserService = adminUserService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        AdminUser authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser, authenticatedUser.getRole());
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }
    
    @GetMapping("/me")
    public ResponseEntity<AdminUserResponse> getAuthenticatedUser() {
        AdminUser currentUser = getCurrentUser();
        AdminUserResponse userResponse = adminUserService.getUserById(currentUser.getAdminUserId());
        return ResponseEntity.ok(userResponse);
    }
    
    @PostMapping("/me/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDto changePasswordDto, BindingResult result) {
        if (result.hasErrors()) {
            return badRequest(result);
        }
        AdminUser currentUser = getCurrentUser();
        adminUserService.changePassword(currentUser.getAdminUserId(), changePasswordDto);
        return ResponseEntity.noContent().build();
    }

    private AdminUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (AdminUser) authentication.getPrincipal();
    }

    // Helper method: handle bad request with validation errors
    private ResponseEntity<?> badRequest(BindingResult result) {
        return ResponseEntity.badRequest().body("Error: " + result.getAllErrors());
    }
}