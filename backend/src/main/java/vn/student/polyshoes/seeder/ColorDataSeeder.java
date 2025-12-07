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

@Component
@Configuration
public class ColorDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(ColorDataSeeder.class);

    @Bean
    CommandLineRunner seedColors(ColorRepository colorRepository) {
        return args -> {
            if (colorRepository.count() == 0) { // Prevents duplicate entries
                logger.info("Starting to seed shoe colors...");

                // Colors used in shoes
                List<String> shoeColors = Arrays.asList(
                    "Đen",
                    "Trắng",
                    "Xanh navy",
                    "Xam",
                    "Nâu",
                    "Đỏ",
                    "Xanh dương",
                    "Xanh lá",
                    "Vàng",
                    "Hồng",
                    "Bạc",
                    "Tím",
                    "Cam",
                    "Đen trắng",
                    "Trắng xanh",
                    "Trắng đỏ",
                    "Trắng vàng",
                    "Đen đỏ",
                    "Đen xám",
                    "Xám trắng",
                    "Nâu đỏ",
                    "Nâu sáng"
                );

                for (String colorName : shoeColors) {
                    Color color = new Color();
                    color.setColorName(colorName);
                    color.setIsActive(true);
                    color.setCreatedAt(new Date());
                    color.setUpdatedAt(new Date());
                    colorRepository.save(color);
                    logger.debug("Created shoe color: {}", colorName);
                }

                logger.info("Successfully seeded {} shoe colors", shoeColors.size());
            } else {
                logger.info("Colors already exist, skipping color seeding");
            }
        };
    }
}