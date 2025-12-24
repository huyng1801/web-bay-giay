package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Color;
import vn.student.polyshoes.repository.ColorRepository;

import java.util.Date;
import java.util.Arrays;
import java.util.List;

/**
 * Seeder dùng để khởi tạo dữ liệu màu sắc giày
 * Tự động chạy khi ứng dụng khởi động nếu bảng color còn trống
 */
@Component
@Configuration
public class ColorDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ColorDataSeeder.class);

    /**
     * Khởi tạo các màu sắc giày có sẵn
     * @param colorRepository Repository dùng để lưu color
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedColors(ColorRepository colorRepository) {
        return args -> {
            if (colorRepository.count() == 0) { // Ngăn chặn tạo dữ liệu trùng lặp
                logger.info("Bắt đầu khởi tạo dữ liệu màu sắc giày...");

                // Danh sách các màu sắc giày phổ biến
                List<String> shoeColors = Arrays.asList(
                    "Đen",      // Màu cổ điển, phù hợp đa dạng
                    "Trắng",    // Màu trung tính, tưới sáng
                    "Xanh navy", // Màu đen xanh, chuyên nghiệp
                    "Xam",      // Màu trung tính
                    "Nâu",      // Màu ấm, phong cách casual
                    "Đỏ",       // Màu nổi bật
                    "Xanh dương",// Màu biển
                    "Xanh lá",  // Màu tự nhiên
                    "Vàng",     // Màu sáng, năng động
                    "Hồng",     // Màu tưới vui
                    "Bạc",      // Màu hiện đại, lạnh
                    "Tím",      // Màu quý phái
                    "Cam",      // Màu ấm áp
                    "Đen trắng",// Tổ hợp màu cổ điển
                    "Trắng xanh",// Tổ hợp màu sáng
                    "Trắng đỏ", // Tổ hợp màu nổi bật
                    "Trắng vàng",// Tổ hợp màu ấm
                    "Đen đỏ",   // Tổ hợp màu mạnh mẽ
                    "Đen xám",  // Tổ hợp màu trung tính
                    "Xám trắng",// Tổ hợp màu nhẹ
                    "Nâu đỏ",   // Tổ hợp màu ấm
                    "Nâu sáng" // Tổ hợp màu tưới
                );

                // Lặp qua từng màu và lưu vào database
                for (String colorName : shoeColors) {
                    Color color = new Color();
                    color.setColorName(colorName);
                    color.setIsActive(true);
                    color.setCreatedAt(new Date());
                    color.setUpdatedAt(new Date());
                    colorRepository.save(color);
                    logger.debug("Đã tạo màu giày: {}", colorName);
                }

                logger.info("Khởi tạo {} màu sắc giày thành công", shoeColors.size());
            } else {
                logger.info("Dữ liệu màu sắc đã tồn tại, bỏ qua khởi tạo");
            }
        };
    }
}