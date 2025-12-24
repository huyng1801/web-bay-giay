package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.enums.Gender;
import vn.student.polyshoes.model.Brand;
import vn.student.polyshoes.model.Category;
import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.model.ProductColor;
import vn.student.polyshoes.model.ProductColorImage;
import vn.student.polyshoes.model.ProductSize;
import vn.student.polyshoes.model.SubCategory;
import vn.student.polyshoes.repository.BrandRepository;
import vn.student.polyshoes.repository.CategoryRepository;
import vn.student.polyshoes.repository.ProductColorImageRepository;
import vn.student.polyshoes.repository.ProductColorRepository;
import vn.student.polyshoes.repository.ProductRepository;
import vn.student.polyshoes.repository.ProductSizeRepository;
import vn.student.polyshoes.repository.SubCategoryRepository;

import java.util.Date;

/**
 * Seeder dùng để khởi tạo dữ liệu sản phẩm, thương hiệu, danh mục, và các biến thể màu/kích cỡ
 * Tự động chạy khi ứng dụng khởi động nếu bảng product còn trống
 * Tạo 20 sản phẩm từ 8 thương hiệu giày nổi tiếng
 */
@Component
@Configuration
public class ProductDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ProductDataSeeder.class);

    /**
     * Khởi tạo dữ liệu sản phẩm và các thông tin liên quan
     * @param productRepository Repository dùng để lưu sản phẩm
     * @param brandRepository Repository dùng để lưu thương hiệu
     * @param subCategoryRepository Repository dùng để lưu danh mục phụ
     * @param categoryRepository Repository dùng để lưu danh mục chính
     * @param productColorRepository Repository dùng để lưu biến thể màu sản phẩm
     * @param productSizeRepository Repository dùng để lưu biến thể kích cỡ sản phẩm
     * @param productColorImageRepository Repository dùng để lưu hình ảnh biến thể màu
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository, BrandRepository brandRepository, SubCategoryRepository subCategoryRepository, CategoryRepository categoryRepository, ProductColorRepository productColorRepository, ProductSizeRepository productSizeRepository, ProductColorImageRepository productColorImageRepository) {
        return args -> {
            // Kiểm tra xem có dữ liệu sản phẩm đã tồn tại không
            if (productRepository.count() == 0) {
                logger.info("Bắt đầu khởi tạo 20 sản phẩm giày với 55+ biến thể màu...");

                // ===== BƯỚC 1: Tạo hoặc lấy các thương hiệu giày =====
                Brand nike = findOrCreateBrand(brandRepository, "Nike", "https://picsum.photos/200/100?random=1");
                Brand adidas = findOrCreateBrand(brandRepository, "Adidas", "https://picsum.photos/200/100?random=2");
                Brand puma = findOrCreateBrand(brandRepository, "Puma", "https://picsum.photos/200/100?random=3");
                Brand converse = findOrCreateBrand(brandRepository, "Converse", "https://picsum.photos/200/100?random=4");
                Brand vans = findOrCreateBrand(brandRepository, "Vans", "https://picsum.photos/200/100?random=5");
                Brand newBalance = findOrCreateBrand(brandRepository, "New Balance", "https://picsum.photos/200/100?random=6");
                Brand timberland = findOrCreateBrand(brandRepository, "Timberland", "https://picsum.photos/200/100?random=7");
                Brand reebok = findOrCreateBrand(brandRepository, "Reebok", "https://picsum.photos/200/100?random=8");

                // ===== BƯỚC 2: Tạo hoặc lấy các danh mục chính (loại giày) =====
                Category categoryGiayTheThao = findOrCreateCategory(categoryRepository, "Giày thể thao");
                Category categoryGiayCasual = findOrCreateCategory(categoryRepository, "Giày casual");
                Category categoryGiayBoot = findOrCreateCategory(categoryRepository, "Giày boot");

                // ===== BƯỚC 3: Tạo hoặc lấy các danh mục phụ (loại chi tiết) =====
                SubCategory giayChuaySneaker = findOrCreateSubCategory(subCategoryRepository, "Sneaker chạy bộ", categoryGiayTheThao, Gender.UNISEX);
                SubCategory giayTennis = findOrCreateSubCategory(subCategoryRepository, "Giày tennis", categoryGiayTheThao, Gender.UNISEX);
                SubCategory giayBongRo = findOrCreateSubCategory(subCategoryRepository, "Giày bóng rổ", categoryGiayTheThao, Gender.UNISEX);
                SubCategory giayCanh = findOrCreateSubCategory(subCategoryRepository, "Giày canvas", categoryGiayCasual, Gender.UNISEX);
                SubCategory giayBootDa = findOrCreateSubCategory(subCategoryRepository, "Boot da", categoryGiayBoot, Gender.UNISEX);

                // ===== BƯỚC 4: Định nghĩa các kích cỡ giày tiêu chuẩn và số lượng kho =====
                // Danh sách kích cỡ giày tiêu chuẩn (từ 36 đến 45)
                String[] shoeSizes = {"36", "37", "38", "39", "40", "41", "42", "43", "44", "45"};
                // Số lượng kho tương ứng với từng kích cỡ
                Integer[] stockQuantities = {12, 14, 16, 18, 20, 18, 16, 14, 12, 10};

                // ===== BƯỚC 5: KHỞI TẠO 20 SẢN PHẨM GIÀY TỪCÁC THƯƠNG HIỆU =====

                // ===== NIKE: 4 sản phẩm (Chạy bộ, Bóng rổ, Chạy bộ giá rẻ, Canvas) =====
                Product p1 = addProduct(productRepository, nike, giayChuaySneaker, "Nike Air Zoom Pegasus 39 - Giày chạy bộ cao cấp", 2499000, 20);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p1, "Đen",
                    "https://picsum.photos/600/600?random=11",
                    new String[]{"https://picsum.photos/600/600?random=11", "https://picsum.photos/600/600?random=12", "https://picsum.photos/600/600?random=13"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p1, "Trắng",
                    "https://picsum.photos/600/600?random=14",
                    new String[]{"https://picsum.photos/600/600?random=14", "https://picsum.photos/600/600?random=15"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p1, "Xanh navy",
                    "https://picsum.photos/600/600?random=16",
                    new String[]{"https://picsum.photos/600/600?random=16", "https://picsum.photos/600/600?random=17"},
                    shoeSizes, stockQuantities);

                Product p2 = addProduct(productRepository, nike, giayBongRo, "Nike Air Jordan 1 Retro High - Huyền thoại bóng rổ", 3299000, 15);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p2, "Đen đỏ",
                    "https://picsum.photos/600/600?random=21",
                    new String[]{"https://picsum.photos/600/600?random=21", "https://picsum.photos/600/600?random=22", "https://picsum.photos/600/600?random=23"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p2, "Trắng vàng",
                    "https://picsum.photos/600/600?random=24",
                    new String[]{"https://picsum.photos/600/600?random=24", "https://picsum.photos/600/600?random=25"},
                    shoeSizes, stockQuantities);

                Product p3 = addProduct(productRepository, nike, giayChuaySneaker, "Nike Revolution 6 - Giày chạy bộ giá rẻ", 999000, 25);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p3, "Đen",
                    "https://picsum.photos/600/600?random=31",
                    new String[]{"https://picsum.photos/600/600?random=31", "https://picsum.photos/600/600?random=32"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p3, "Xám",
                    "https://picsum.photos/600/600?random=33",
                    new String[]{"https://picsum.photos/600/600?random=33", "https://picsum.photos/600/600?random=34"},
                    shoeSizes, stockQuantities);

                Product p4 = addProduct(productRepository, nike, giayCanh, "Nike Court Legacy Canvas - Giày canvas cổ điển", 1499000, 10);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p4, "Trắng",
                    "https://picsum.photos/600/600?random=41",
                    new String[]{"https://picsum.photos/600/600?random=41", "https://picsum.photos/600/600?random=42", "https://picsum.photos/600/600?random=43"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p4, "Đen",
                    "https://picsum.photos/600/600?random=44",
                    new String[]{"https://picsum.photos/600/600?random=44", "https://picsum.photos/600/600?random=45"},
                    shoeSizes, stockQuantities);

                // ===== ADIDAS: 4 sản phẩm (Chạy bộ cao cấp, Tennis, Chạy bộ thời trang, Canvas) =====
                Product p5 = addProduct(productRepository, adidas, giayChuaySneaker, "Adidas Ultraboost 22 - Công nghệ boost hàng đầu", 2799000, 18);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p5, "Đen",
                    "https://picsum.photos/600/600?random=51",
                    new String[]{"https://picsum.photos/600/600?random=51", "https://picsum.photos/600/600?random=52", "https://picsum.photos/600/600?random=53"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p5, "Trắng",
                    "https://picsum.photos/600/600?random=54",
                    new String[]{"https://picsum.photos/600/600?random=54", "https://picsum.photos/600/600?random=55"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p5, "Xanh dương",
                    "https://picsum.photos/600/600?random=56",
                    new String[]{"https://picsum.photos/600/600?random=56", "https://picsum.photos/600/600?random=57"},
                    shoeSizes, stockQuantities);

                Product p6 = addProduct(productRepository, adidas, giayTennis, "Adidas Barricade Boost - Giày tennis chuyên nghiệp", 1999000, 12);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p6, "Trắng xanh",
                    "https://picsum.photos/600/600?random=61",
                    new String[]{"https://picsum.photos/600/600?random=61", "https://picsum.photos/600/600?random=62", "https://picsum.photos/600/600?random=63"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p6, "Đen đỏ",
                    "https://picsum.photos/600/600?random=64",
                    new String[]{"https://picsum.photos/600/600?random=64", "https://picsum.photos/600/600?random=65"},
                    shoeSizes, stockQuantities);

                Product p7 = addProduct(productRepository, adidas, giayChuaySneaker, "Adidas NMD R1 - Giày sneaker thời trang", 1699000, 20);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p7, "Đen",
                    "https://picsum.photos/600/600?random=71",
                    new String[]{"https://picsum.photos/600/600?random=71", "https://picsum.photos/600/600?random=72"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p7, "Xám",
                    "https://picsum.photos/600/600?random=73",
                    new String[]{"https://picsum.photos/600/600?random=73", "https://picsum.photos/600/600?random=74"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p7, "Trắng",
                    "https://picsum.photos/600/600?random=75",
                    new String[]{"https://picsum.photos/600/600?random=75", "https://picsum.photos/600/600?random=76"},
                    shoeSizes, stockQuantities);

                Product p8 = addProduct(productRepository, adidas, giayCanh, "Adidas Stan Smith - Biểu tượng thời trang", 1399000, 15);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p8, "Trắng xanh",
                    "https://picsum.photos/600/600?random=81",
                    new String[]{"https://picsum.photos/600/600?random=81", "https://picsum.photos/600/600?random=82", "https://picsum.photos/600/600?random=83"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p8, "Trắng",
                    "https://picsum.photos/600/600?random=84",
                    new String[]{"https://picsum.photos/600/600?random=84", "https://picsum.photos/600/600?random=85"},
                    shoeSizes, stockQuantities);

                // ===== PUMA: 2 sản phẩm (Giày retro thời trang, Giày bóng rổ) =====
                Product p9 = addProduct(productRepository, puma, giayChuaySneaker, "Puma RS-X - Giày retro futuristic", 1299000, 22);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p9, "Đen",
                    "https://picsum.photos/600/600?random=91",
                    new String[]{"https://picsum.photos/600/600?random=91", "https://picsum.photos/600/600?random=92", "https://picsum.photos/600/600?random=93"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p9, "Đỏ",
                    "https://picsum.photos/600/600?random=94",
                    new String[]{"https://picsum.photos/600/600?random=94", "https://picsum.photos/600/600?random=95"},
                    shoeSizes, stockQuantities);

                Product p10 = addProduct(productRepository, puma, giayBongRo, "Puma Clyde Court - Giày bóng rổ lịch sử", 1899000, 14);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p10, "Trắng đỏ",
                    "https://picsum.photos/600/600?random=101",
                    new String[]{"https://picsum.photos/600/600?random=101", "https://picsum.photos/600/600?random=102", "https://picsum.photos/600/600?random=103"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p10, "Xanh vàng",
                    "https://picsum.photos/600/600?random=104",
                    new String[]{"https://picsum.photos/600/600?random=104", "https://picsum.photos/600/600?random=105"},
                    shoeSizes, stockQuantities);

                // ===== CONVERSE: 2 sản phẩm (Canvas cổ điển, Canvas cổ cao) =====
                Product p11 = addProduct(productRepository, converse, giayCanh, "Converse Chuck Taylor All Star - Huyền thoại không lão", 899000, 25);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p11, "Đen",
                    "https://picsum.photos/600/600?random=111",
                    new String[]{"https://picsum.photos/600/600?random=111", "https://picsum.photos/600/600?random=112", "https://picsum.photos/600/600?random=113"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p11, "Trắng",
                    "https://picsum.photos/600/600?random=114",
                    new String[]{"https://picsum.photos/600/600?random=114", "https://picsum.photos/600/600?random=115", "https://picsum.photos/600/600?random=116"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p11, "Đỏ",
                    "https://picsum.photos/600/600?random=117",
                    new String[]{"https://picsum.photos/600/600?random=117", "https://picsum.photos/600/600?random=118"},
                    shoeSizes, stockQuantities);

                Product p12 = addProduct(productRepository, converse, giayCanh, "Converse Chuck Taylor High Top - Cổ cao cổ điển", 999000, 20);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p12, "Đen",
                    "https://picsum.photos/600/600?random=121",
                    new String[]{"https://picsum.photos/600/600?random=121", "https://picsum.photos/600/600?random=122"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p12, "Xanh navy",
                    "https://picsum.photos/600/600?random=123",
                    new String[]{"https://picsum.photos/600/600?random=123", "https://picsum.photos/600/600?random=124"},
                    shoeSizes, stockQuantities);

                // ===== VANS: 2 sản phẩm (Giày skate cổ điển, Giày skate cơ bản) =====
                Product p13 = addProduct(productRepository, vans, giayCanh, "Vans Old Skool - Biểu tượng skate", 1199000, 18);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p13, "Đen trắng",
                    "https://picsum.photos/600/600?random=131",
                    new String[]{"https://picsum.photos/600/600?random=131", "https://picsum.photos/600/600?random=132", "https://picsum.photos/600/600?random=133"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p13, "Xám trắng",
                    "https://picsum.photos/600/600?random=134",
                    new String[]{"https://picsum.photos/600/600?random=134", "https://picsum.photos/600/600?random=135"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p13, "Đỏ",
                    "https://picsum.photos/600/600?random=136",
                    new String[]{"https://picsum.photos/600/600?random=136", "https://picsum.photos/600/600?random=137"},
                    shoeSizes, stockQuantities);

                Product p14 = addProduct(productRepository, vans, giayCanh, "Vans Era - Giày skate cơ bản", 1099000, 22);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p14, "Đen",
                    "https://picsum.photos/600/600?random=141",
                    new String[]{"https://picsum.photos/600/600?random=141", "https://picsum.photos/600/600?random=142"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p14, "Trắng",
                    "https://picsum.photos/600/600?random=143",
                    new String[]{"https://picsum.photos/600/600?random=143", "https://picsum.photos/600/600?random=144"},
                    shoeSizes, stockQuantities);

                // ===== NEW BALANCE: 2 sản phẩm (Giày chạy huyền thoại, Giày casual thoải mái) =====
                Product p15 = addProduct(productRepository, newBalance, giayChuaySneaker, "New Balance 990v5 - Giày chạy huyền thoại", 2199000, 16);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p15, "Xám",
                    "https://picsum.photos/600/600?random=151",
                    new String[]{"https://picsum.photos/600/600?random=151", "https://picsum.photos/600/600?random=152", "https://picsum.photos/600/600?random=153"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p15, "Đen",
                    "https://picsum.photos/600/600?random=154",
                    new String[]{"https://picsum.photos/600/600?random=154", "https://picsum.photos/600/600?random=155"},
                    shoeSizes, stockQuantities);

                Product p16 = addProduct(productRepository, newBalance, giayChuaySneaker, "New Balance 574 - Giày casual thoải mái", 1599000, 19);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p16, "Đen xám",
                    "https://picsum.photos/600/600?random=161",
                    new String[]{"https://picsum.photos/600/600?random=161", "https://picsum.photos/600/600?random=162", "https://picsum.photos/600/600?random=163"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p16, "Trắng",
                    "https://picsum.photos/600/600?random=164",
                    new String[]{"https://picsum.photos/600/600?random=164", "https://picsum.photos/600/600?random=165"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p16, "Đỏ",
                    "https://picsum.photos/600/600?random=166",
                    new String[]{"https://picsum.photos/600/600?random=166", "https://picsum.photos/600/600?random=167"},
                    shoeSizes, stockQuantities);

                // ===== TIMBERLAND: 2 sản phẩm (Boot da cổ điển, Boot da bền bỉ) =====
                Product p17 = addProduct(productRepository, timberland, giayBootDa, "Timberland 6 Inch Premium Boot - Boot da cổ điển", 2999000, 12);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p17, "Nâu",
                    "https://picsum.photos/600/600?random=171",
                    new String[]{"https://picsum.photos/600/600?random=171", "https://picsum.photos/600/600?random=172", "https://picsum.photos/600/600?random=173"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p17, "Nâu sáng",
                    "https://picsum.photos/600/600?random=174",
                    new String[]{"https://picsum.photos/600/600?random=174", "https://picsum.photos/600/600?random=175"},
                    shoeSizes, stockQuantities);

                Product p18 = addProduct(productRepository, timberland, giayBootDa, "Timberland Earthkeepers - Boot da bền bỉ", 2699000, 14);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p18, "Nâu đỏ",
                    "https://picsum.photos/600/600?random=181",
                    new String[]{"https://picsum.photos/600/600?random=181", "https://picsum.photos/600/600?random=182", "https://picsum.photos/600/600?random=183"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p18, "Đen",
                    "https://picsum.photos/600/600?random=184",
                    new String[]{"https://picsum.photos/600/600?random=184", "https://picsum.photos/600/600?random=185"},
                    shoeSizes, stockQuantities);

                // ===== REEBOK: 2 sản phẩm (Giày retro cổ điển, Giày casual thanh lịch) =====
                Product p19 = addProduct(productRepository, reebok, giayChuaySneaker, "Reebok Classic Leather Legacy - Giày retro cổ điển", 1299000, 21);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p19, "Trắng",
                    "https://picsum.photos/600/600?random=191",
                    new String[]{"https://picsum.photos/600/600?random=191", "https://picsum.photos/600/600?random=192", "https://picsum.photos/600/600?random=193"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p19, "Đen",
                    "https://picsum.photos/600/600?random=194",
                    new String[]{"https://picsum.photos/600/600?random=194", "https://picsum.photos/600/600?random=195"},
                    shoeSizes, stockQuantities);

                Product p20 = addProduct(productRepository, reebok, giayCanh, "Reebok Club C 85 - Giày casual thanh lịch", 1199000, 23);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p20, "Trắng xanh",
                    "https://picsum.photos/600/600?random=201",
                    new String[]{"https://picsum.photos/600/600?random=201", "https://picsum.photos/600/600?random=202", "https://picsum.photos/600/600?random=203"},
                    shoeSizes, stockQuantities);
                addProductColor(productColorRepository, productColorImageRepository, productSizeRepository, p20, "Trắng đỏ",
                    "https://picsum.photos/600/600?random=204",
                    new String[]{"https://picsum.photos/600/600?random=204", "https://picsum.photos/600/600?random=205"},
                    shoeSizes, stockQuantities);

                logger.info("Successfully seeded 20 shoe products with 55+ color variants!");
            }
        };
    }

    /**
     * Tìm kiếm thương hiệu theo tên hoặc tạo mới nếu chưa tồn tại
     * @param brandRepository Repository dùng để truy vấn thương hiệu
     * @param brandName Tên của thương hiệu cần tìm/tạo
     * @param imageUrl URL của hình ảnh thương hiệu
     * @return Brand object - thương hiệu tìm được hoặc vừa tạo
     */
    private Brand findOrCreateBrand(BrandRepository brandRepository, String brandName, String imageUrl) {
        return brandRepository.findByBrandName(brandName)
            .orElseGet(() -> {
                // Tạo thương hiệu mới nếu chưa tồn tại
                Brand brand = new Brand();
                brand.setBrandName(brandName);
                brand.setImageUrl(imageUrl);
                brand.setCreatedAt(new Date());
                brand.setUpdatedAt(new Date());
                return brandRepository.save(brand);
            });
    }

    /**
     * Tìm kiếm danh mục phụ theo tên hoặc tạo mới nếu chưa tồn tại
     * @param subCategoryRepository Repository dùng để truy vấn danh mục phụ
     * @param subCategoryName Tên của danh mục phụ cần tìm/tạo
     * @param category Danh mục chính mà danh mục phụ thuộc vào
     * @param gender Giới tính áp dụng (NAM, NỮ, hoặc UNISEX)
     * @return SubCategory object - danh mục phụ tìm được hoặc vừa tạo
     */
    private SubCategory findOrCreateSubCategory(SubCategoryRepository subCategoryRepository, String subCategoryName, Category category, Gender gender) {
        return subCategoryRepository.findBySubCategoryName(subCategoryName)
            .orElseGet(() -> {
                // Tạo danh mục phụ mới nếu chưa tồn tại
                SubCategory subCategory = new SubCategory();
                subCategory.setSubCategoryName(subCategoryName);
                subCategory.setCategory(category);
                subCategory.setCreatedAt(new Date());
                subCategory.setUpdatedAt(new Date());
                subCategory.setGender(gender);
                return subCategoryRepository.save(subCategory);
            });
    }

    /**
     * Tìm kiếm danh mục chính theo tên hoặc tạo mới nếu chưa tồn tại
     * @param categoryRepository Repository dùng để truy vấn danh mục chính
     * @param categoryName Tên của danh mục chính cần tìm/tạo
     * @return Category object - danh mục chính tìm được hoặc vừa tạo
     */
    private Category findOrCreateCategory(CategoryRepository categoryRepository, String categoryName) {
        return categoryRepository.findByCategoryName(categoryName)
            .orElseGet(() -> {
                // Tạo danh mục chính mới nếu chưa tồn tại
                Category category = new Category();
                category.setCategoryName(categoryName);
                category.setCreatedAt(new Date());
                category.setUpdatedAt(new Date());
                return categoryRepository.save(category);
            });
    }

    /**
     * Tạo mới sản phẩm giày
     * @param productRepository Repository dùng để lưu sản phẩm
     * @param brand Thương hiệu sản phẩm
     * @param subCategory Danh mục phụ của sản phẩm
     * @param productName Tên sản phẩm
     * @param price Giá bán sản phẩm (VNĐ)
     * @param discountPercentage Phần trăm giảm giá (nếu có)
     * @return Product object - sản phẩm vừa tạo
     */
    private Product addProduct(ProductRepository productRepository, Brand brand, SubCategory subCategory, String productName, long price, Integer discountPercentage) {
        // Khởi tạo sản phẩm mới
        Product product = new Product();
        product.setProductName(productName);
        
        // Tạo mô tả chi tiết dựa trên loại sản phẩm
        String description = generateProductDescription(productName);
        product.setDescription(description);
        
        // Gán giá bán và thông tin giảm giá
        product.setSellingPrice(price);
        product.setDiscountPercentage(discountPercentage != null ? discountPercentage : 0);
        // Liên kết với thương hiệu và danh mục phụ
        product.setBrand(brand);
        product.setSubCategory(subCategory);
        // Đặt sản phẩm ở trạng thái hoạt động
        product.setIsActive(true);
        product.setCreatedAt(new Date());
        product.setUpdatedAt(new Date());
        return productRepository.save(product);
    }

    /**
     * Tạo mô tả chi tiết sản phẩm dựa trên tên và loại giày
     * @param productName Tên sản phẩm
     * @return String mô tả chi tiết sản phẩm
     */
    private String generateProductDescription(String productName) {
        // Tạo mô tả dựa trên loại sản phẩm
        if (productName.contains("Boot")) {
            return "Boot da cao cấp, thiết kế cổ điển và bền bỉ. Chất liệu da tự nhiên, thoáng khí và bảo vệ chân tốt. Phù hợp cho nhiều dịp từ casual đến formal.";
        } else if (productName.contains("Bóng rổ")) {
            return "Giày bóng rổ chuyên nghiệp với công nghệ giảm chấn hiện đại. Hỗ trợ cổ chân tốt, tăng hiệu suất chơi. Thiết kế hợp lý cho cả nam lẫn nữ.";
        } else if (productName.contains("Tennis")) {
            return "Giày tennis chuyên dụng với độ bám tốt trên sân. Công nghệ hỗ trợ chân toàn diện, thoải mái cho các trận đấu dài. Phù hợp cho mọi cấp độ chơi.";
        } else if (productName.contains("Canvas")) {
            return "Giày canvas cổ điển, nhẹ gọn và thoải mái. Thiết kế đơn giản nhưng thanh lịch, phù hợp với nhiều trang phục. Dễ vệ sinh và bảo quản.";
        } else if (productName.contains("Skate")) {
            return "Giày skate bền bỉ với độ bám chân tốt. Thiết kế mạnh mẽ, chịu lực mạnh. Phù hợp cho skateboard và hoạt động casual hàng ngày.";
        } else {
            return "Giày thể thao chất lượng cao, thiết kế hiện đại. Công nghệ giảm chấn tối ưu, thoải mái cho cả đi bộ lẫn chạy. Chất liệu bền bỉ, dễ vệ sinh.";
        }
    }

    /**
     * Thêm biến thể màu cho sản phẩm, bao gồm hình ảnh và kích cỡ
     * @param productColorRepository Repository dùng để lưu biến thể màu
     * @param productColorImageRepository Repository dùng để lưu hình ảnh biến thể
     * @param productSizeRepository Repository dùng để lưu kích cỡ sản phẩm
     * @param product Sản phẩm cần thêm biến thể màu
     * @param colorName Tên màu sắc
     * @param imageUrl URL hình ảnh chính của màu
     * @param imageUrls Mảng URL hình ảnh chi tiết của màu
     * @param sizeValues Mảng các kích cỡ giày (36, 37, 38, ...)
     * @param stockQuantities Mảng số lượng kho tương ứng với mỗi kích cỡ
     */
    private void addProductColor(
        ProductColorRepository productColorRepository,
        ProductColorImageRepository productColorImageRepository,
        ProductSizeRepository productSizeRepository,
        Product product,
        String colorName,
        String imageUrl,
        String[] imageUrls,
        String[] sizeValues,
        Integer[] stockQuantities
    ) {
        // Tạo biến thể màu sản phẩm
        ProductColor productColor = new ProductColor();
        productColor.setProduct(product);
        productColor.setColorName(colorName);
        productColor.setImageUrl(imageUrl);
        productColor = productColorRepository.save(productColor);  // Lưu biến thể màu trước
        
        // Thêm hình ảnh chi tiết cho biến thể màu
        for (String imgUrl : imageUrls) {
            addProductColorImage(productColorImageRepository, productColor, imgUrl);
        }
        
        // Thêm các kích cỡ và số lượng kho cho biến thể màu
        for (int i = 0; i < sizeValues.length; i++) {
            addProductSize(productSizeRepository, productColor, sizeValues[i], stockQuantities[i]);
        }
        
    }

    /**
     * Thêm hình ảnh chi tiết cho biến thể màu sản phẩm
     * @param productColorImageRepository Repository dùng để lưu hình ảnh
     * @param productColor Biến thể màu của sản phẩm
     * @param imageUrl URL hình ảnh cần thêm
     */
    private void addProductColorImage(ProductColorImageRepository productColorImageRepository, ProductColor productColor, String imageUrl) {
        // Tạo bản ghi hình ảnh mới
        ProductColorImage productColorImage = new ProductColorImage();
        productColorImage.setProductColor(productColor);
        productColorImage.setImageUrl(imageUrl);
        productColorImageRepository.save(productColorImage);
    }

    /**
     * Thêm kích cỡ và số lượng kho cho biến thể màu sản phẩm
     * @param productSizeRepository Repository dùng để lưu kích cỡ
     * @param productColor Biến thể màu của sản phẩm
     * @param sizeValue Kích cỡ giày (ví dụ: 36, 37, 38, ...)
     * @param stockQuantity Số lượng sản phẩm có sẵn trong kho
     */
    private void addProductSize(ProductSizeRepository productSizeRepository, ProductColor productColor, String sizeValue, Integer stockQuantity) {
        // Tạo bản ghi kích cỡ mới
        ProductSize productSize = new ProductSize();
        productSize.setSizeValue(sizeValue);
        productSize.setStockQuantity(stockQuantity);
        productSize.setProductColor(productColor);
        productSizeRepository.save(productSize);
    }


}
