package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.Product;
import vn.student.polyshoes.model.ProductFeedback;
import vn.student.polyshoes.repository.CustomerRepository;
import vn.student.polyshoes.repository.OrderRepository;
import vn.student.polyshoes.repository.ProductFeedbackRepository;
import vn.student.polyshoes.repository.ProductRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeder dùng để khởi tạo dữ liệu đánh giá/nhận xét sản phẩm
 * Tự động chạy khi ứng dụng khởi động nếu bảng product_feedback còn trống
 * Tạo các ProductFeedback liên kết với Product, Customer, và Order
 * Quản lý mối quan hệ: ProductFeedback <-> Product, ProductFeedback <-> Customer, ProductFeedback <-> Order
 */
@Component
@Configuration
public class ProductFeedbackDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ProductFeedbackDataSeeder.class);

    /**
     * Khởi tạo dữ liệu đánh giá sản phẩm
     * @param productFeedbackRepository Repository dùng để lưu đánh giá sản phẩm
     * @param productRepository Repository để lấy dữ liệu sản phẩm
     * @param customerRepository Repository để lấy dữ liệu khách hàng
     * @param orderRepository Repository để lấy dữ liệu đơn hàng
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedProductFeedbacks(
            ProductFeedbackRepository productFeedbackRepository,
            ProductRepository productRepository,
            CustomerRepository customerRepository,
            OrderRepository orderRepository) {
        return args -> {
            try {
                // Kiểm tra xem có dữ liệu đánh giá đã tồn tại không
                if (productFeedbackRepository.count() == 0) {
                    logger.info("Bắt đầu khởi tạo dữ liệu đánh giá sản phẩm...");

                    // Lấy dữ liệu cần thiết từ database
                    List<Product> products = productRepository.findAll();
                    List<Customer> customers = customerRepository.findAll();
                    List<Order> orders = orderRepository.findAll();

                    // Kiểm tra xem có đủ dữ liệu cần thiết
                    if (products.isEmpty() || customers.isEmpty() || orders.isEmpty()) {
                        logger.warn("Missing required data for ProductFeedbacks. Please seed Products, Customers, and Orders first!");
                        logger.warn("Current data: Products={}, Customers={}, Orders={}", 
                                    products.size(), customers.size(), orders.size());
                        return;
                    }

                    // Kiểm tra số lượng dữ liệu có đủ để tạo 10 đánh giá
                    if (products.size() < 19 || customers.size() < 6 || orders.size() < 6) {
                        logger.warn("Not enough data to seed all feedbacks. Required: Products>=19, Customers>=6, Orders>=6");
                        logger.warn("Current data: Products={}, Customers={}, Orders={}", 
                                    products.size(), customers.size(), orders.size());
                        logger.warn("Proceeding with available data using safe index access...");
                    }

                    int savedCount = 0;

                    try {
                        // ===== ĐáNH GIÁ 1: Nike Air Zoom Pegasus 39 - 5 sao =====
                        ProductFeedback pf1 = new ProductFeedback();
                        pf1.setProduct(products.get(0 % products.size()));  // An toàn: tổng hợp với modulo
                        pf1.setCustomer(customers.get(0 % customers.size()));
                        pf1.setOrder(orders.get(0 % orders.size()));
                        pf1.setRating(5);
                        pf1.setComment("Giày rất thoải mái, chất lượng tốt, giao hàng nhanh. Rất hài lòng với sản phẩm này!");
                        pf1.setCreatedAt(LocalDateTime.now());
                        pf1.setIsActive(true);
                        productFeedbackRepository.save(pf1);
                        savedCount++;
                        logger.debug("✓ Đánh giá 1 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 1: {}", e.getMessage());
                    }

                    try {
                        // ===== ĐáNH GIÁ 2: Puma RS-X - 4 sao =====
                        ProductFeedback pf2 = new ProductFeedback();
                        pf2.setProduct(products.get(8 % products.size()));
                        pf2.setCustomer(customers.get(1 % customers.size()));
                        pf2.setOrder(orders.get(1 % orders.size()));
                        pf2.setRating(4);
                        pf2.setComment("Giày đẹp, nhưng hơi hẹp so với kích cỡ thường. Nên đặt size lớn hơn một số.");
                        pf2.setCreatedAt(LocalDateTime.now());
                        pf2.setIsActive(true);
                        productFeedbackRepository.save(pf2);
                        savedCount++;
                        logger.debug("✓ Đánh giá 2 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 2: {}", e.getMessage());
                    }

                    try {
                        // ===== ĐáNH GIÁ 3: Converse Chuck Taylor All Star - 5 sao =====
                        ProductFeedback pf3 = new ProductFeedback();
                        pf3.setProduct(products.get(10 % products.size()));
                        pf3.setCustomer(customers.get(2 % customers.size()));
                        pf3.setOrder(orders.get(2 % orders.size()));
                        pf3.setRating(5);
                        pf3.setComment("Đôi giày cổ điển, hợp với mọi trang phục. Dễ bảo quản, chất lượng đảm bảo!");
                        pf3.setCreatedAt(LocalDateTime.now());
                        pf3.setIsActive(true);
                        productFeedbackRepository.save(pf3);
                        savedCount++;
                        logger.debug("✓ Đánh giá 3 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 3: {}", e.getMessage());
                    }

                    try {
                        // ===== ĐáNH GIÁ 4: Adidas Ultraboost 22 - 3 sao =====
                        ProductFeedback pf4 = new ProductFeedback();
                        pf4.setProduct(products.get(4 % products.size()));
                        pf4.setCustomer(customers.get(3 % customers.size()));
                        pf4.setOrder(orders.get(3 % orders.size()));
                        pf4.setRating(3);
                        pf4.setComment("Giày bình thường, công nghệ boost không quá nổi bật như quảng cáo. Tầm giá có thể tìm được thứ tốt hơn.");
                        pf4.setCreatedAt(LocalDateTime.now());
                        pf4.setIsActive(true);
                        productFeedbackRepository.save(pf4);
                        savedCount++;
                        logger.debug("✓ Đánh giá 4 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 4: {}", e.getMessage());
                    }

                    try {
                        // ===== ĐáNH GIÁ 5: Vans Old Skool - 5 sao =====
                        ProductFeedback pf5 = new ProductFeedback();
                        pf5.setProduct(products.get(12 % products.size()));
                        pf5.setCustomer(customers.get(0 % customers.size()));
                        pf5.setOrder(orders.get(3 % orders.size()));
                        pf5.setRating(5);
                        pf5.setComment("Giày skate huyền thoại, mặc cả ngày cũng không mệt. Thiết kế bền bỉ, giá cả hợp lý.");
                        pf5.setCreatedAt(LocalDateTime.now());
                        pf5.setIsActive(true);
                        productFeedbackRepository.save(pf5);
                        savedCount++;
                        logger.debug("✓ Đánh giá 5 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 5: {}", e.getMessage());
                    }

                    try {
                        // ===== ĐáNH GIÁ 6: New Balance 990v5 - 4 sao =====
                        ProductFeedback pf6 = new ProductFeedback();
                        pf6.setProduct(products.get(14 % products.size()));
                        pf6.setCustomer(customers.get(4 % customers.size()));
                        pf6.setOrder(orders.get(4 % orders.size()));
                        pf6.setRating(4);
                        pf6.setComment("Giày chạy bộ rất thoải mái, bộ đệm tốt, nhưng giá khá cao. Nếu sống với ngân sách thì cân nhắc.");
                        pf6.setCreatedAt(LocalDateTime.now());
                        pf6.setIsActive(true);
                        productFeedbackRepository.save(pf6);
                        savedCount++;
                        logger.debug("✓ Đánh giá 6 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 6: {}", e.getMessage());
                    }

                    try {
                        // ===== ĐáNH GIÁ 7: Timberland 6 Inch Premium Boot - 5 sao =====
                        ProductFeedback pf7 = new ProductFeedback();
                        pf7.setProduct(products.get(16 % products.size()));
                        pf7.setCustomer(customers.get(5 % customers.size()));
                        pf7.setOrder(orders.get(5 % orders.size()));
                        pf7.setRating(5);
                        pf7.setComment("Boot da chất lượng cao, thích hợp cho mọi mùa. Da mềm, bền và không bị sứng chân. Chắc chắn sẽ mua lại!");
                        pf7.setCreatedAt(LocalDateTime.now());
                        pf7.setIsActive(true);
                        productFeedbackRepository.save(pf7);
                        savedCount++;
                        logger.debug("✓ Đánh giá 7 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 7: {}", e.getMessage());
                    }

                    try {
                        // ===== ĐáNH GIÁ 8: Nike Air Jordan 1 Retro High - 2 sao (Đánh giá tiêu cực bị ẩn) =====
                        ProductFeedback pf8 = new ProductFeedback();
                        pf8.setProduct(products.get(1 % products.size()));
                        pf8.setCustomer(customers.get(1 % customers.size()));
                        pf8.setOrder(orders.get(0 % orders.size()));
                        pf8.setRating(2);
                        pf8.setComment("Giày không đúng như mô tả, màu sắc bị lêch, chất lượng kém cỏi. Cảm thấy bị lừa dối.");
                        pf8.setCreatedAt(LocalDateTime.now());
                        pf8.setIsActive(false);
                        productFeedbackRepository.save(pf8);
                        savedCount++;
                        logger.debug("✓ Đánh giá 8 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 8: {}", e.getMessage());
                    }

                    try {
                        // ===== ĐáNH GIÁ 9: Adidas NMD R1 - 4 sao =====
                        ProductFeedback pf9 = new ProductFeedback();
                        pf9.setProduct(products.get(6 % products.size()));
                        pf9.setCustomer(customers.get(2 % customers.size()));
                        pf9.setOrder(orders.get(1 % orders.size()));
                        pf9.setRating(4);
                        pf9.setComment("Giày đẹp và thời trang, thoải mái khi mặc. Chất lượng tốt, đáng giá tiền.");
                        pf9.setCreatedAt(LocalDateTime.now());
                        pf9.setIsActive(true);
                        productFeedbackRepository.save(pf9);
                        savedCount++;
                        logger.debug("✓ Đánh giá 9 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 9: {}", e.getMessage());
                    }

                    try {
                        // ===== ĐáNH GIÁ 10: Reebok Classic Leather Legacy - 3 sao =====
                        ProductFeedback pf10 = new ProductFeedback();
                        pf10.setProduct(products.get(18 % products.size()));
                        pf10.setCustomer(customers.get(3 % customers.size()));
                        pf10.setOrder(orders.get(5 % orders.size()));
                        pf10.setRating(3);
                        pf10.setComment("Giày bình bình, không có gì đặc biệt. Có thể chọn các thương hiệu khác với giá tương tự.");
                        pf10.setCreatedAt(LocalDateTime.now());
                        pf10.setIsActive(true);
                        productFeedbackRepository.save(pf10);
                        savedCount++;
                        logger.debug("✓ Đánh giá 10 được lưu thành công");
                    } catch (Exception e) {
                        logger.error("✗ Lỗi khi lưu đánh giá 10: {}", e.getMessage());
                    }

                    logger.info("Successfully seeded {} product feedbacks with various ratings and comments!", savedCount);
                    if (savedCount < 10) {
                        logger.warn("Only {} out of 10 feedbacks were saved. Check logs above for errors.", savedCount);
                    }
                }
            } catch (Exception e) {
                logger.error("Critical error during product feedback seeding: {}", e.getMessage(), e);
            }
        };
    }
}
