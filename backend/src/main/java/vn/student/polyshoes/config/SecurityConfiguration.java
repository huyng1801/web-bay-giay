// Cấu hình bảo mật cho ứng dụng
package vn.student.polyshoes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
// Lớp cấu hình bảo mật sử dụng Spring Security
public class SecurityConfiguration {
    // Provider xác thực người dùng
    private final AuthenticationProvider authenticationProvider;
    // Bộ lọc xác thực JWT
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Hàm khởi tạo, nhận vào bộ lọc JWT và provider xác thực
    public SecurityConfiguration(
        JwtAuthenticationFilter jwtAuthenticationFilter,
        AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // Bean cấu hình chuỗi filter bảo mật
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Tắt CSRF, cấu hình CORS, phân quyền truy cập các endpoint
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Cho phép truy cập không cần xác thực các đường dẫn sau
                .requestMatchers("/home/**", "/auth/**", "/uploads/**")
                .permitAll()
                // Các request khác yêu cầu xác thực
                .anyRequest()
                .authenticated()
            )
            // Quản lý session dạng stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Sử dụng provider xác thực
            .authenticationProvider(authenticationProvider)
            // Thêm bộ lọc xác thực JWT trước bộ lọc UsernamePassword
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean cấu hình CORS cho ứng dụng
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép các origin sau truy cập
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001")); 
        // Cho phép các phương thức HTTP
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        // Cho phép tất cả các header
        configuration.setAllowedHeaders(List.of("*")); 
        // Các header được expose ra ngoài
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));
        // Cho phép gửi cookie
        configuration.setAllowCredentials(true);
        // Thời gian cache cấu hình CORS
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Đăng ký cấu hình cho tất cả các đường dẫn
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
