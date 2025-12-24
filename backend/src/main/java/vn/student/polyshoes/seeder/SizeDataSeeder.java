
// Seeder dùng để khởi tạo dữ liệu kích cỡ giày (Size)
// Tự động chạy khi ứng dụng khởi động nếu bảng size còn trống
package vn.student.polyshoes.seeder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import vn.student.polyshoes.model.Size;
import vn.student.polyshoes.repository.SizeRepository;

import java.util.Date;
import java.util.Arrays;
import java.util.List;

@Component
@Configuration

/**
 * Seeder khởi tạo danh sách kích cỡ giày tiêu chuẩn cho hệ thống
 * Tạo các size từ 36 đến 46, trạng thái hoạt động
 */
public class SizeDataSeeder {

    // Logger để ghi log quá trình seed dữ liệu
    private static final Logger logger = LoggerFactory.getLogger(SizeDataSeeder.class);

    /**
     * Khởi tạo dữ liệu kích cỡ giày
     * @param sizeRepository Repository dùng để lưu kích cỡ
     * @return CommandLineRunner thực thi khi ứng dụng khởi động
     */
    @Bean
    CommandLineRunner seedSizes(SizeRepository sizeRepository) {
        return args -> {
            // Nếu bảng size chưa có dữ liệu thì mới seed
            if (sizeRepository.count() == 0) {
                logger.info("Bắt đầu khởi tạo danh sách kích cỡ giày...");

                // Danh sách các kích cỡ giày tiêu chuẩn (từ 36 đến 46)
                List<String> shoeSizes = Arrays.asList("36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46");

                // Lặp qua từng kích cỡ và lưu vào database
                for (String sizeValue : shoeSizes) {
                    Size size = new Size();
                    size.setSizeValue(sizeValue); // Gán giá trị size
                    size.setIsActive(true); // Đánh dấu size đang hoạt động
                    size.setCreatedAt(new Date()); // Thời gian tạo
                    size.setUpdatedAt(new Date()); // Thời gian cập nhật
                    sizeRepository.save(size); // Lưu vào database
                    logger.debug("Đã tạo kích cỡ giày: {}", sizeValue);
                }

                logger.info("Đã khởi tạo thành công {} kích cỡ giày", shoeSizes.size());
            } else {
                logger.info("Dữ liệu kích cỡ đã tồn tại, bỏ qua seeding");
            }
        };
    }
}