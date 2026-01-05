package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.ProductImage;
import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.repository.ProductImageRepository;
import vn.student.polyshoes.repository.ProductRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;

/**
 * Seeder dùng để khởi tạo dữ liệu hình ảnh sản phẩm random từ picsum.photos
 * KHÔNG SỬ DỤNG NỮA - Đã được tích hợp vào ProductDetailsDataSeeder
 * Tự động chạy khi ứng dụng khởi động nếu bảng product_image còn trống
 * Mỗi sản phẩm có 3 ảnh random từ picsum.photos
 */
@Component
@Configuration
public class ProductImageDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ProductImageDataSeeder.class);

    @Bean
    CommandLineRunner seedProductImages(
            ProductImageRepository productImageRepository,
            ProductRepository productRepository) {
        return args -> {
            if (productImageRepository.count() == 0) {
                logger.info("⚠️ CẢNH BÁO: ProductImageDataSeeder không nên chạy nữa!");
                logger.info("➡️ ProductDetailsDataSeeder đã tích hợp tạo ảnh picsum.photos!");
                logger.info("➡️ Bỏ qua việc seed ảnh để tránh xung đột...");
                return;
                
                // Code cũ được comment out để tránh xung đột
                /*
                logger.info("Bắt đầu khởi tạo dữ liệu hình ảnh sản phẩm random từ picsum.photos...");

                List<Product> products = productRepository.findAll();
                if (products.isEmpty()) {
                    logger.warn("Không có sản phẩm nào! Vui lòng seed sản phẩm trước.");
                    return;
                }

                List<ProductImage> imagesToSave = new ArrayList<>();
                
                for (Product product : products) {
                    // Mỗi sản phẩm có 3 ảnh random
                    for (int i = 0; i < 3; i++) {
                        ProductImage img = new ProductImage();
                        img.setProduct(product);
                        
                        // Sinh URL ảnh random từ picsum.photos
                        // Sử dụng productId + index làm seed để luôn consistent
                        int seed = (product.getProductId() != null ? product.getProductId() : 1000) * 10 + i;
                        String imageUrl = String.format("https://picsum.photos/seed/%d/600/600", seed);
                        
                        img.setImageUrl(imageUrl);
                        img.setIsMainImage(i == 0); // Ảnh đầu tiên là main image
                        img.setCreatedAt(new Date());
                        img.setUpdatedAt(new Date());
                        imagesToSave.add(img);
                        
                        logger.debug("Tạo ảnh cho sản phẩm {}: {}", product.getProductName(), imageUrl);
                    }
                }
                
                productImageRepository.saveAll(imagesToSave);
                logger.info("Đã khởi tạo {} hình ảnh sản phẩm random từ picsum.photos thành công!", imagesToSave.size());
                */
            } else {
                logger.info("Dữ liệu hình ảnh sản phẩm đã tồn tại, bỏ qua khởi tạo.");
            }
        };
    }
}
