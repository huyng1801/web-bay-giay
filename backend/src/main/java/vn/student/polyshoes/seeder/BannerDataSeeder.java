package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Banner;
import vn.student.polyshoes.repository.BannerRepository;

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
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedBanners(BannerRepository bannerRepository) {
        return args -> {
            if (bannerRepository.count() == 0) { // Ngăn chặn tạo dữ liệu trùng lặp

                // Tạo banner quảng cáo sản phẩm mới
                Banner banner1 = new Banner();
                banner1.setTitle("polyshoes - Quần Áo Mới Nhất");
                banner1.setImageUrl("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1920&q=80");
                banner1.setLink("http://localhost:3000/products?brand=nike");
                banner1.setIsActive(true);
                banner1.setCreatedAt(new Date());
                banner1.setUpdatedAt(new Date());

                // Tạo banner khuyến mại giảm giá 50%
                Banner banner2 = new Banner();
                banner2.setTitle("polyshoes - Sale 50%");
                banner2.setImageUrl("https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1920&q=80");
                banner2.setLink("http://localhost:3000/products?brand=adidas");
                banner2.setIsActive(true);
                banner2.setCreatedAt(new Date());
                banner2.setUpdatedAt(new Date());

                // Tạo banner giày thể thao nam
                Banner banner3 = new Banner();
                banner3.setTitle("polyshoes - Thể Thao Nam");
                banner3.setImageUrl("https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1920&q=80");
                banner3.setLink("http://localhost:3000/products?category=giay-the-thao&gender=male");
                banner3.setIsActive(true);
                banner3.setCreatedAt(new Date());
                banner3.setUpdatedAt(new Date());

                // Tạo banner mùa thu
                Banner banner4 = new Banner();
                banner4.setTitle("polyshoes - Mùa Thu 2024");
                banner4.setImageUrl("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80");
                banner4.setLink("http://localhost:3000/products?season=autumn");
                banner4.setIsActive(true);
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
