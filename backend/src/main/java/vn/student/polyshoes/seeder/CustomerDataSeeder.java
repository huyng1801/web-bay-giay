package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.CustomerAddress;
import vn.student.polyshoes.enums.CustomerType;
import vn.student.polyshoes.repository.CustomerRepository;
import vn.student.polyshoes.repository.CustomerAddressRepository;

import java.util.Date;
/**
 * Seeder dùng để khởi tạo dữ liệu khách hàng (gộp cả khách đăng ký và khách vãng lai)
 * Tự động chạy khi ứng dụng khởi động nếu bảng customer còn trống
 * Tạo các tài khoản khách hàng mẫu với mật khẩu được mã hóa
 * Mỗi khách hàng có ít nhất một địa chỉ mặc định
 */
@Component
@Configuration
public class CustomerDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(CustomerDataSeeder.class);

    /**
     * Khởi tạo dữ liệu khách hàng
     * @param customerRepository Repository dùng để lưu khách hàng
     * @param customerAddressRepository Repository dùng để lưu địa chỉ
     * @param passwordEncoder Encoder dùng để mã hóa mật khẩu
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedCustomers(CustomerRepository customerRepository, 
                                   CustomerAddressRepository customerAddressRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            logger.info("Bắt đầu khởi tạo dữ liệu khách hàng...");
            
            // Kiểm tra xem bảng customer đã có dữ liệu hay chưa
            if (customerRepository.count() == 0) {

            // ===== KHÁCH HÀNG 1: Nguyễn Văn A (Khách đăng ký) =====
            if (customerRepository.findByEmail("nguyenvana@gmail.com").isEmpty()) {
                Customer c1 = new Customer();
                c1.setFullName("Nguyễn Văn A");
                c1.setEmail("nguyenvana@gmail.com");
                c1.setHashPassword(passwordEncoder.encode("password123"));
                c1.setCustomerType(CustomerType.REGISTERED);
                c1.setEmailConfirmed(true);
                c1.setPhone("0901234567");
                c1.setGender("Nam");
                c1.setIsActive(true);
                c1.setCreatedAt(new Date());
                c1.setUpdatedAt(new Date());
                Customer savedC1 = customerRepository.save(c1);
                
                // Thêm địa chỉ mặc định
                CustomerAddress addr1 = new CustomerAddress();
                addr1.setCustomer(savedC1);
                addr1.setAddress("123 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh");
                addr1.setGhnProvinceId(202); // TP.HCM
                addr1.setGhnDistrictId(20217); // Bình Thạnh
                addr1.setGhnWardCode("904238"); // Phường 22
                addr1.setIsDefault(true);
                addr1.setAddressType("HOME");
                addr1.setCreatedAt(new Date());
                addr1.setUpdatedAt(new Date());
                customerAddressRepository.save(addr1);
            }

            // ===== KHÁCH HÀNG 2: Trần Thị B (Khách đăng ký) =====
            if (customerRepository.findByEmail("tranthib@gmail.com").isEmpty()) {
                Customer c2 = new Customer();
                c2.setFullName("Trần Thị B");
                c2.setEmail("tranthib@gmail.com");
                c2.setHashPassword(passwordEncoder.encode("password123"));
                c2.setCustomerType(CustomerType.REGISTERED);
                c2.setEmailConfirmed(true);
                c2.setPhone("0912345678");
                c2.setGender("Nữ");
                c2.setIsActive(true);
                c2.setCreatedAt(new Date());
                c2.setUpdatedAt(new Date());
                Customer savedC2 = customerRepository.save(c2);
                
                CustomerAddress addr2 = new CustomerAddress();
                addr2.setCustomer(savedC2);
                addr2.setAddress("456 Lê Lợi, Quận 1, TP.HCM");
                addr2.setGhnProvinceId(202); // TP.HCM
                addr2.setGhnDistrictId(20202); // Quận 1
                addr2.setGhnWardCode("904227"); // Bến Nghé
                addr2.setIsDefault(true);
                addr2.setAddressType("OFFICE");
                addr2.setCreatedAt(new Date());
                addr2.setUpdatedAt(new Date());
                customerAddressRepository.save(addr2);
            }

            // ===== KHÁCH HÀNG 3: Lê Văn C (Khách đăng ký) =====
            if (customerRepository.findByEmail("levanc@gmail.com").isEmpty()) {
                Customer c3 = new Customer();
                c3.setFullName("Lê Văn C");
                c3.setEmail("levanc@gmail.com");
                c3.setHashPassword(passwordEncoder.encode("password123"));
                c3.setCustomerType(CustomerType.REGISTERED);
                c3.setEmailConfirmed(false);
                c3.setPhone("0923456789");
                c3.setGender("Nam");
                c3.setIsActive(true);
                c3.setCreatedAt(new Date());
                c3.setUpdatedAt(new Date());
                Customer savedC3 = customerRepository.save(c3);
                
                CustomerAddress addr3 = new CustomerAddress();
                addr3.setCustomer(savedC3);
                addr3.setAddress("789 Trần Hưng Đạo, Phường 1, Quận 5");
                addr3.setGhnProvinceId(202); // TP.HCM
                addr3.setGhnDistrictId(20205); // Quận 5
                addr3.setGhnWardCode("904184"); // Phường 1
                addr3.setIsDefault(true);
                addr3.setAddressType("HOME");
                addr3.setCreatedAt(new Date());
                addr3.setUpdatedAt(new Date());
                customerAddressRepository.save(addr3);
            }

            // ===== KHÁCH HÀNG 4: Phạm Thị D (Khách đăng ký) =====
            if (customerRepository.findByEmail("phamthid@gmail.com").isEmpty()) {
                Customer c4 = new Customer();
                c4.setFullName("Phạm Thị D");
                c4.setEmail("phamthid@gmail.com");
                c4.setHashPassword(passwordEncoder.encode("password123"));
                c4.setCustomerType(CustomerType.REGISTERED);
                c4.setEmailConfirmed(true);
                c4.setPhone("0934567890");
                c4.setGender("Nữ");
                c4.setIsActive(true);
                c4.setCreatedAt(new Date());
                c4.setUpdatedAt(new Date());
                Customer savedC4 = customerRepository.save(c4);
                
                CustomerAddress addr4 = new CustomerAddress();
                addr4.setCustomer(savedC4);
                addr4.setAddress("321 Nguyễn Trãi, Phường 5, Quận 10");
                addr4.setGhnProvinceId(202); // TP.HCM
                addr4.setGhnDistrictId(20210); // Quận 10
                addr4.setGhnWardCode("904220"); // Phường 5
                addr4.setIsDefault(true);
                addr4.setAddressType("HOME");
                addr4.setCreatedAt(new Date());
                addr4.setUpdatedAt(new Date());
                customerAddressRepository.save(addr4);
            }

            // ===== KHÁCH HÀNG 5: Hoàng Văn E (Khách đăng ký) =====
            if (customerRepository.findByEmail("hoangvane@gmail.com").isEmpty()) {
                Customer c5 = new Customer();
                c5.setFullName("Hoàng Văn E");
                c5.setEmail("hoangvane@gmail.com");
                c5.setHashPassword(passwordEncoder.encode("password123"));
                c5.setCustomerType(CustomerType.REGISTERED);
                c5.setEmailConfirmed(true);
                c5.setPhone("0945678901");
                c5.setGender("Nam");
                c5.setIsActive(true);
                c5.setCreatedAt(new Date());
                c5.setUpdatedAt(new Date());
                Customer savedC5 = customerRepository.save(c5);
                
                CustomerAddress addr5 = new CustomerAddress();
                addr5.setCustomer(savedC5);
                addr5.setAddress("654 Võ Văn Tần, Phường 6, Quận 3");
                addr5.setGhnProvinceId(202); // TP.HCM
                addr5.setGhnDistrictId(20203); // Quận 3
                addr5.setGhnWardCode("904234"); // Phường 6
                addr5.setIsDefault(true);
                addr5.setAddressType("HOME");
                addr5.setCreatedAt(new Date());
                addr5.setUpdatedAt(new Date());
                customerAddressRepository.save(addr5);
            }

            // ===== KHÁCH HÀNG 6: Vũ Thị F (Khách đăng ký - Tài khoản bị khoá) =====
            if (customerRepository.findByEmail("vuthif@gmail.com").isEmpty()) {
                Customer c6 = new Customer();
                c6.setFullName("Vũ Thị F");
                c6.setEmail("vuthif@gmail.com");
                c6.setHashPassword(passwordEncoder.encode("password123"));
                c6.setCustomerType(CustomerType.REGISTERED);
                c6.setEmailConfirmed(true);
                c6.setPhone("0956789012");
                c6.setGender("Nữ");
                c6.setIsActive(false);
                c6.setCreatedAt(new Date());
                c6.setUpdatedAt(new Date());
                Customer savedC6 = customerRepository.save(c6);
                
                CustomerAddress addr6 = new CustomerAddress();
                addr6.setCustomer(savedC6);
                addr6.setAddress("987 Cách Mạng Tháng 8, Phường 14, Quận 10");
                addr6.setGhnProvinceId(202); // TP.HCM
                addr6.setGhnDistrictId(20210); // Quận 10
                addr6.setGhnWardCode("904223"); // Phường 14
                addr6.setIsDefault(true);
                addr6.setAddressType("HOME");
                addr6.setCreatedAt(new Date());
                addr6.setUpdatedAt(new Date());
                customerAddressRepository.save(addr6);
            }

            // ===== KHÁCH VÃNG LAI 1: Ngô Tấn Phú (Không đăng ký) =====
            if (customerRepository.findByEmail("phung@gmail.com").isEmpty()) {
                Customer guest1 = new Customer();
                guest1.setFullName("Ngô Tấn Phú");
                guest1.setEmail("phung@gmail.com");
                guest1.setHashPassword(null); // Khách vãng lai không có mật khẩu
                guest1.setCustomerType(CustomerType.GUEST);
                guest1.setEmailConfirmed(null);
                guest1.setPhone("0967890123");
                guest1.setGender("Nam");
                guest1.setIsActive(true);
                guest1.setCreatedAt(new Date());
                guest1.setUpdatedAt(new Date());
                Customer savedGuest1 = customerRepository.save(guest1);
                
                CustomerAddress addrGuest1 = new CustomerAddress();
                addrGuest1.setCustomer(savedGuest1);
                addrGuest1.setAddress("100 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh");
                addrGuest1.setGhnProvinceId(202);
                addrGuest1.setGhnDistrictId(20217);
                addrGuest1.setGhnWardCode("904238");
                addrGuest1.setIsDefault(true);
                addrGuest1.setAddressType("HOME");
                addrGuest1.setCreatedAt(new Date());
                addrGuest1.setUpdatedAt(new Date());
                customerAddressRepository.save(addrGuest1);
            }

            // ===== KHÁCH VÃNG LAI 2: Trương Thị Hồng (Không đăng ký) =====
            if (customerRepository.findByEmail("hong@example.com").isEmpty()) {
                Customer guest2 = new Customer();
                guest2.setFullName("Trương Thị Hồng");
                guest2.setEmail("hong@example.com");
                guest2.setHashPassword(null);
                guest2.setCustomerType(CustomerType.GUEST);
                guest2.setEmailConfirmed(null);
                guest2.setPhone("0978901234");
                guest2.setGender("Nữ");
                guest2.setIsActive(true);
                guest2.setCreatedAt(new Date());
                guest2.setUpdatedAt(new Date());
                Customer savedGuest2 = customerRepository.save(guest2);
                
                CustomerAddress addrGuest2 = new CustomerAddress();
                addrGuest2.setCustomer(savedGuest2);
                addrGuest2.setAddress("500 Lê Lợi, Quận 1, TP.HCM");
                addrGuest2.setGhnProvinceId(202);
                addrGuest2.setGhnDistrictId(20202);
                addrGuest2.setGhnWardCode("904227");
                addrGuest2.setIsDefault(true);
                addrGuest2.setAddressType("HOME");
                addrGuest2.setCreatedAt(new Date());
                addrGuest2.setUpdatedAt(new Date());
                customerAddressRepository.save(addrGuest2);
            }

            logger.info("Successfully seeded customers with addresses!");
            }
        };
    }
}
