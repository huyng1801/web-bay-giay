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

@Component
@Configuration
public class AdminUserDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserDataSeeder.class);

    @Bean
    CommandLineRunner seedUsers(AdminUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) { // Prevent duplicate entries


                // Create an admin user
                AdminUser adminUser = new AdminUser();
                adminUser.setAdminUserId(GenerateUtils.generateUUID());
                adminUser.setFullName("Nguyen Van A");
                adminUser.setEmail("nguyenvana@gmail.com");
                adminUser.setPhone("0987654321");
                adminUser.setAddress("Hà Nội");
                adminUser.setHashPassword(passwordEncoder.encode("12345678"));
                adminUser.setIsActive(true);
                adminUser.setCreatedAt(new Date());
                adminUser.setUpdatedAt(new Date());
                adminUser.setRole(Role.ADMIN);

                // Create an employee user
                AdminUser employeeUser = new AdminUser();
                employeeUser.setAdminUserId(GenerateUtils.generateUUID());
                employeeUser.setFullName("Nguyen Van B");
                employeeUser.setEmail("nguyenvanb@gmail.com");
                employeeUser.setPhone("0976543210");
                employeeUser.setAddress("456 Đường DEF, Quận 3, TP.HCM");
                employeeUser.setHashPassword(passwordEncoder.encode("12345678"));
                employeeUser.setIsActive(true);
                employeeUser.setCreatedAt(new Date());
                employeeUser.setUpdatedAt(new Date());
                employeeUser.setRole(Role.EMPLOYEE);

                // Save users to the database
                userRepository.save(adminUser);
                userRepository.save(employeeUser);

                logger.info("Users seeded successfully!");
            }
        };
    }
}