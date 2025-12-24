// Cấu hình đường dẫn tài nguyên tĩnh cho ứng dụng
package vn.student.polyshoes.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
// Đánh dấu đây là lớp cấu hình Spring
@Configuration
// Lớp cấu hình cho Web MVC
public class WebConfig implements WebMvcConfigurer {

    // Ghi đè phương thức để cấu hình các handler cho tài nguyên tĩnh
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Định nghĩa đường dẫn truy cập /uploads/** sẽ lấy file từ thư mục static/uploads
        registry.addResourceHandler("/uploads/**")
        .addResourceLocations("file:backend/src/main/resources/static/uploads/");
    }
}