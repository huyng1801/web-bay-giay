package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.repository.CustomerRepository;

import java.util.Date;
/**
 * Seeder dùng để khởi tạo dữ liệu khách hàng đăng ký
 * Tự động chạy khi ứng dụng khởi động nếu bảng customer còn trống
 * Tạo các tài khoản khách hàng mẫu với mật khẩu được mã hóa
 */
@Component
@Configuration
public class CustomerDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(CustomerDataSeeder.class);

    /**
     * Khởi tạo dữ liệu khách hàng
     * @param customerRepository Repository dùng để lưu khách hàng
     * @param passwordEncoder Encoder dùng để mã hóa mật khẩu
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedCustomers(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            logger.info("Bắt đầu khởi tạo dữ liệu khách hàng...");
            
            // Kiểm tra xem bảng customer đã có dữ liệu hay chưa
            if (customerRepository.count() == 0) {

            // ===== KHÁCH HÀNG 1: Nguyễn Văn A =====
            if (customerRepository.findByEmail("nguyenvana@gmail.com").isEmpty()) {
                Customer c1 = new Customer();
                c1.setFullName("Nguyễn Văn A");
                c1.setEmail("nguyenvana@gmail.com");
                // Mã hóa mật khẩu "password123" trước khi lưu
                c1.setHashPassword(passwordEncoder.encode("password123"));
                c1.setEmailConfirmed(true);  // Email đã được xác thực
                c1.setPhone("0901234567");
                c1.setAddress("123 Nguyễn Hữu Cảnh, Phường 22");
                c1.setAddress2("Apartment 5A, Building B");
                c1.setCity("Bình Thạnh, TP.HCM");
                c1.setIsActive(true);  // Tài khoản đang hoạt động
                c1.setCreatedAt(new Date());
                c1.setUpdatedAt(new Date());
                customerRepository.save(c1);
            }

            // ===== KHÁCH HÀNG 2: Trần Thị B =====
            if (customerRepository.findByEmail("tranthib@gmail.com").isEmpty()) {
                Customer c2 = new Customer();
                c2.setFullName("Trần Thị B");
                c2.setEmail("tranthib@gmail.com");
                c2.setHashPassword(passwordEncoder.encode("password123"));
                c2.setEmailConfirmed(true);
                c2.setPhone("0912345678");
                c2.setAddress("456 Lê Lợi, Quận 1");
                c2.setAddress2("Office 201, Central Tower");
                c2.setCity("Quận 1, TP.HCM");
                c2.setIsActive(true);
                c2.setCreatedAt(new Date());
                c2.setUpdatedAt(new Date());
                customerRepository.save(c2);
            }

            // ===== KHÁCH HÀNG 3: Lê Văn C =====
            if (customerRepository.findByEmail("levanc@gmail.com").isEmpty()) {
                Customer c3 = new Customer();
                c3.setFullName("Lê Văn C");
                c3.setEmail("levanc@gmail.com");
                c3.setHashPassword(passwordEncoder.encode("password123"));
                c3.setEmailConfirmed(false);  // Email chưa được xác thực
                c3.setPhone("0923456789");
                c3.setAddress("789 Trần Hưng Đạo, Phường 1");
                c3.setAddress2("");  // Không có địa chỉ thứ 2
                c3.setCity("Quận 5, TP.HCM");
                c3.setIsActive(true);
                c3.setCreatedAt(new Date());
                c3.setUpdatedAt(new Date());
                customerRepository.save(c3);
            }

            // ===== KHÁCH HÀNG 4: Phạm Thị D =====
            if (customerRepository.findByEmail("phamthid@gmail.com").isEmpty()) {
                Customer c4 = new Customer();
                c4.setFullName("Phạm Thị D");
                c4.setEmail("phamthid@gmail.com");
                c4.setHashPassword(passwordEncoder.encode("password123"));
                c4.setEmailConfirmed(true);
                c4.setPhone("0934567890");
                c4.setAddress("321 Nguyễn Trãi, Phường 5");
                c4.setAddress2("Villa 2, Green Village");
                c4.setCity("Quận 10, TP.HCM");
                c4.setIsActive(true);
                c4.setCreatedAt(new Date());
                c4.setUpdatedAt(new Date());
                customerRepository.save(c4);
            }

            // ===== KHÁCH HÀNG 5: Hoàng Văn E =====
            if (customerRepository.findByEmail("hoangvane@gmail.com").isEmpty()) {
                Customer c5 = new Customer();
                c5.setFullName("Hoàng Văn E");
                c5.setEmail("hoangvane@gmail.com");
                c5.setHashPassword(passwordEncoder.encode("password123"));
                c5.setEmailConfirmed(true);
                c5.setPhone("0945678901");
                c5.setAddress("654 Võ Văn Tần, Phường 6");
                c5.setAddress2("Penthouse 15F");
                c5.setCity("Quận 3, TP.HCM");
                c5.setIsActive(true);
                c5.setCreatedAt(new Date());
                c5.setUpdatedAt(new Date());
                customerRepository.save(c5);
            }

            // ===== KHÁCH HÀNG 6: Vũ Thị F (Tài khoản bị khoá) =====
            if (customerRepository.findByEmail("vuthif@gmail.com").isEmpty()) {
                Customer c6 = new Customer();
                c6.setFullName("Vũ Thị F");
                c6.setEmail("vuthif@gmail.com");
                c6.setHashPassword(passwordEncoder.encode("password123"));
                c6.setEmailConfirmed(true);
                c6.setPhone("0956789012");
                c6.setAddress("987 Cách Mạng Tháng 8, Phường 14");
                c6.setAddress2("");
                c6.setCity("Quận 10, TP.HCM");
                c6.setIsActive(false);  // Tài khoản đã bị vô hiệu hóa
                c6.setCreatedAt(new Date());
                c6.setUpdatedAt(new Date());
                customerRepository.save(c6);
            }

            logger.info("Successfully seeded customers with secured passwords!");
            }
        };
    }
}
