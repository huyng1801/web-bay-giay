package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Banner;
import vn.student.polyshoes.model.AdminUser;
import vn.student.polyshoes.repository.BannerRepository;
import vn.student.polyshoes.repository.AdminUserRepository;

import java.util.Date;

/**
 * Seeder dùng để khởi tạo dữ liệu banner quảng cáo
 * Tự động chạy khi ứng dụng khởi động nếu bảng banner còn trống
 */
@Component
public class BannerDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(BannerDataSeeder.class);

    /**
     * Khởi tạo các banner quảng cáo cho trang web
     * @param bannerRepository Repository dùng để lưu banner
     * @param adminUserRepository Repository dùng để tìm admin user
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedBanners(BannerRepository bannerRepository, AdminUserRepository adminUserRepository) {
        return args -> {
            if (bannerRepository.count() == 0) { // Ngăn chặn tạo dữ liệu trùng lặp

                // Tìm admin user đầu tiên để gán làm người tạo banner
                AdminUser systemAdmin = adminUserRepository.findAll().stream().findFirst().orElse(null);

                // Tạo banner quảng cáo sản phẩm mới Nike
                Banner banner1 = new Banner();
                banner1.setTitle("Giày Thể Thao Nike - Mới Nhất 2024");
                banner1.setImageUrl("https://picsum.photos/seed/banner1/1920/600");
                banner1.setLink("http://localhost:3000/products?brand=Nike");
                banner1.setIsActive(true);
                banner1.setCreatedBy(systemAdmin);
                banner1.setUpdatedBy(systemAdmin);
                banner1.setCreatedAt(new Date());
                banner1.setUpdatedAt(new Date());

                // Tạo banner khuyến mại giảm giá
                Banner banner2 = new Banner();
                banner2.setTitle("Sale Lớn - Giảm Giá Tới 50%");
                banner2.setImageUrl("https://picsum.photos/seed/banner2/1920/600");
                banner2.setLink("http://localhost:3000/products?discount=true");
                banner2.setIsActive(true);
                banner2.setCreatedBy(systemAdmin);
                banner2.setUpdatedBy(systemAdmin);
                banner2.setCreatedAt(new Date());
                banner2.setUpdatedAt(new Date());

                // Tạo banner bộ sưu tập Adidas
                Banner banner3 = new Banner();
                banner3.setTitle("Bộ Sưu Tập Adidas - Chất Lượng Vượt Trội");
                banner3.setImageUrl("https://picsum.photos/seed/banner3/1920/600");
                banner3.setLink("http://localhost:3000/products?brand=Adidas");
                banner3.setIsActive(true);
                banner3.setCreatedBy(systemAdmin);
                banner3.setUpdatedBy(systemAdmin);
                banner3.setCreatedAt(new Date());
                banner3.setUpdatedAt(new Date());

                // Tạo banner giày cao gót nữ
                Banner banner4 = new Banner();
                banner4.setTitle("Giày Cao Gót Nữ - Thanh Lịch & Quyền Rũ");
                banner4.setImageUrl("https://picsum.photos/seed/banner4/1920/600");
                banner4.setLink("http://localhost:3000/products?subcategory=cao-goc");
                banner4.setIsActive(true);
                banner4.setCreatedBy(systemAdmin);
                banner4.setUpdatedBy(systemAdmin);
                banner4.setCreatedAt(new Date());
                banner4.setUpdatedAt(new Date());
                
                // Lưu các banner vào database
                bannerRepository.save(banner1);
                bannerRepository.save(banner2);
                bannerRepository.save(banner3);
                bannerRepository.save(banner4);
               
               
                logger.info("Các banner quảng cáo đã được khởi tạo thành công!");
            }
        };
    }
}
