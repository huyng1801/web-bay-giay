
// Lớp khởi động chính của ứng dụng Spring Boot Halley Shop
package vn.student.polyshoes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class Application {

	@PostConstruct
	public void init() {
		// Thiết lập múi giờ mặc định cho toàn bộ ứng dụng
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
