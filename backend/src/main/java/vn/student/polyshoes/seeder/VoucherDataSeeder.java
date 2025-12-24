package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Voucher;
import vn.student.polyshoes.repository.VoucherRepository;

import java.time.LocalDate;

/**
 * Seeder dùng để khởi tạo dữ liệu voucher/mã giảm giá
 * Tự động chạy khi ứng dụng khởi động nếu bảng vouchers còn trống
 * Tạo các voucher với các loại giảm giá khác nhau (%, cố định) và điều kiện áp dụng
 */
@Component
@Configuration
public class VoucherDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(VoucherDataSeeder.class);

    /**
     * Khởi tạo dữ liệu voucher
     * @param voucherRepository Repository dùng để lưu voucher
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedVouchers(VoucherRepository voucherRepository) {
        return args -> {
            logger.info("Bắt đầu khởi tạo dữ liệu voucher...");

            // ===== VOUCHER 1: Giảm giá 20% cho đơn hàng tối thiểu 100k =====
            if (voucherRepository.findByCode("SALE20").isEmpty()) {
                Voucher v1 = new Voucher();
                v1.setCode("SALE20");
                v1.setName("Giảm 20% - Đơn hàng trên 100k");
                v1.setDescription("Voucher giảm giá 20% cho tất cả khách hàng. Áp dụng cho đơn hàng từ 100,000 VNĐ trở lên");
                v1.setDiscountType(Voucher.DiscountType.PERCENTAGE);
                v1.setDiscountValue(20.0);
                v1.setMaxDiscount(500000.0);  // Giảm tối đa 500k
                v1.setMinOrderValue(100000.0);  // Giá trị đơn tối thiểu
                v1.setConditionType(Voucher.ConditionType.ALL_CUSTOMERS);
                v1.setStartDate(LocalDate.now());
                v1.setEndDate(LocalDate.now().plusDays(90));  // Có hiệu lực 90 ngày
                v1.setUsageLimit(1000);  // Sử dụng được tối đa 1000 lần
                v1.setUsedCount(0);
                voucherRepository.save(v1);
            }

            // ===== VOUCHER 2: Giảm 100k cho đơn hàng đầu tiên =====
            if (voucherRepository.findByCode("FIRST100").isEmpty()) {
                Voucher v2 = new Voucher();
                v2.setCode("FIRST100");
                v2.setName("Giảm 100k - Đơn hàng đầu tiên");
                v2.setDescription("Voucher đặc biệt dành cho khách hàng mới. Giảm 100,000 VNĐ cho đơn hàng đầu tiên");
                v2.setDiscountType(Voucher.DiscountType.FIXED);
                v2.setDiscountValue(100000.0);  // Giảm cố định 100k
                v2.setMinOrderValue(500000.0);  // Giá trị đơn tối thiểu 500k
                v2.setConditionType(Voucher.ConditionType.FIRST_ORDER);
                v2.setStartDate(LocalDate.now());
                v2.setEndDate(LocalDate.now().plusDays(60));  // Có hiệu lực 60 ngày
                v2.setUsageLimit(500);  // Sử dụng được tối đa 500 lần
                v2.setUsedCount(0);
                voucherRepository.save(v2);
            }

            // ===== VOUCHER 3: Giảm 15% - Đơn hàng từ 200k =====
            if (voucherRepository.findByCode("SUMMER15").isEmpty()) {
                Voucher v3 = new Voucher();
                v3.setCode("SUMMER15");
                v3.setName("Giảm 15% - Mùa hè");
                v3.setDescription("Khuyến mại mùa hè - Giảm 15% cho đơn hàng từ 200,000 VNĐ");
                v3.setDiscountType(Voucher.DiscountType.PERCENTAGE);
                v3.setDiscountValue(15.0);
                v3.setMaxDiscount(300000.0);  // Giảm tối đa 300k
                v3.setMinOrderValue(200000.0);
                v3.setConditionType(Voucher.ConditionType.ORDER_VALUE);
                v3.setStartDate(LocalDate.now());
                v3.setEndDate(LocalDate.now().plusDays(45));
                v3.setUsageLimit(800);
                v3.setUsedCount(0);
                voucherRepository.save(v3);
            }

            // ===== VOUCHER 4: Giảm 50k - Mã khuyến mại đặc biệt =====
            if (voucherRepository.findByCode("VIP50K").isEmpty()) {
                Voucher v4 = new Voucher();
                v4.setCode("VIP50K");
                v4.setName("Giảm 50k - Khách hàng VIP");
                v4.setDescription("Mã giảm giá dành cho khách hàng VIP/Thành viên thường xuyên. Giảm 50,000 VNĐ");
                v4.setDiscountType(Voucher.DiscountType.FIXED);
                v4.setDiscountValue(50000.0);
                v4.setMinOrderValue(300000.0);
                v4.setConditionType(Voucher.ConditionType.TOTAL_PURCHASED);
                v4.setConditionValue(1000000.0);  // Áp dụng cho khách đã mua trên 1 triệu
                v4.setStartDate(LocalDate.now());
                v4.setEndDate(LocalDate.now().plusDays(180));  // Có hiệu lực 180 ngày
                v4.setUsageLimit(200);  // Số lần sử dụng giới hạn cho VIP
                v4.setUsedCount(0);
                voucherRepository.save(v4);
            }

            // ===== VOUCHER 5: Giảm 25% - Voucher Black Friday (sắp tới) =====
            if (voucherRepository.findByCode("BLACKFRI25").isEmpty()) {
                Voucher v5 = new Voucher();
                v5.setCode("BLACKFRI25");
                v5.setName("Giảm 25% - Black Friday");
                v5.setDescription("Voucher đặc biệt cho sự kiện Black Friday. Giảm 25% cho tất cả sản phẩm");
                v5.setDiscountType(Voucher.DiscountType.PERCENTAGE);
                v5.setDiscountValue(25.0);
                v5.setMaxDiscount(1000000.0);  // Giảm tối đa 1 triệu
                v5.setMinOrderValue(150000.0);
                v5.setConditionType(Voucher.ConditionType.SPECIFIC_DATE);
                v5.setConditionValue(1125.0);  // Ngày Black Friday tháng 11
                v5.setStartDate(LocalDate.of(2025, 11, 1));  // Bắt đầu tháng 11
                v5.setEndDate(LocalDate.of(2025, 11, 30));  // Kết thúc tháng 11
                v5.setUsageLimit(2000);
                v5.setUsedCount(0);
                voucherRepository.save(v5);
            }

            // ===== VOUCHER 6: Giảm 10% - Voucher tổng quát hàng tháng =====
            if (voucherRepository.findByCode("MONTHLY10").isEmpty()) {
                Voucher v6 = new Voucher();
                v6.setCode("MONTHLY10");
                v6.setName("Giảm 10% - Voucher hàng tháng");
                v6.setDescription("Voucher cơ bản hàng tháng - Giảm 10% cho tất cả khách hàng");
                v6.setDiscountType(Voucher.DiscountType.PERCENTAGE);
                v6.setDiscountValue(10.0);
                v6.setMaxDiscount(200000.0);  // Giảm tối đa 200k
                v6.setMinOrderValue(50000.0);  // Ngưỡng tối thiểu thấp
                v6.setConditionType(Voucher.ConditionType.ALL_CUSTOMERS);
                v6.setStartDate(LocalDate.now());
                v6.setEndDate(LocalDate.now().plusDays(30));  // Có hiệu lực 30 ngày
                v6.setUsageLimit(5000);  // Số lần sử dụng nhiều
                v6.setUsedCount(0);
                voucherRepository.save(v6);
            }

            logger.info("Successfully seeded vouchers with different discount types and conditions!");
        };
    }
}
