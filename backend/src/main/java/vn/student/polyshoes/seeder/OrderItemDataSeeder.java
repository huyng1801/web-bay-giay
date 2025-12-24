package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.OrderItem;
import vn.student.polyshoes.model.ProductSize;
import vn.student.polyshoes.repository.OrderItemRepository;
import vn.student.polyshoes.repository.OrderRepository;
import vn.student.polyshoes.repository.ProductSizeRepository;

import java.util.List;

/**
 * Seeder dùng để khởi tạo dữ liệu chi tiết sản phẩm trong đơn hàng
 * Tự động chạy khi ứng dụng khởi động nếu bảng order_item còn trống
 * Tạo các OrderItem liên kết với Order và ProductSize
 * Quản lý mối quan hệ: OrderItem <-> Order, OrderItem <-> ProductSize
 */
@Component
@Configuration
public class OrderItemDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(OrderItemDataSeeder.class);

    /**
     * Khởi tạo dữ liệu chi tiết sản phẩm trong đơn hàng
     * @param orderItemRepository Repository dùng để lưu chi tiết sản phẩm
     * @param orderRepository Repository để lấy dữ liệu đơn hàng
     * @param productSizeRepository Repository để lấy dữ liệu kích cỡ sản phẩm
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedOrderItems(
            OrderItemRepository orderItemRepository,
            OrderRepository orderRepository,
            ProductSizeRepository productSizeRepository) {
        return args -> {
            logger.info("Bắt đầu khởi tạo dữ liệu chi tiết sản phẩm trong đơn hàng...");
            
            // Kiểm tra xem có dữ liệu chi tiết sản phẩm đã tồn tại không (check count để tránh seed lại)
            if (orderItemRepository.count() == 0) {
                // Lấy dữ liệu cần thiết từ database
                List<Order> orders = orderRepository.findAll();
                List<ProductSize> productSizes = productSizeRepository.findAll();

                if (orders.isEmpty() || productSizes.isEmpty()) {
                    logger.warn("Missing required data for OrderItems. Please seed Orders and ProductSizes first!");
                    return;
                }

                // ===== CHI TIẾT ĐƠN HÀNG 1: Order 1 =====
                // Sản phẩm 1: Nike Air Zoom Pegasus 39 - Đen - Size 42 x 1 chiếc
                OrderItem oi1 = new OrderItem();
                oi1.setOrder(orders.get(0));  // Liên kết với đơn hàng đầu tiên
                oi1.setProductSize(productSizes.get(0));  // Kích cỡ sản phẩm đầu tiên
                oi1.setQuantity(1);  // Số lượng: 1
                oi1.setUnitPrice(2499000);  // Giá đơn vị
                orderItemRepository.save(oi1);

                // Sản phẩm 2: Nike Air Zoom Pegasus 39 - Trắng - Size 40 x 1 chiếc
                OrderItem oi2 = new OrderItem();
                oi2.setOrder(orders.get(0));
                if (productSizes.size() > 1) {
                    oi2.setProductSize(productSizes.get(1));  // Kích cỡ sản phẩm thứ 2
                }
                oi2.setQuantity(1);
                oi2.setUnitPrice(2499000);
                orderItemRepository.save(oi2);

                // ===== CHI TIẾT ĐƠN HÀNG 2: Order 2 =====
                // Sản phẩm 1: Puma RS-X - Đen - Size 38 x 1 chiếc
                OrderItem oi3 = new OrderItem();
                oi3.setOrder(orders.get(1));  // Liên kết với đơn hàng thứ 2
                if (productSizes.size() > 2) {
                    oi3.setProductSize(productSizes.get(2));  // Kích cỡ sản phẩm thứ 3
                }
                oi3.setQuantity(1);
                oi3.setUnitPrice(1299000);
                orderItemRepository.save(oi3);

                // ===== CHI TIẾT ĐƠN HÀNG 3: Order 3 =====
                // Sản phẩm 1: Converse Chuck Taylor All Star - Đen - Size 40 x 1 chiếc
                OrderItem oi4 = new OrderItem();
                oi4.setOrder(orders.get(2));  // Liên kết với đơn hàng thứ 3
                if (productSizes.size() > 3) {
                    oi4.setProductSize(productSizes.get(3));  // Kích cỡ sản phẩm thứ 4
                }
                oi4.setQuantity(1);
                oi4.setUnitPrice(899000);
                orderItemRepository.save(oi4);

                // Sản phẩm 2: Converse Chuck Taylor All Star - Trắng - Size 38 x 1 chiếc
                OrderItem oi5 = new OrderItem();
                oi5.setOrder(orders.get(2));
                if (productSizes.size() > 4) {
                    oi5.setProductSize(productSizes.get(4));  // Kích cỡ sản phẩm thứ 5
                }
                oi5.setQuantity(1);
                oi5.setUnitPrice(899000);
                orderItemRepository.save(oi5);

                // ===== CHI TIẾT ĐƠN HÀNG 4: Order 4 =====
                // Sản phẩm 1: Adidas Ultraboost 22 - Đen - Size 42 x 1 chiếc
                OrderItem oi6 = new OrderItem();
                oi6.setOrder(orders.get(3));  // Liên kết với đơn hàng thứ 4
                if (productSizes.size() > 5) {
                    oi6.setProductSize(productSizes.get(5));  // Kích cỡ sản phẩm thứ 6
                }
                oi6.setQuantity(1);
                oi6.setUnitPrice(2799000);
                orderItemRepository.save(oi6);

                // Sản phẩm 2: Vans Old Skool - Đen Trắng - Size 39 x 1 chiếc
                OrderItem oi7 = new OrderItem();
                oi7.setOrder(orders.get(3));
                if (productSizes.size() > 6) {
                    oi7.setProductSize(productSizes.get(6));  // Kích cỡ sản phẩm thứ 7
                }
                oi7.setQuantity(1);
                oi7.setUnitPrice(1199000);
                orderItemRepository.save(oi7);

                // ===== CHI TIẾT ĐƠN HÀNG 5: Order 5 =====
                // Sản phẩm 1: New Balance 990v5 - Xám - Size 41 x 2 chiếc
                OrderItem oi8 = new OrderItem();
                oi8.setOrder(orders.get(4));  // Liên kết với đơn hàng thứ 5
                if (productSizes.size() > 7) {
                    oi8.setProductSize(productSizes.get(7));  // Kích cỡ sản phẩm thứ 8
                }
                oi8.setQuantity(2);  // Số lượng: 2
                oi8.setUnitPrice(2199000);
                orderItemRepository.save(oi8);

                // ===== CHI TIẾT ĐƠN HÀNG 6: Order 6 =====
                // Sản phẩm 1: Timberland 6 Inch Premium Boot - Nâu - Size 44 x 1 chiếc
                OrderItem oi9 = new OrderItem();
                oi9.setOrder(orders.get(5));  // Liên kết với đơn hàng thứ 6
                if (productSizes.size() > 8) {
                    oi9.setProductSize(productSizes.get(8));  // Kích cỡ sản phẩm thứ 9
                }
                oi9.setQuantity(1);
                oi9.setUnitPrice(2999000);
                orderItemRepository.save(oi9);

                logger.info("Successfully seeded order items linking orders with product sizes!");
            }
        };
    }
}
