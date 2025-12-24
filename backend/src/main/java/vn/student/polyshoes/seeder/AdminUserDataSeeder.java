package vn.student.polyshoes.seeder;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.enums.Role;
import vn.student.polyshoes.model.AdminUser;
import vn.student.polyshoes.repository.AdminUserRepository;
import vn.student.polyshoes.util.GenerateUtils;

/**
 * Seeder dùng để khởi tạo dữ liệu admin user ban đầu
 * Tự động chạy khi ứng dụng khởi động nếu bảng admin user còn trống
 */
@Component
@Configuration
public class AdminUserDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserDataSeeder.class);

    /**
     * Khởi tạo dữ liệu admin user mặc định (admin và employee)
     * @param userRepository Repository dùng để lưu admin user
     * @param passwordEncoder Encoder dùng để mã hóa mật khẩu
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedUsers(AdminUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) { // Ngăn chặn tạo dữ liệu trùng lặp


                // Tạo tài khoản admin
                AdminUser adminUser = new AdminUser();
                adminUser.setAdminUserId(GenerateUtils.generateUUID());
                adminUser.setFullName("Nguyen Van A");
                adminUser.setEmail("nguyenvana@gmail.com");
                adminUser.setPhone("0987654321");
                adminUser.setAddress("Hà Nội");
                adminUser.setHashPassword(passwordEncoder.encode("12345678")); // Mã hóa mật khẩu
                adminUser.setIsActive(true);
                adminUser.setCreatedAt(new Date());
                adminUser.setUpdatedAt(new Date());
                adminUser.setRole(Role.ADMIN);

                // Tạo tài khoản nhân viên
                AdminUser employeeUser = new AdminUser();
                employeeUser.setAdminUserId(GenerateUtils.generateUUID());
                employeeUser.setFullName("Nguyen Van B");
                employeeUser.setEmail("nguyenvanb@gmail.com");
                employeeUser.setPhone("0976543210");
                employeeUser.setAddress("456 Đường DEF, Quận 3, TP.HCM");
                employeeUser.setHashPassword(passwordEncoder.encode("12345678")); // Mã hóa mật khẩu
                employeeUser.setIsActive(true);
                employeeUser.setCreatedAt(new Date());
                employeeUser.setUpdatedAt(new Date());
                employeeUser.setRole(Role.EMPLOYEE);

                // Lưu admin user vào database
                userRepository.save(adminUser);
                userRepository.save(employeeUser);

                logger.info("Dữ liệu admin user đã được khởi tạo thành công!");
            }
        };
    }
}