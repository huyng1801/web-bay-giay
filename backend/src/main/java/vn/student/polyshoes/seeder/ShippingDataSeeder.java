package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.enums.ShippingType;
import vn.student.polyshoes.model.Shipping;
import vn.student.polyshoes.repository.ShippingRepository;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

/**
 * Seeder dùng để khởi tạo dữ liệu phương thức vận chuyển
 * Tự động chạy khi ứng dụng khởi động nếu bảng shipping còn trống
 */
@Component
public class ShippingDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ShippingDataSeeder.class);

    /**
     * Khởi tạo các phương thức vận chuyển
     * @param shippingRepository Repository dùng để lưu shipping
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedShippings(ShippingRepository shippingRepository) {
        return args -> {
            if (shippingRepository.count() == 0) {
                logger.info("Bắt đầu khởi tạo 5 phương thức vận chuyển...");

                List<Shipping> shippingMethods = Arrays.asList(
                    createShipping("SHIPPER_1", "Đơn vị vận chuyển 1", 20000, "1-3 ngày", ShippingType.NORTHERN),
                    createShipping("SHIPPER_2", "Đơn vị vận chuyển 2", 25000, "2-4 ngày", ShippingType.NORTHERN),
                    createShipping("SHIPPER_3", "Đơn vị vận chuyển 3", 30000, "3-5 ngày", ShippingType.NORTHERN),
                    createShipping("SHIPPER_4", "Đơn vị vận chuyển 4", 15000, "1-2 ngày", ShippingType.NORTHERN),
                    createShipping("SHIPPER_5", "Đơn vị vận chuyển 5", 22000, "2-3 ngày", ShippingType.NORTHERN)
                );

                shippingRepository.saveAll(shippingMethods);
                logger.info("Successfully seeded {} generic shipping methods", shippingMethods.size());
            } else {
                logger.info("Shipping methods already exist, skipping seeding");
            }
        };
    }

    /**
     * Tạo một shipping method
     */
    private Shipping createShipping(String code, String name, Integer fee, String deliveryTime, ShippingType shippingType) {
        Shipping shipping = new Shipping();
        shipping.setShippingCode(code);
        shipping.setShippingName(name);
        shipping.setShippingFee(fee);
        shipping.setDeliveryTime(deliveryTime);
        shipping.setShippingType(shippingType);
        shipping.setIsActive(true);
        
        Timestamp now = new Timestamp(System.currentTimeMillis());
        shipping.setCreatedAt(now);
        shipping.setUpdatedAt(now);
        
        return shipping;
    }
}