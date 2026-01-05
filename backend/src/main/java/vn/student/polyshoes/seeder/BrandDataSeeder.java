package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Brand;
import vn.student.polyshoes.repository.BrandRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Date;

/**
 * Seeder dùng để khởi tạo dữ liệu thương hiệu giày
 * Tự động chạy khi ứng dụng khởi động nếu bảng brand còn trống
 */
@Component
@Configuration
public class BrandDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(BrandDataSeeder.class);

    @Bean
    CommandLineRunner seedBrands(BrandRepository brandRepository) {
        return args -> {
            if (brandRepository.count() == 0) {
                logger.info("Bắt đầu khởi tạo dữ liệu thương hiệu giày chuyên nghiệp...");

                // Danh sách các thương hiệu giày nổi tiếng thế giới và Việt Nam
                List<String> brandNames = Arrays.asList(
                    // Thương hiệu thể thao quốc tế
                    "Nike",
                    "Adidas", 
                    "Puma",
                    "Reebok",
                    "Under Armour",
                    "New Balance",
                    "ASICS",
                    "Mizuno",
                    "Saucony",
                    "Brooks",
                    
                    // Thương hiệu lifestyle và street wear
                    "Converse",
                    "Vans",
                    "Fila",
                    "Kappa",
                    "Champion",
                    
                    // Thương hiệu outdoor và boots
                    "Timberland",
                    "Dr. Martens",
                    "Clarks",
                    "Palladium",
                    
                    // Thương hiệu cao cấp
                    "Gucci",
                    "Louis Vuitton",
                    "Balenciaga",
                    "Golden Goose",
                    
                    // Thương hiệu Việt Nam
                    "Biti's",
                    "Ananas",
                    "Juno",
                    "Juno Men"
                );

                int brandCount = 0;
                for (String brandName : brandNames) {
                    Brand brand = new Brand();
                    brand.setBrandName(brandName);
                    brand.setIsActive(true);
                    brand.setCreatedAt(new Date());
                    brand.setUpdatedAt(new Date());
                    brandRepository.save(brand);
                    brandCount++;
                    logger.debug("Đã tạo thương hiệu: {}", brandName);
                }

                logger.info("Đã khởi tạo thành công {} thương hiệu giày!", brandCount);
            } else {
                logger.info("Dữ liệu thương hiệu đã tồn tại, bỏ qua khởi tạo.");
            }
        };
    }
}
