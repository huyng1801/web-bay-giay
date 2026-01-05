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
                adminUser.setFullName("Admin Polyshoes");
                adminUser.setEmail("admin@polyshoes.com");
                adminUser.setPhone("0387654321");
                adminUser.setAddress("Hà Nội, Việt Nam");
                adminUser.setHashPassword(passwordEncoder.encode("admin123456")); // Mã hóa mật khẩu
                adminUser.setIsActive(true);
                adminUser.setCreatedAt(new Date());
                adminUser.setUpdatedAt(new Date());
                adminUser.setRole(Role.ADMIN);

                // Tạo tài khoản nhân viên 1
                AdminUser employeeUser1 = new AdminUser();
                employeeUser1.setAdminUserId(GenerateUtils.generateUUID());
                employeeUser1.setFullName("Trần Thị Thu Hương");
                employeeUser1.setEmail("thuhuong@polyshoes.com");
                employeeUser1.setPhone("0376543210");
                employeeUser1.setAddress("TP.HCM, Việt Nam");
                employeeUser1.setHashPassword(passwordEncoder.encode("employee123456")); // Mã hóa mật khẩu
                employeeUser1.setIsActive(true);
                employeeUser1.setCreatedAt(new Date());
                employeeUser1.setUpdatedAt(new Date());
                employeeUser1.setRole(Role.EMPLOYEE);
                
                // Tạo tài khoản nhân viên 2
                AdminUser employeeUser2 = new AdminUser();
                employeeUser2.setAdminUserId(GenerateUtils.generateUUID());
                employeeUser2.setFullName("Nguyễn Văn Linh");
                employeeUser2.setEmail("vanlinh@polyshoes.com");
                employeeUser2.setPhone("0365432109");
                employeeUser2.setAddress("Đà Nẵng, Việt Nam");
                employeeUser2.setHashPassword(passwordEncoder.encode("employee123456")); // Mã hóa mật khẩu
                employeeUser2.setIsActive(true);
                employeeUser2.setCreatedAt(new Date());
                employeeUser2.setUpdatedAt(new Date());
                employeeUser2.setRole(Role.EMPLOYEE);

                // Lưu admin user vào database
                userRepository.save(adminUser);
                userRepository.save(employeeUser1);
                userRepository.save(employeeUser2);

                logger.info("Dữ liệu admin user đã được khởi tạo thành công! (1 Admin + 2 Employees)");
            }
        };
    }
}