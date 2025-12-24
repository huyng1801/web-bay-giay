package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.enums.OrderStatus;
import vn.student.polyshoes.enums.PaymentMethod;
import vn.student.polyshoes.model.Customer;
import vn.student.polyshoes.model.Guest;
import vn.student.polyshoes.model.Order;
import vn.student.polyshoes.model.Shipping;
import vn.student.polyshoes.model.Voucher;
import vn.student.polyshoes.repository.CustomerRepository;
import vn.student.polyshoes.repository.GuestRepository;
import vn.student.polyshoes.repository.OrderRepository;
import vn.student.polyshoes.repository.ShippingRepository;
import vn.student.polyshoes.repository.VoucherRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Seeder dùng để khởi tạo dữ liệu đơn hàng
 * Tự động chạy khi ứng dụng khởi động nếu bảng order còn trống
 * Tạo các đơn hàng liên kết với khách hàng/khách vãng lai, voucher, và phương thức vận chuyển
 * Quản lý mối quan hệ: Order <-> Customer/Guest, Order <-> Voucher, Order <-> Shipping
 */
@Component
@Configuration
public class OrderDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(OrderDataSeeder.class);

    /**
     * Khởi tạo dữ liệu đơn hàng
     * @param orderRepository Repository dùng để lưu đơn hàng
     * @param customerRepository Repository để lấy dữ liệu khách hàng
     * @param guestRepository Repository để lấy dữ liệu khách vãng lai
     * @param voucherRepository Repository để lấy dữ liệu voucher
     * @param shippingRepository Repository để lấy dữ liệu phương thức vận chuyển
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedOrders(
            OrderRepository orderRepository,
            CustomerRepository customerRepository,
            GuestRepository guestRepository,
            VoucherRepository voucherRepository,
            ShippingRepository shippingRepository) {
        return args -> {
            try {
                logger.info("=".repeat(80));
                logger.info("Starting Order Data Seeding Process");
                logger.info("=".repeat(80));

                // Kiểm tra xem bảng order đã có dữ liệu hay chưa
                long existingOrderCount = orderRepository.count();
                if (existingOrderCount > 0) {
                    logger.info("✓ Order table already has {} record(s). Skipping seeding orders.", existingOrderCount);
                    logger.info("=".repeat(80));
                    return;
                }
                logger.info("✓ Order table is empty. Ready to seed orders.");

                // Lấy dữ liệu cần thiết từ database
                List<Customer> customers = customerRepository.findAll();
                List<Guest> guests = guestRepository.findAll();
                List<Voucher> vouchers = voucherRepository.findAll();
                List<Shipping> shippings = shippingRepository.findAll();

                logger.info("Fetched data: Customers={}, Guests={}, Vouchers={}, Shippings={}",
                           customers.size(), guests.size(), vouchers.size(), shippings.size());

                // Kiểm tra xem có dữ liệu bắt buộc hay không
                if (customers.isEmpty()) {
                    logger.error("✗ CRITICAL: No customers found. Please seed Customers first!");
                    logger.info("=".repeat(80));
                    return;
                }
                if (guests.isEmpty()) {
                    logger.error("✗ CRITICAL: No guests found. Please seed Guests first!");
                    logger.info("=".repeat(80));
                    return;
                }
                if (vouchers.isEmpty()) {
                    logger.error("✗ CRITICAL: No vouchers found. Please seed Vouchers first!");
                    logger.info("=".repeat(80));
                    return;
                }
                if (shippings.isEmpty()) {
                    logger.error("✗ CRITICAL: No shippings found. Please seed Shipping first!");
                    logger.info("=".repeat(80));
                    return;
                }

                logger.info("✓ All required data is available. Proceeding with order seeding...");
                logger.info("-".repeat(80));

                int successCount = 0;
                int failCount = 0;

                try {
                    // ===== ĐƠN HÀNG 1: Khách hàng đăng ký + Voucher =====
                    String orderId1 = generateOrderId(orderRepository, "ORD");
                    if (validateOrderId(orderId1)) {
                        Order o1 = new Order();
                        o1.setOrderId(orderId1);
                        o1.setOrderNote("Giao trước 10h sáng nếu có thể");
                        o1.setPaymentMethod(PaymentMethod.VNPAY);
                        o1.setTotalPrice(1890000);
                        o1.setOriginalPrice(2100000L);
                        o1.setVoucherDiscount(210000L);
                        o1.setVoucher(vouchers.get(0 % vouchers.size()));
                        o1.setCustomer(customers.get(0 % customers.size()));
                        o1.setGuest(null);
                        o1.setIsPaid(true);
                        o1.setPaidAt(new Date());
                        o1.setShipping(shippings.get(0 % shippings.size()));
                        o1.setOrderStatus(OrderStatus.PROCESSING);
                        o1.setCreatedAt(new Date());
                        o1.setUpdatedAt(new Date());
                        orderRepository.save(o1);
                        successCount++;
                        logger.info("✓ Order 1 (ID: {}) saved successfully [Customer + Voucher]", orderId1);
                    } else {
                        logger.error("✗ Invalid OrderId format: {}", orderId1);
                        failCount++;
                    }
                } catch (Exception e) {
                    logger.error("✗ Error saving Order 1: {} | {}", e.getClass().getSimpleName(), e.getMessage());
                    failCount++;
                }

                try {
                    // ===== ĐƠN HÀNG 2: Khách vãng lai, không dùng voucher =====
                    String orderId2 = generateOrderId(orderRepository, "ORD");
                    if (validateOrderId(orderId2)) {
                        Order o2 = new Order();
                        o2.setOrderId(orderId2);
                        o2.setOrderNote("Tuyệt đối không để gặp nước");
                        o2.setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY);
                        o2.setTotalPrice(1299000);
                        o2.setOriginalPrice(1299000L);
                        o2.setVoucherDiscount(0L);
                        o2.setVoucher(null);
                        o2.setCustomer(null);
                        o2.setGuest(guests.get(0 % guests.size()));
                        o2.setIsPaid(false);
                        o2.setPaidAt(null);
                        o2.setShipping(shippings.get(Math.min(1, shippings.size() - 1)));
                        o2.setOrderStatus(OrderStatus.PENDING_PAYMENT);
                        o2.setCreatedAt(new Date());
                        o2.setUpdatedAt(new Date());
                        orderRepository.save(o2);
                        successCount++;
                        logger.info("✓ Order 2 (ID: {}) saved successfully [Guest + No Voucher]", orderId2);
                    } else {
                        logger.error("✗ Invalid OrderId format: {}", orderId2);
                        failCount++;
                    }
                } catch (Exception e) {
                    logger.error("✗ Error saving Order 2: {} | {}", e.getClass().getSimpleName(), e.getMessage());
                    failCount++;
                }

                try {
                    // ===== ĐƠN HÀNG 3: Khách hàng + Voucher FIRST100 =====
                    String orderId3 = generateOrderId(orderRepository, "ORD");
                    if (validateOrderId(orderId3)) {
                        Order o3 = new Order();
                        o3.setOrderId(orderId3);
                        o3.setOrderNote("Bao gồm hộp, dây buộc");
                        o3.setPaymentMethod(PaymentMethod.BANK_TRANSFER);
                        o3.setTotalPrice(649000);
                        o3.setOriginalPrice(750000L);
                        o3.setVoucherDiscount(100000L);
                        o3.setVoucher(vouchers.get(Math.min(1, vouchers.size() - 1)));
                        o3.setCustomer(customers.get(Math.min(1, customers.size() - 1)));
                        o3.setGuest(null);
                        o3.setIsPaid(true);
                        o3.setPaidAt(new Date());
                        o3.setShipping(shippings.get(Math.min(2, shippings.size() - 1)));
                        o3.setOrderStatus(OrderStatus.SHIPPED);
                        o3.setCreatedAt(new Date());
                        o3.setUpdatedAt(new Date());
                        orderRepository.save(o3);
                        successCount++;
                        logger.info("✓ Order 3 (ID: {}) saved successfully [Customer + Voucher FIRST100]", orderId3);
                    } else {
                        logger.error("✗ Invalid OrderId format: {}", orderId3);
                        failCount++;
                    }
                } catch (Exception e) {
                    logger.error("✗ Error saving Order 3: {} | {}", e.getClass().getSimpleName(), e.getMessage());
                    failCount++;
                }

                try {
                    // ===== ĐƠN HÀNG 4: Khách vãng lai + Voucher =====
                    String orderId4 = generateOrderId(orderRepository, "ORD");
                    if (validateOrderId(orderId4)) {
                        Order o4 = new Order();
                        o4.setOrderId(orderId4);
                        o4.setOrderNote("Ghi chú: Cần giao nhanh");
                        o4.setPaymentMethod(PaymentMethod.VNPAY);
                        o4.setTotalPrice(1535000);
                        o4.setOriginalPrice(1800000L);
                        o4.setVoucherDiscount(265000L);
                        o4.setVoucher(vouchers.get(Math.min(2, vouchers.size() - 1)));
                        o4.setCustomer(null);
                        o4.setGuest(guests.get(Math.min(1, guests.size() - 1)));
                        o4.setIsPaid(true);
                        o4.setPaidAt(new Date());
                        o4.setShipping(shippings.get(0 % shippings.size()));
                        o4.setOrderStatus(OrderStatus.DELIVERED);
                        o4.setCreatedAt(new Date());
                        o4.setUpdatedAt(new Date());
                        orderRepository.save(o4);
                        successCount++;
                        logger.info("✓ Order 4 (ID: {}) saved successfully [Guest + Voucher SUMMER15]", orderId4);
                    } else {
                        logger.error("✗ Invalid OrderId format: {}", orderId4);
                        failCount++;
                    }
                } catch (Exception e) {
                    logger.error("✗ Error saving Order 4: {} | {}", e.getClass().getSimpleName(), e.getMessage());
                    failCount++;
                }

                try {
                    // ===== ĐƠN HÀNG 5: Khách hàng + Voucher VIP50K =====
                    String orderId5 = generateOrderId(orderRepository, "ORD");
                    if (validateOrderId(orderId5)) {
                        Order o5 = new Order();
                        o5.setOrderId(orderId5);
                        o5.setOrderNote("");
                        o5.setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY);
                        o5.setTotalPrice(1249000);
                        o5.setOriginalPrice(1300000L);
                        o5.setVoucherDiscount(50000L);
                        o5.setVoucher(vouchers.get(Math.min(3, vouchers.size() - 1)));
                        o5.setCustomer(customers.get(Math.min(2, customers.size() - 1)));
                        o5.setGuest(null);
                        o5.setIsPaid(false);
                        o5.setPaidAt(null);
                        o5.setShipping(shippings.get(Math.min(1, shippings.size() - 1)));
                        o5.setOrderStatus(OrderStatus.PENDING_PAYMENT);
                        o5.setCreatedAt(new Date());
                        o5.setUpdatedAt(new Date());
                        orderRepository.save(o5);
                        successCount++;
                        logger.info("✓ Order 5 (ID: {}) saved successfully [Customer + Voucher VIP50K]", orderId5);
                    } else {
                        logger.error("✗ Invalid OrderId format: {}", orderId5);
                        failCount++;
                    }
                } catch (Exception e) {
                    logger.error("✗ Error saving Order 5: {} | {}", e.getClass().getSimpleName(), e.getMessage());
                    failCount++;
                }

                try {
                    // ===== ĐƠN HÀNG 6: Khách hàng + Voucher MONTHLY10 =====
                    String orderId6 = generateOrderId(orderRepository, "ORD");
                    if (validateOrderId(orderId6)) {
                        Order o6 = new Order();
                        o6.setOrderId(orderId6);
                        o6.setOrderNote("Có thể để lại tại lễ tân");
                        o6.setPaymentMethod(PaymentMethod.BANK_TRANSFER);
                        o6.setTotalPrice(674500);
                        o6.setOriginalPrice(750000L);
                        o6.setVoucherDiscount(75000L);
                        o6.setVoucher(vouchers.get(Math.min(5, vouchers.size() - 1)));
                        o6.setCustomer(customers.get(Math.min(3, customers.size() - 1)));
                        o6.setGuest(null);
                        o6.setIsPaid(true);
                        o6.setPaidAt(new Date());
                        o6.setShipping(shippings.get(Math.min(2, shippings.size() - 1)));
                        o6.setOrderStatus(OrderStatus.PROCESSING);
                        o6.setCreatedAt(new Date());
                        o6.setUpdatedAt(new Date());
                        orderRepository.save(o6);
                        successCount++;
                        logger.info("✓ Order 6 (ID: {}) saved successfully [Customer + Voucher MONTHLY10]", orderId6);
                    } else {
                        logger.error("✗ Invalid OrderId format: {}", orderId6);
                        failCount++;
                    }
                } catch (Exception e) {
                    logger.error("✗ Error saving Order 6: {} | {}", e.getClass().getSimpleName(), e.getMessage());
                    failCount++;
                }

                logger.info("-".repeat(80));
                logger.info("Order Seeding Summary:");
                logger.info("  ✓ Successful: {} order(s)", successCount);
                logger.info("  ✗ Failed: {} order(s)", failCount);
                logger.info("  ✓ Total in database: {} order(s)", orderRepository.count());
                
                if (failCount == 0 && successCount == 6) {
                    logger.info("✓ All orders seeded successfully!");
                } else if (successCount > 0) {
                    logger.warn("⚠ Partial seeding completed. {} out of 6 orders saved.", successCount);
                } else {
                    logger.error("✗ Order seeding failed completely!");
                }
                logger.info("=".repeat(80));

            } catch (Exception e) {
                logger.error("=".repeat(80));
                logger.error("CRITICAL ERROR during order seeding!");
                logger.error("Error Type: {}", e.getClass().getSimpleName());
                logger.error("Error Message: {}", e.getMessage());
                logger.error("Stack Trace:", e);
                logger.error("=".repeat(80));
            }
        };
    }

    /**
     * Validate OrderId format
     * @param orderId ID cần validate
     * @return true nếu valid, false nếu invalid
     */
    private boolean validateOrderId(String orderId) {
        // Kiểm tra null
        if (orderId == null || orderId.isEmpty()) {
            logger.error("OrderId is null or empty");
            return false;
        }
        // Kiểm tra độ dài chính xác 20 ký tự
        if (orderId.length() != 20) {
            logger.error("OrderId length is {}, expected 20: {}", orderId.length(), orderId);
            return false;
        }
        // Kiểm tra format (ORD + số)
        if (!orderId.matches("ORD\\d{17}")) {
            logger.error("OrderId format is invalid (must be ORD + 17 digits): {}", orderId);
            return false;
        }
        return true;
    }

    /**
     * Sinh một ID đơn hàng duy nhất, đúng 20 ký tự
     * Format: ORD + số đơn hàng (6 số) + timestamp (11 số)
     * Ví dụ: ORD000001170351040000
     * @param orderRepository Repository để kiểm tra trùng
     * @param prefix Tiền tố (ORD)
     * @return OrderId duy nhất, chính xác 20 ký tự
     */
    private String generateOrderId(OrderRepository orderRepository, String prefix) {
        int maxAttempts = 20;
        int attempt = 0;

        while (attempt < maxAttempts) {
            // Lấy số đơn hàng tiếp theo
            long orderNumber = orderRepository.countByOrderIdStartingWith(prefix) + 1;
            
            // Lấy phần timestamp (lấy 11 ký tự cuối của timestamp)
            long timestamp = System.currentTimeMillis();
            String timestampStr = String.valueOf(timestamp);
            String timestampPart = timestampStr.length() > 11 
                ? timestampStr.substring(timestampStr.length() - 11) 
                : String.format("%011d", timestamp);

            // Tạo ID: ORD + số đơn hàng (6 chữ số) + timestamp (11 chữ số) = 3 + 6 + 11 = 20 ký tự
            String orderId = String.format("%s%06d%s", prefix, orderNumber, timestampPart);

            // Đảm bảo chính xác 20 ký tự
            if (orderId.length() != 20) {
                if (orderId.length() > 20) {
                    orderId = orderId.substring(0, 20);
                } else {
                    orderId = String.format("%-20s", orderId).replace(' ', '0');
                }
            }

            logger.debug("Attempting to create OrderId: {} (length: {})", orderId, orderId.length());

            // Kiểm tra xem ID này đã tồn tại chưa bằng findByOrderId
            Optional<Order> existingOrder = orderRepository.findByOrderId(orderId);
            if (existingOrder.isEmpty()) {
                logger.info("✓ Generated unique OrderId: {} (attempt {}/{})", orderId, attempt + 1, maxAttempts);
                return orderId;
            }

            attempt++;
            logger.debug("⚠ OrderId {} already exists, retrying... (attempt {}/{})", orderId, attempt, maxAttempts);

            // Chờ một chút trước khi tạo tiếp
            try {
                Thread.sleep(5);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                logger.warn("Thread interrupted while generating OrderId");
            }
        }

        // Nếu vẫn không thể sinh ID duy nhất sau nhiều lần, dùng UUID + timestamp
        long uuid = Math.abs(UUID.randomUUID().getLeastSignificantBits());
        String fallbackId = String.format("%s%013d", prefix, uuid).substring(0, 20);
        logger.warn("⚠ Using fallback OrderId after {} attempts: {}", maxAttempts, fallbackId);
        return fallbackId;
    }
}
