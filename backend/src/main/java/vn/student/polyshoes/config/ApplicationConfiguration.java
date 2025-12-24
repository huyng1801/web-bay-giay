package vn.student.polyshoes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import vn.student.polyshoes.model.AdminUser;
import vn.student.polyshoes.repository.AdminUserRepository;

@Configuration
public class ApplicationConfiguration {
    // Repository quản lý tài khoản admin
    private final AdminUserRepository userRepository;

    // Khởi tạo config với repository
    public ApplicationConfiguration(AdminUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Bean lấy thông tin user từ email
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            AdminUser user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            return user;
        };
    }

    // Bean mã hóa mật khẩu
    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean quản lý xác thực
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Bean provider xác thực (sử dụng userDetailsService và passwordEncoder)
    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}