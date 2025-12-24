package vn.student.polyshoes.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vn.student.polyshoes.service.JwtService;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // Xử lý lỗi khi xác thực
    private final HandlerExceptionResolver handlerExceptionResolver;
    // Service xử lý JWT
    private final JwtService jwtService;
    // Service lấy thông tin user
    private final UserDetailsService userDetailsService;

    // Khởi tạo filter với các service cần thiết
    public JwtAuthenticationFilter(
        JwtService jwtService,
        UserDetailsService userDetailsService,
        HandlerExceptionResolver handlerExceptionResolver
    ) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    // Hàm xử lý filter xác thực JWT cho mỗi request
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        // Lấy header Authorization
        final String authHeader = request.getHeader("Authorization");

        // Kiểm tra header có chứa Bearer token không
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                // Lấy JWT từ header
                final String jwt = authHeader.substring(7);
                // Lấy email từ JWT
                final String userEmail = jwtService.extractUsername(jwt);

                // Kiểm tra trạng thái xác thực hiện tại
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                // Nếu có email và chưa xác thực thì tiến hành xác thực
                if (userEmail != null && authentication == null) {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                    // Kiểm tra token hợp lệ
                    if (jwtService.isTokenValid(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                        // Gắn thông tin xác thực vào context
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (Exception exception) {
                // Nếu có lỗi xác thực thì trả về lỗi
                handlerExceptionResolver.resolveException(request, response, null, exception);
                return;
            }
        }

        // Tiếp tục filter chain
        filterChain.doFilter(request, response);
    }
}