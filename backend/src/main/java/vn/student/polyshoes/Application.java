
// Lớp khởi động chính của ứng dụng Spring Boot Halley Shop
package vn.student.polyshoes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone;
import jakarta.annotation.PostConstruct;


/**
 * Lớp main khởi động ứng dụng Spring Boot
 * Thiết lập múi giờ mặc định cho toàn bộ ứng dụng là Asia/Ho_Chi_Minh
 */
@SpringBootApplication
public class Application {


	/**
	 * Hàm khởi tạo sau khi Spring Boot tạo bean
	 * Thiết lập múi giờ mặc định cho JVM là Asia/Ho_Chi_Minh (Việt Nam)
	 */
	@PostConstruct
	public void init() {
		// Thiết lập múi giờ mặc định cho toàn bộ ứng dụng
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
	}


	/**
	 * Hàm main - điểm bắt đầu của ứng dụng
	 * @param args Tham số dòng lệnh
	 */
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
