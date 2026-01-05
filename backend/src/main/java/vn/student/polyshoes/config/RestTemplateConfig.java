package vn.student.polyshoes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuration class để cấu hình RestTemplate cho HTTP requests
 * Cấu hình RestTemplate để sử dụng cho các request HTTP ra bên ngoài (ví dụ: gọi API GHN, các dịch vụ khác)
 * RestTemplate là HTTP client của Spring, giúp gửi GET/POST/PUT/DELETE tới các hệ thống khác
 * Khi khai báo @Bean, Spring sẽ tự động quản lý và inject RestTemplate vào các service cần dùng
 * Có thể mở rộng cấu hình timeout, interceptor, ... tại đây nếu cần
 * Sử dụng: @Autowired RestTemplate restTemplate trong các service
 * Ví dụ: restTemplate.getForObject(url, ResponseType.class);
 */
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}