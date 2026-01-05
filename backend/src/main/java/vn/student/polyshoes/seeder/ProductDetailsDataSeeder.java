package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.model.ProductDetails;
import vn.student.polyshoes.model.ProductImage;
import vn.student.polyshoes.model.Color;
import vn.student.polyshoes.model.Size;
import vn.student.polyshoes.repository.ProductRepository;
import vn.student.polyshoes.repository.ProductDetailsRepository;
import vn.student.polyshoes.repository.ProductImageRepository;
import vn.student.polyshoes.repository.ColorRepository;
import vn.student.polyshoes.repository.SizeRepository;

import java.util.List;
import java.util.Date;
import java.util.Random;

/**
 * Seeder dữ liệu ProductDetails và ProductImage chuyên nghiệp
 * Tự động chạy khi ứng dụng khởi động nếu bảng product_details còn trống
 * Tạo các biến thể màu sắc và kích cỡ phù hợp cho từng loại giày
 * Sử dụng ảnh random từ picsum.photos cho tất cả sản phẩm
 */
@Component
@Configuration
public class ProductDetailsDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ProductDetailsDataSeeder.class);
    
    private final Random random = new Random();

    @Bean
    CommandLineRunner seedProductDetails(
            ProductDetailsRepository productDetailsRepository,
            ProductImageRepository productImageRepository,
            ProductRepository productRepository,
            ColorRepository colorRepository,
            SizeRepository sizeRepository) {
        return args -> {
            logger.info("Bắt đầu khởi tạo dữ liệu chi tiết sản phẩm...");
            
            if (productDetailsRepository.count() == 0) {
                List<Product> products = productRepository.findAll();
                List<Color> colors = colorRepository.findAll();
                List<Size> sizes = sizeRepository.findAll();

                if (products.isEmpty() || colors.isEmpty() || sizes.isEmpty()) {
                    logger.warn("Vui lòng seed products, colors và sizes trước!");
                    return;
                }

                int totalProductDetails = 0;
                int totalProductImages = 0;

                // Tạo ProductDetails và ProductImage cho từng sản phẩm
                for (Product product : products) {
                    int[] counts = createProductDetailsForProduct(
                            productDetailsRepository,
                            productImageRepository,
                            product,
                            colors,
                            sizes);
                    totalProductDetails += counts[0];
                    totalProductImages += counts[1];
                }

                logger.info("Đã khởi tạo thành công {} chi tiết sản phẩm và {} hình ảnh!", 
                    totalProductDetails, totalProductImages);
            } else {
                logger.info("Dữ liệu chi tiết sản phẩm đã tồn tại, bỏ qua khởi tạo.");
            }
        };
    }

    /**
     * Tạo ProductDetails và ProductImage cho một sản phẩm cụ thể
     */
    private int[] createProductDetailsForProduct(
            ProductDetailsRepository productDetailsRepository,
            ProductImageRepository productImageRepository,
            Product product,
            List<Color> colors,
            List<Size> sizes) {
        
        int productDetailsCount = 0;
        int productImagesCount = 0;
        
        // Xác định số lượng màu và size phù hợp với từng loại sản phẩm
        String productName = product.getProductName().toLowerCase();
        
        int colorCount = determineColorCount(productName);
        int sizeRangeType = determineSizeRange(productName);
        
        // Chọn màu ngẫu nhiên phù hợp
        List<Color> selectedColors = selectAppropriateColors(colors, colorCount, productName);
        
        // Chọn size phù hợp
        List<Size> selectedSizes = selectAppropiateSizes(sizes, sizeRangeType);
        
        // Tạo ProductDetails cho mỗi kết hợp màu-size
        for (Color color : selectedColors) {
            for (Size size : selectedSizes) {
                ProductDetails productDetails = new ProductDetails();
                productDetails.setProduct(product);
                productDetails.setColor(color);
                productDetails.setSize(size);
                
                // Tạo số lượng tồn kho phù hợp với giá sản phẩm
                int stock = determineStock(product.getSellingPrice(), productName);
                productDetails.setStockQuantity(stock);
                
                productDetails.setIsActive(true);
                productDetails.setCreatedAt(new Date());
                productDetails.setUpdatedAt(new Date());
                
                productDetailsRepository.save(productDetails);
                productDetailsCount++;
            }
            
            // Tạo hình ảnh cho mỗi màu (2-4 hình/màu)
            int imageCount = 2 + random.nextInt(3); // 2-4 hình
            for (int imgIdx = 0; imgIdx < imageCount; imgIdx++) {
                ProductImage productImage = new ProductImage();
                productImage.setProduct(product);
                
                // Tạo URL hình ảnh với pattern thực tế
                String imageUrl = generateImageUrl(product, color, imgIdx);
                productImage.setImageUrl(imageUrl);
                productImage.setIsMainImage(imgIdx == 0); // Hình đầu tiên là main
                productImage.setCreatedAt(new Date());
                productImage.setUpdatedAt(new Date());
                
                productImageRepository.save(productImage);
                productImagesCount++;
            }
        }
        
        logger.debug("Đã tạo {} chi tiết và {} hình ảnh cho sản phẩm: {}", 
            productDetailsCount, productImagesCount, product.getProductName());
        
        return new int[]{productDetailsCount, productImagesCount};
    }

    /**
     * Xác định số lượng màu phù hợp cho sản phẩm
     */
    private int determineColorCount(String productName) {
        if (productName.contains("gucci") || productName.contains("luxury")) {
            return 1 + random.nextInt(2); // 1-2 màu cho hàng luxury
        } else if (productName.contains("kids") || productName.contains("trẻ em")) {
            return 3 + random.nextInt(3); // 3-5 màu cho trẻ em
        } else if (productName.contains("chạy") || productName.contains("thể thao")) {
            return 2 + random.nextInt(3); // 2-4 màu cho giày thể thao
        } else {
            return 2 + random.nextInt(2); // 2-3 màu cho các loại khác
        }
    }

    /**
     * Xác định loại range size (0=nữ, 1=nam, 2=trẻ em)
     */
    private int determineSizeRange(String productName) {
        if (productName.contains("kids") || productName.contains("trẻ em") || productName.contains("bé")) {
            return 2; // Size trẻ em
        } else if (productName.contains("cao gót") || productName.contains("nữ")) {
            return 0; // Size nữ
        } else {
            return 1; // Size nam (hoặc unisex)
        }
    }

    /**
     * Chọn màu phù hợp với sản phẩm
     */
    private List<Color> selectAppropriateColors(List<Color> allColors, int count, String productName) {
        List<Color> appropriateColors = allColors.stream()
            .filter(color -> isColorAppropriate(color.getColorName(), productName))
            .limit(Math.max(count, 1))
            .toList();
            
        // Nếu không có màu phù hợp, chọn màu cơ bản
        if (appropriateColors.isEmpty()) {
            appropriateColors = allColors.stream()
                .filter(color -> isBasicColor(color.getColorName()))
                .limit(count)
                .toList();
        }
        
        return appropriateColors;
    }

    /**
     * Kiểm tra màu có phù hợp với sản phẩm không
     */
    private boolean isColorAppropriate(String colorName, String productName) {
        if (productName.contains("luxury") || productName.contains("gucci") || productName.contains("louis")) {
            return colorName.equals("Đen") || colorName.equals("Trắng") || colorName.equals("Bạc");
        }
        if (productName.contains("kids") || productName.contains("trẻ em")) {
            return !colorName.equals("Đen đỏ") && !colorName.contains("Gradient");
        }
        if (productName.contains("công sở") || productName.contains("oxford")) {
            return colorName.equals("Đen") || colorName.equals("Nâu") || colorName.equals("Nâu đậm");
        }
        return true; // Các sản phẩm khác chấp nhận mọi màu
    }

    /**
     * Kiểm tra có phải màu cơ bản không
     */
    private boolean isBasicColor(String colorName) {
        return colorName.equals("Đen") || colorName.equals("Trắng") || 
               colorName.equals("Xám") || colorName.equals("Nâu");
    }

    /**
     * Chọn size phù hợp theo range
     */
    private List<Size> selectAppropiateSizes(List<Size> allSizes, int rangeType) {
        return switch (rangeType) {
            case 0 -> // Size nữ: 35-40
                allSizes.stream()
                    .filter(size -> {
                        try {
                            double s = Double.parseDouble(size.getSizeValue());
                            return s >= 35 && s <= 40;
                        } catch (NumberFormatException e) {
                            return false;
                        }
                    })
                    .toList();
            case 1 -> // Size nam: 39-46
                allSizes.stream()
                    .filter(size -> {
                        try {
                            double s = Double.parseDouble(size.getSizeValue());
                            return s >= 39 && s <= 46;
                        } catch (NumberFormatException e) {
                            return false;
                        }
                    })
                    .toList();
            case 2 -> // Size trẻ em: 35-38
                allSizes.stream()
                    .filter(size -> {
                        try {
                            double s = Double.parseDouble(size.getSizeValue());
                            return s >= 35 && s <= 38;
                        } catch (NumberFormatException e) {
                            return false;
                        }
                    })
                    .toList();
            default -> allSizes.subList(0, Math.min(8, allSizes.size()));
        };
    }

    /**
     * Xác định số lượng tồn kho dựa trên giá sản phẩm
     */
    private int determineStock(long price, String productName) {
        if (price >= 10000000) { // Hàng luxury
            return 1 + random.nextInt(5); // 1-5 
        } else if (price >= 5000000) { // Hàng cao cấp
            return 3 + random.nextInt(8); // 3-10
        } else if (price >= 2000000) { // Hàng trung cấp
            return 5 + random.nextInt(15); // 5-20
        } else { // Hàng phổ thông
            return 10 + random.nextInt(20); // 10-30
        }
    }

    /**
     * Tạo URL hình ảnh từ picsum.photos
     */
    private String generateImageUrl(Product product, Color color, int imageIndex) {
        // Sử dụng productId + colorId + imageIndex làm seed để đảm bảo ảnh consistent
        int productId = product.getProductId() != null ? product.getProductId() : 1000;
        int colorId = color.getColorId() != null ? color.getColorId() : 1;
        int seed = productId * 100 + colorId * 10 + imageIndex;
        
        return String.format("https://picsum.photos/seed/%d/600/600", seed);
    }
}