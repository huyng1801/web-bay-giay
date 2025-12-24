package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Guest;
import vn.student.polyshoes.repository.GuestRepository;

import java.util.Date;

/**
 * Seeder dùng để khởi tạo dữ liệu khách vãng lai
 * Tự động chạy khi ứng dụng khởi động nếu bảng guest còn trống
 * Tạo các bản ghi khách hàng mua hàng mà không đăng ký tài khoản
 */
@Component
@Configuration
public class GuestDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(GuestDataSeeder.class);

    /**
     * Khởi tạo dữ liệu khách vãng lai
     * @param guestRepository Repository dùng để lưu khách vãng lai
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedGuests(GuestRepository guestRepository) {
        return args -> {
            logger.info("Bắt đầu khởi tạo dữ liệu khách vãng lai...");
            
            // Kiểm tra xem bảng guest đã có dữ liệu hay chưa
            if (guestRepository.count() == 0) {

            // ===== KHÁCH VÃNG LAI 1 =====
            if (guestRepository.findByEmail("truongminhd@yahoo.com").isEmpty()) {
                Guest g1 = new Guest();
                g1.setFullName("Trương Minh Đức");
                g1.setEmail("truongminhd@yahoo.com");  // Email có thể để trống, nhưng ở đây có
                g1.setPhone("0987654321");
                g1.setAddress("100 Trần Bình Trọng, Phường 7");
                g1.setAddress2("Near Saigon Center");
                g1.setCity("Quận 1, TP.HCM");
                g1.setCreatedAt(new Date());
                g1.setUpdatedAt(new Date());
                guestRepository.save(g1);
            }

            // ===== KHÁCH VÃNG LAI 2 =====
            if (guestRepository.findByPhone("0976543210").isEmpty()) {
                Guest g2 = new Guest();
                g2.setFullName("Võ Hương Giang");
                g2.setEmail("");  // Khách không cung cấp email
                g2.setPhone("0976543210");
                g2.setAddress("200 Nguyễn Thị Minh Khai, Quận 1");
                g2.setAddress2("");  // Không có địa chỉ thứ 2
                g2.setCity("Quận 1, TP.HCM");
                g2.setCreatedAt(new Date());
                g2.setUpdatedAt(new Date());
                guestRepository.save(g2);
            }

            // ===== KHÁCH VÃNG LAI 3 =====
            if (guestRepository.findByEmail("duongtheh@gmail.com").isEmpty()) {
                Guest g3 = new Guest();
                g3.setFullName("Dương Thế Hùng");
                g3.setEmail("duongtheh@gmail.com");
                g3.setPhone("0965432109");
                g3.setAddress("300 Pasteur, Phường 9");
                g3.setAddress2("Shop House, Diamond Plaza");
                g3.setCity("Quận 1, TP.HCM");
                g3.setCreatedAt(new Date());
                g3.setUpdatedAt(new Date());
                guestRepository.save(g3);
            }

            // ===== KHÁCH VÃNG LAI 4 =====
            if (guestRepository.findByEmail("lythimykhanh@hotmail.com").isEmpty()) {
                Guest g4 = new Guest();
                g4.setFullName("Lý Thị Mỹ Khanh");
                g4.setEmail("lythimykhanh@hotmail.com");
                g4.setPhone("0954321098");
                g4.setAddress("400 Hai Bà Trưng, Phường 12");
                g4.setAddress2("Apartment 8B, Vân Đồn Plaza");
                g4.setCity("Quận 10, TP.HCM");
                g4.setCreatedAt(new Date());
                g4.setUpdatedAt(new Date());
                guestRepository.save(g4);
            }

            // ===== KHÁCH VÃNG LAI 5 =====
            if (guestRepository.findByPhone("0943210987").isEmpty()) {
                Guest g5 = new Guest();
                g5.setFullName("Phan Đức Thắng");
                g5.setEmail("");  // Không có email
                g5.setPhone("0943210987");
                g5.setAddress("500 Số 3 Hoàng Hoa Thám, Phường 12");
                g5.setAddress2("Office");
                g5.setCity("Quận 10, TP.HCM");
                g5.setCreatedAt(new Date());
                g5.setUpdatedAt(new Date());
                guestRepository.save(g5);
            }

            logger.info("Successfully seeded guest customers!");
            }
        };
    }
}
