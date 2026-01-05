package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Category;
import vn.student.polyshoes.repository.CategoryRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Date;

/**
 * Seeder dùng để khởi tạo dữ liệu danh mục sản phẩm
 * Tự động chạy khi ứng dụng khởi động nếu bảng category còn trống
 */
@Component
@Configuration
public class CategoryDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(CategoryDataSeeder.class);

    @Bean
    CommandLineRunner seedCategories(CategoryRepository categoryRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                logger.info("Bắt đầu khởi tạo dữ liệu danh mục sản phẩm...");

                // Danh sách các danh mục chính cho website bán giày chuyên nghiệp
                List<String> categoryNames = Arrays.asList(
                    "Giày thể thao",           // Giày dành cho các hoạt động thể thao
                    "Giày lifestyle",         // Giày đời thường, thời trang
                    "Giày công sở",          // Giày lịch sự cho môi trường công sở
                    "Giày outdoor",          // Giày dã ngoại, leo núi
                    "Giày cao gót",          // Giày cao gót nữ
                    "Sandal & Dép",          // Dép, sandal các loại
                    "Giày boot",             // Boot, bốt các loại
                    "Giày trẻ em",           // Giày dành cho trẻ em
                    "Phụ kiện giày"          // Phụ kiện: đệm, dây, xi đánh giày
                );

                int categoryCount = 0;
                for (String categoryName : categoryNames) {
                    Category category = new Category();
                    category.setCategoryName(categoryName);
                    category.setIsActive(true);
                    category.setCreatedAt(new Date());
                    category.setUpdatedAt(new Date());
                    categoryRepository.save(category);
                    categoryCount++;
                    logger.debug("Đã tạo danh mục: {}", categoryName);
                }

                logger.info("Đã khởi tạo thành công {} danh mục sản phẩm!", categoryCount);
            } else {
                logger.info("Dữ liệu danh mục đã tồn tại, bỏ qua khởi tạo.");
            }
        };
    }
}
