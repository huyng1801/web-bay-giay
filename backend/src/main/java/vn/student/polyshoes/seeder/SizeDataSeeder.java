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
public class SizeDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(SizeDataSeeder.class);

    @Bean
    CommandLineRunner seedSizes(SizeRepository sizeRepository) {
        return args -> {
            if (sizeRepository.count() == 0) { // Prevents duplicate entries
                logger.info("Starting to seed shoe sizes...");

                // Shoe sizes
                List<String> shoeSizes = Arrays.asList("36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46");

                for (String sizeValue : shoeSizes) {
                    Size size = new Size();
                    size.setSizeValue(sizeValue);
                    size.setIsActive(true);
                    size.setCreatedAt(new Date());
                    size.setUpdatedAt(new Date());
                    sizeRepository.save(size);
                    logger.debug("Created shoe size: {}", sizeValue);
                }

                logger.info("Successfully seeded {} shoe sizes", shoeSizes.size());
            } else {
                logger.info("Sizes already exist, skipping size seeding");
            }
        };
    }
}