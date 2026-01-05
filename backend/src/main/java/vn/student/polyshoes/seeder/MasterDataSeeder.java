package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.repository.*;

/**
 * Seeder chính để kiểm tra và điều phối việc seed dữ liệu theo thứ tự đúng
 * Đảm bảo các bảng được seed theo dependency order: Brand → Category → SubCategory → Color → Size → Product → ProductDetails → ProductImage
 */
@Component  
@Configuration
public class MasterDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(MasterDataSeeder.class);

    @Bean
    @Order(0) // Chạy trước tất cả seeder khác
    CommandLineRunner checkDatabaseState(
            BrandRepository brandRepository,
            CategoryRepository categoryRepository, 
            SubCategoryRepository subCategoryRepository,
            ColorRepository colorRepository,
            SizeRepository sizeRepository,
            ProductRepository productRepository,
            ProductDetailsRepository productDetailsRepository,
            ProductImageRepository productImageRepository) {
        return args -> {
            logger.info("=".repeat(80));
            logger.info("            KIỂM TRA TRẠNG THÁI DỮ LIỆU WEBSITE BÁN GIÀY");
            logger.info("=".repeat(80));
            
            // Kiểm tra từng bảng và hiển thị số lượng record
            checkTableStatus("BRANDS (Thương hiệu)", brandRepository.count());
            checkTableStatus("CATEGORIES (Danh mục)", categoryRepository.count());  
            checkTableStatus("SUB_CATEGORIES (Danh mục con)", subCategoryRepository.count());
            checkTableStatus("COLORS (Màu sắc)", colorRepository.count());
            checkTableStatus("SIZES (Kích cỡ)", sizeRepository.count());
            checkTableStatus("PRODUCTS (Sản phẩm)", productRepository.count());
            checkTableStatus("PRODUCT_DETAILS (Chi tiết sản phẩm)", productDetailsRepository.count());
            checkTableStatus("PRODUCT_IMAGES (Hình ảnh)", productImageRepository.count());
            
            logger.info("=".repeat(80));
            logger.info("            THỨ TỰ SEED DỮ LIỆU ĐƯỢC ĐỀ XUẤT");
            logger.info("=".repeat(80));
            logger.info("1. BrandDataSeeder        → Tạo các thương hiệu giày");
            logger.info("2. CategoryDataSeeder     → Tạo danh mục chính");
            logger.info("3. SubCategoryDataSeeder  → Tạo danh mục con (phụ thuộc Category)"); 
            logger.info("4. ColorDataSeeder        → Tạo màu sắc giày");
            logger.info("5. SizeDataSeeder         → Tạo kích cỡ giày");
            logger.info("6. ProductDataSeeder      → Tạo sản phẩm (phụ thuộc Brand, SubCategory)");
            logger.info("7. ProductDetailsDataSeeder → Tạo chi tiết sản phẩm và ảnh picsum.photos");
            logger.info("8. ProductImageDataSeeder → KHÔNG CẦN (đã tích hợp vào ProductDetails)");
            logger.info("=".repeat(80));
            
            // Kiểm tra tính toàn vẹn dữ liệu
            if (productRepository.count() > 0) {
                long productsWithoutDetails = productRepository.count() - 
                    productDetailsRepository.findAll().stream()
                        .map(pd -> pd.getProduct().getProductId())
                        .distinct()
                        .count();
                        
                if (productsWithoutDetails > 0) {
                    logger.warn("⚠️  CÓ {} SẢN PHẨM CHƯA CÓ CHI TIẾT! Hãy chạy ProductDetailsDataSeeder.", productsWithoutDetails);
                }
                
                long productsWithoutImages = productRepository.count() - 
                    productImageRepository.findAll().stream()
                        .map(pi -> pi.getProduct().getProductId())
                        .distinct()
                        .count();
                        
                if (productsWithoutImages > 0) {
                    logger.warn("⚠️  CÓ {} SẢN PHẨM CHƯA CÓ HÌNH ẢNH! Hãy chạy ProductDetailsDataSeeder.", productsWithoutImages);
                }
            }
            
            logger.info("=".repeat(80));
        };
    }

    private void checkTableStatus(String tableName, long count) {
        String status = count > 0 ? "✅ ĐÃ CÓ DỮ LIỆU" : "❌ TRỐNG";
        String countStr = count > 0 ? String.format("(%d records)", count) : "(0 records)";
        logger.info(String.format("%-35s %s %s", tableName, status, countStr));
    }
}