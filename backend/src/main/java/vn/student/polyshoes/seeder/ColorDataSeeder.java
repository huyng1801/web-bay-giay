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

                // Danh sách các màu sắc giày phổ biến và thời thượng
                List<String> shoeColors = Arrays.asList(
                    // Màu cơ bản
                    "Đen",                    // Màu cổ điển, dễ phối đồ
                    "Trắng",                  // Màu sạch, thoáng mát
                    "Xám",                    // Màu trung tính, thanh lịch
                    "Nâu",                    // Màu ấm, phù hợp mùa thu đông
                    "Xám đậm",               // Xám đậm, chuyên nghiệp
                    "Xám nhạt",               // Xám sáng, nhẹ nhàng
                    
                    // Màu nổi bật
                    "Đỏ",                     // Màu nổi bật, thể thao
                    "Xanh navy",              // Xám xanh, chuyên nghiệp
                    "Xanh dương",            // Màu biển, tươi mát
                    "Xanh lá",               // Màu tự nhiên
                    "Vàng",                   // Màu sáng, năng động
                    "Hồng",                   // Màu nữ tính
                    "Cam",                    // Màu ấm, hưng phấn
                    "Tím",                    // Màu quý phái
                    
                    // Tổ hợp màu phổ biến
                    "Đen trắng",             // Tổ hợp kinh điển
                    "Trắng đen",             // Ngược lại của đen trắng
                    "Trắng xanh",            // Tổ hợp sáng, tươi mát
                    "Trắng đỏ",             // Tổ hợp ấm tương
                    "Đen đỏ",               // Tổ hợp mạnh mẽ
                    "Xám trắng",             // Tổ hợp nhẹ nhàng
                    "Nâu đậm",               // Nâu đậm, sang trọng
                    
                    // Màu kim loại và đặc biệt
                    "Bạc",                   // Màu kim loại hiện đại
                    "Vàng kim",               // Vàng kim loại
                    "Holographic",           // Màu cháy đọc sắc
                    "Gradient"              // Màu chuyển đổi
                );

                // Lặp qua từng màu và lưu vào database
                int colorCount = 0;
                for (String colorName : shoeColors) {
                    Color color = new Color();
                    color.setColorName(colorName);
                    color.setIsActive(true);
                    color.setCreatedAt(new Date());
                    color.setUpdatedAt(new Date());
                    colorRepository.save(color);
                    colorCount++;
                    logger.debug("Đã tạo màu giày: {}", colorName);
                }

                logger.info("Đã khởi tạo thành công {} màu sắc giày!", colorCount);
            } else {
                logger.info("Dữ liệu màu sắc đã tồn tại, bỏ qua khởi tạo.");
            }
        };
    }
}