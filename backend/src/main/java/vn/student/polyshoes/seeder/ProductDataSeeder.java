package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.model.Brand;
import vn.student.polyshoes.model.SubCategory;
import vn.student.polyshoes.repository.ProductRepository;
import vn.student.polyshoes.repository.BrandRepository;
import vn.student.polyshoes.repository.SubCategoryRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;

/**
 * Seeder dữ liệu sản phẩm giày chuyên nghiệp cho website bán giày
 * Tự động chạy khi ứng dụng khởi động nếu bảng product còn trống
 * Tạo các sản phẩm giày đa dạng với thông tin chi tiết và giá cả hợp lý
 */
@Component
@Configuration
public class ProductDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ProductDataSeeder.class);

    @Bean
    CommandLineRunner seedProducts(
            ProductRepository productRepository,
            BrandRepository brandRepository,
            SubCategoryRepository subCategoryRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                logger.info("Bắt đầu khởi tạo dữ liệu sản phẩm giày chuyên nghiệp...");

                List<Brand> brands = brandRepository.findAll();
                List<SubCategory> subCategories = subCategoryRepository.findAll();

                if (brands.isEmpty() || subCategories.isEmpty()) {
                    logger.warn("Vui lòng seed brands và sub-categories trước!");
                    return;
                }

                List<Product> products = new ArrayList<>();

                // === GIÀY THÉ THAO ===
                
                // Nike products
                products.add(createProduct("Nike Air Zoom Pegasus 40", 
                    "Giày chạy bộ hàng ngày với đệm Zoom Air responsive. Phù hợp cho mọi cự ly từ 5K đến marathon. Upper breathable với lưới thoáng khí.", 
                    3200000, 15, "Nike", "Giày chạy bộ", subCategories, brands));
                    
                products.add(createProduct("Nike Air Jordan 1 Low", 
                    "Giày bóng rổ kinh điển với thiết kế low-top hiện đại. Da premium với đế Air-Sole êm ái.", 
                    2800000, 10, "Nike", "Giày bóng rổ", subCategories, brands));
                    
                products.add(createProduct("Nike Mercurial Vapor 15", 
                    "Giày đá bóng chuyên nghiệp với đinh TF phù hợp sân cỏ nhân tạo. Thiết kế nhẹ, ôm chân.", 
                    4500000, 8, "Nike", "Giày bóng đá", subCategories, brands));

                // Adidas products  
                products.add(createProduct("Adidas Ultraboost 23", 
                    "Giày chạy với công nghệ Boost energy return. Primeknit upper co giãn, hỗ trợ tốt cho chân.", 
                    3800000, 12, "Adidas", "Giày chạy bộ", subCategories, brands));
                    
                products.add(createProduct("Adidas Dame 8", 
                    "Giày bóng rổ signature của Damian Lillard. Bounce midsole phản hồi tốt, grip tuyệt vời.", 
                    3200000, 9, "Adidas", "Giày bóng rổ", subCategories, brands));

                // === GIÀY LIFESTYLE ===
                
                products.add(createProduct("Converse Chuck Taylor All Star Classic", 
                    "Sneaker canvas kinh điển không bao giờ lỗi mốt. Thiết kế vintage với đế cao su bền bỉ.", 
                    1800000, 20, "Converse", "Sneaker thời trang", subCategories, brands));
                    
                products.add(createProduct("Vans Old Skool", 
                    "Giày skate iconic với side stripe đặc trưng. Suede và canvas upper với waffle outsole.", 
                    2100000, 18, "Vans", "Giày skate", subCategories, brands));
                    
                products.add(createProduct("Ananas Basas Evergreen", 
                    "Giày canvas thân thiện môi trường làm từ chất liệu tái chế. Thiết kế trẻ trung, năng động.", 
                    650000, 40, "Ananas", "Giày slip-on", subCategories, brands));

                // === GIÀY CÔNG SỞ ===
                
                products.add(createProduct("Clarks Desert Boot", 
                    "Boot da lộn cao cấp phù hợp môi trường công sở. Thiết kế minimalist, đế crepe thoải mái.", 
                    3500000, 5, "Clarks", "Giày oxford", subCategories, brands));

                // === GIÀY CAO GÓT ===
                
                products.add(createProduct("Juno Cao Gót Nhọn 7cm", 
                    "Giày cao gót nữ thanh lịch với gót nhọn 7cm. Da mềm, lót êm, phù hợp đi làm và dự tiệc.", 
                    1200000, 25, "Juno", "Cao gót 5-7cm", subCategories, brands));

                // === GIÀY OUTDOOR ===
                
                products.add(createProduct("Timberland 6-Inch Premium Boot", 
                    "Boot da chống nước cao cấp cho hoạt động outdoor. Lót ấm, đế chống trượt an toàn.", 
                    4200000, 7, "Timberland", "Giày leo núi/hiking", subCategories, brands));

                // === GIÀY TRẺ EM ===
                
                products.add(createProduct("Nike Air Force 1 Kids", 
                    "Giày thể thao trẻ em phiên bản thu nhỏ của AF1 kinh điển. Dễ đi, bền bỉ cho bé.", 
                    1600000, 30, "Nike", "Giày bé trai (1-6 tuổi)", subCategories, brands));

                // === THƯƠNG HIỆU VIỆT NAM ===
                
                products.add(createProduct("Biti's Hunter X", 
                    "Sneaker cao cấp của Việt Nam với thiết kế hiện đại. Chất liệu da PU cao cấp, đế EVA êm ái.", 
                    850000, 35, "Biti's", "Sneaker thời trang", subCategories, brands));

                // === GIÀY CAO CẤP ===
                
// === GIÀY CAO CẤP ===
                
                products.add(createProduct("Gucci Ace Sneaker", 
                    "Sneaker luxury với chi tiết thêu ong iconic. Da trắng cao cấp, made in Italy.", 
                    18000000, 2, "Gucci", "Sneaker thời trang", subCategories, brands));

                // === SANDAL & DÉP ===
                
                products.add(createProduct("Adidas Adilette Comfort", 
                    "Dép slide thể thao với đế Cloudfoam siêu êm. Phù hợp sau tập luyện hoặc đi biển.", 
                    890000, 50, "Adidas", "Dép thể thao", subCategories, brands));

                // === CÁC SẢN PHẨM BỔ SUNG ===
                
                products.add(createProduct("New Balance 990v5", 
                    "Giày chạy cao cấp Made in USA với thiết kế retro. Đế ENCAP midsole ổn định tuyệt vời.", 
                    4800000, 6, "New Balance", "Giày chạy bộ", subCategories, brands));
                    
                products.add(createProduct("ASICS Gel-Kayano 29", 
                    "Giày chạy stability với công nghệ GEL cushioning. Hỗ trợ tốt cho người có bàn chân bẹt.", 
                    4200000, 8, "ASICS", "Giày chạy bộ", subCategories, brands));
                    
                products.add(createProduct("Dr. Martens 1460", 
                    "Boot da kinh điển 8-eye với AirWair sole. Bền bỉ, phong cách punk rock iconic.", 
                    3800000, 10, "Dr. Martens", "Boot da thật", subCategories, brands));
                    
                products.add(createProduct("Palladium Pampa Hi", 
                    "Boot canvas military style với đế cao su chống trượt. Phù hợp outdoor và street style.", 
                    1400000, 22, "Palladium", "Boot thời trang", subCategories, brands));
                    
                products.add(createProduct("Puma Velocity Nitro", 
                    "Giày chạy bộ nhanh nhẹn với bộ đệm tốt. Phù hợp cho runner tốc độ cao.", 
                    2000000, 15, "Puma", "Giày chạy bộ", subCategories, brands));
                    
                products.add(createProduct("Reebok Classic Leather", 
                    "Sneaker retro cơ bản với thiết kế đơn giản và bền bỉ. Dễ phối với mọi outfit.", 
                    1500000, 20, "Reebok", "Sneaker thời trang", subCategories, brands));
                    
                products.add(createProduct("Under Armour UA Hovr Phantom", 
                    "Giày training với công nghệ HOVR lơ lửng giữa không khí. Thoải mái cho tập gym.", 
                    2400000, 12, "Under Armour", "Giày training/gym", subCategories, brands));
                    
                products.add(createProduct("Fila Disruptor II", 
                    "Sneaker chunky thời trang với thiết kế nổi bật. Phổ biến trong street style.", 
                    1800000, 18, "Fila", "Sneaker thời trang", subCategories, brands));

                // Lưu tất cả sản phẩm
                int productCount = 0;
                for (Product product : products) {
                    productRepository.save(product);
                    productCount++;
                    logger.debug("Đã tạo sản phẩm: {}", product.getProductName());
                }

                logger.info("Đã khởi tạo thành công {} sản phẩm giày chuyên nghiệp!", productCount);
            } else {
                logger.info("Dữ liệu sản phẩm đã tồn tại, bỏ qua khởi tạo.");
            }
        };
    }

    /**
     * Tạo một sản phẩm mới với thông tin chi tiết
     */
    private Product createProduct(String name, String description, long price, int discountPercent,
                                 String brandName, String subCategoryName,
                                 List<SubCategory> subCategories, List<Brand> brands) {
        Product product = new Product();
        product.setProductName(name);
        product.setDescription(description);
        product.setSellingPrice(price);
        product.setDiscountPercentage(discountPercent);
        
        // Tìm SubCategory theo tên
        SubCategory subCategory = subCategories.stream()
            .filter(sc -> sc.getSubCategoryName().equals(subCategoryName))
            .findFirst()
            .orElse(subCategories.get(0)); // Fallback nếu không tìm thấy
        product.setSubCategory(subCategory);
        
        // Tìm Brand theo tên
        Brand brand = brands.stream()
            .filter(b -> b.getBrandName().equals(brandName))
            .findFirst()
            .orElse(brands.get(0)); // Fallback nếu không tìm thấy
        product.setBrand(brand);
        
        product.setIsActive(true);
        product.setCreatedAt(new Date());
        product.setUpdatedAt(new Date());
        return product;
    }
}