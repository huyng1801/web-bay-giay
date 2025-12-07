package vn.student.polyshoes.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vn.student.polyshoes.dto.AdminUserDto;
import vn.student.polyshoes.dto.ChangePasswordDto;
import vn.student.polyshoes.dto.UpdateAdminProfileDto;
import vn.student.polyshoes.dto.UpdateAdminUserDto;
import vn.student.polyshoes.exception.ResourceNotFoundException;
import vn.student.polyshoes.model.AdminUser;
import vn.student.polyshoes.repository.AdminUserRepository;
import vn.student.polyshoes.response.AdminUserResponse;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {
    private final AdminUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(AdminUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AdminUserResponse createUser(AdminUserDto userDto) {
        AdminUser user = new AdminUser();
        user.setAdminUserId(java.util.UUID.randomUUID().toString());
        mapDtoToEntity(userDto, user);
        user.setHashPassword(passwordEncoder.encode(userDto.getPassword()));
        Date now = new Date();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userRepository.save(user);
        return mapToResponse(user);
    }

    public AdminUserResponse updateUser(String userId, UpdateAdminUserDto userDto) {
        AdminUser user = findUserById(userId);
        // Don't update password in regular update
        user.setEmail(userDto.getEmail());
        user.setFullName(userDto.getFullName());
        user.setPhone(userDto.getPhone());
        user.setAddress(userDto.getAddress());
        user.setAddress2(userDto.getAddress2());
        user.setRole(userDto.getRole());
        user.setIsActive(userDto.getIsActive());
        user.setUpdatedAt(new Date());
        userRepository.save(user);
        return mapToResponse(user);
    }

    public AdminUserResponse updateUserProfile(String userId, AdminUserDto userDto) {
        AdminUser user = findUserById(userId);
        user.setEmail(userDto.getEmail());
        user.setFullName(userDto.getFullName());
        user.setRole(userDto.getRole());
        user.setIsActive(userDto.getIsActive());
        user.setUpdatedAt(new Date());
        userRepository.save(user);
        return mapToResponse(user);
    }

    public boolean changePassword(String userId, ChangePasswordDto changePasswordDto) {
        AdminUser user = findUserById(userId);
        if (!passwordEncoder.matches(changePasswordDto.getOldPassword(), user.getHashPassword())) {
            return false;
        }
        user.setHashPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        user.setUpdatedAt(new Date());
        userRepository.save(user);
        return true;
    }

    public String uploadAvatar(String userId, MultipartFile file) {
        AdminUser user = findUserById(userId);
        String avatarUrl = "/uploads/avatars/" + userId + "_" + file.getOriginalFilename();
        // user.setAvatarUrl(avatarUrl); // Uncomment if avatarUrl field exists
        user.setUpdatedAt(new Date());
        userRepository.save(user);
        return avatarUrl;
    }
    

    public void deleteUser(String userId) {
        userRepository.delete(findUserById(userId));
    }

    public AdminUserResponse getUserById(String userId) {
        return mapToResponse(findUserById(userId));
    }

    public AdminUserResponse findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::mapToResponse)
                .orElse(null);
    }

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AdminUserResponse toggleUserStatus(String userId) {
        AdminUser user = findUserById(userId);
        user.setIsActive(!user.getIsActive());
        user.setUpdatedAt(new Date());
        userRepository.save(user);
        return mapToResponse(user);
    }

    // Methods for current admin profile management
    public AdminUserResponse getCurrentAdminProfile(String email) {
        AdminUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
        return mapToResponse(user);
    }

    public AdminUserResponse updateCurrentAdminProfile(String email, UpdateAdminProfileDto profileDto) {
        AdminUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
        
        user.setFullName(profileDto.getFullName());
        user.setPhone(profileDto.getPhone());
        user.setAddress(profileDto.getAddress());
        user.setAddress2(profileDto.getAddress2());
        user.setUpdatedAt(new Date());
        
        userRepository.save(user);
        return mapToResponse(user);
    }

    public boolean changeCurrentPassword(String email, ChangePasswordDto changePasswordDto) {
        AdminUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
        
        if (!passwordEncoder.matches(changePasswordDto.getOldPassword(), user.getHashPassword())) {
            return false;
        }
        
        user.setHashPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        user.setUpdatedAt(new Date());
        userRepository.save(user);
        return true;
    }

    private AdminUser findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    private void mapDtoToEntity(AdminUserDto userDto, AdminUser user) {
        user.setEmail(userDto.getEmail());
        user.setFullName(userDto.getFullName());
        user.setPhone(userDto.getPhone());
        user.setAddress(userDto.getAddress());
        user.setAddress2(userDto.getAddress2());
        user.setRole(userDto.getRole());
        user.setIsActive(userDto.getIsActive());
    }

    private AdminUserResponse mapToResponse(AdminUser user) {
        return new AdminUserResponse(
            user.getAdminUserId(),
            user.getEmail(),
            user.getFullName(),
            user.getPhone(),
            user.getAddress(),
            user.getAddress2(),
            user.getRole(),
            user.getIsActive(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
