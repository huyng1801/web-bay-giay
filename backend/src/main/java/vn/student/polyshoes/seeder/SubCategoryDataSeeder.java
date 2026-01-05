package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.SubCategory;
import vn.student.polyshoes.model.Category;
import vn.student.polyshoes.repository.SubCategoryRepository;
import vn.student.polyshoes.repository.CategoryRepository;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;
import java.util.Date;
import vn.student.polyshoes.enums.Gender;

/**
 * Seeder dùng để khởi tạo dữ liệu danh mục con (SubCategory)
 * Tự động chạy khi ứng dụng khởi động nếu bảng sub_category còn trống
 */
@Component
@Configuration
public class SubCategoryDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(SubCategoryDataSeeder.class);

    @Bean
    CommandLineRunner seedSubCategories(
            SubCategoryRepository subCategoryRepository,
            CategoryRepository categoryRepository) {
        return args -> {
            if (subCategoryRepository.count() == 0) {
                logger.info("Bắt đầu khởi tạo dữ liệu danh mục con...");

                List<Category> categories = categoryRepository.findAll();
                if (categories.isEmpty()) {
                    logger.warn("No categories found! Please seed categories first.");
                    return;
                }

                // Ánh xạ danh mục con chuyên nghiệp cho từng danh mục chính
                Map<String, List<String>> subCategoryMap = new HashMap<>();
                
                // Giày thể thao - các hoạt động thể thao cụ thể
                subCategoryMap.put("Giày thể thao", Arrays.asList(
                    "Giày chạy bộ",
                    "Giày bóng rổ", 
                    "Giày bóng đá",
                    "Giày tennis/cầu lông",
                    "Giày training/gym",
                    "Giày đá cầu",
                    "Giày volleyball"
                ));
                
                // Giày lifestyle - phong cách sống hàng ngày
                subCategoryMap.put("Giày lifestyle", Arrays.asList(
                    "Sneaker thời trang",
                    "Giày canvas",
                    "Giày slip-on",
                    "Giày skate",
                    "Giày retro/vintage"
                ));
                
                // Giày công sở - môi trường làm việc chuyên nghiệp
                subCategoryMap.put("Giày công sở", Arrays.asList(
                    "Giày da nam",
                    "Giày cao gót nữ",
                    "Giày oxford",
                    "Giày loafer",
                    "Giày mọi công sở"
                ));
                
                // Giày outdoor - hoạt động ngoài trời
                subCategoryMap.put("Giày outdoor", Arrays.asList(
                    "Giày leo núi/hiking",
                    "Giày chạy trail",
                    "Giày trekking",
                    "Giày thể thao nước",
                    "Giày dã ngoại"
                ));
                
                // Giày cao gót - thời trang nữ
                subCategoryMap.put("Giày cao gót", Arrays.asList(
                    "Cao gót 5-7cm",
                    "Cao gót 8-10cm",
                    "Cao gót trên 10cm",
                    "Giày búp bê",
                    "Giày Mary Jane"
                ));
                
                // Sandal & Dép - giày hở
                subCategoryMap.put("Sandal & Dép", Arrays.asList(
                    "Dép thể thao",
                    "Sandal nữ",
                    "Dép lào/flip-flop",
                    "Sandal cao gót",
                    "Dép massage"
                ));
                
                // Giày boot - giày cao cổ
                subCategoryMap.put("Giày boot", Arrays.asList(
                    "Boot da thật",
                    "Boot Chelsea",
                    "Boot công sở",
                    "Boot thời trang",
                    "Boot an toàn lao động"
                ));
                
                // Giày trẻ em - theo độ tuổi
                subCategoryMap.put("Giày trẻ em", Arrays.asList(
                    "Giày bé trai (1-6 tuổi)",
                    "Giày bé gái (1-6 tuổi)", 
                    "Giày học sinh (7-12 tuổi)",
                    "Giày teen (13-17 tuổi)"
                ));
                
                // Phụ kiện giày
                subCategoryMap.put("Phụ kiện giày", Arrays.asList(
                    "Đệm lót giày",
                    "Dây giày",
                    "Xi đánh giày",
                    "Thuốc khử mùi",
                    "Túi đựng giày"
                ));

                int totalSubCategories = 0;
                for (Category category : categories) {
                    List<String> subCategories = subCategoryMap.get(category.getCategoryName());
                    if (subCategories != null) {
                        for (String subCatName : subCategories) {
                            SubCategory subCategory = new SubCategory();
                            subCategory.setSubCategoryName(subCatName);
                            subCategory.setCategory(category);
                            // Set gender (gioi_tinh) mặc định là UNISEX
                            subCategory.setGender(Gender.UNISEX);
                            subCategory.setIsActive(true);
                            subCategory.setCreatedAt(new Date());
                            subCategory.setUpdatedAt(new Date());
                            subCategoryRepository.save(subCategory);
                            totalSubCategories++;
                            logger.debug("Đã tạo danh mục con: {} thuộc {}", subCatName, category.getCategoryName());
                        }
                    }
                }

                logger.info("Đã khởi tạo thành công {} danh mục con!", totalSubCategories);
            } else {
                logger.info("Dữ liệu danh mục con đã tồn tại, bỏ qua khởi tạo.");
            }
        };
    }
}
