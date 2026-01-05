package vn.student.polyshoes.exception;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import io.jsonwebtoken.ExpiredJwtException;

import java.io.IOException;
import java.security.SignatureException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Logger để ghi lại exception
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Xử lý tất cả các exception chung
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> handleException(Exception exception) {
        // Xác định HTTP status code dựa trên loại exception
        HttpStatus status = determineHttpStatus(exception);
        // Xác định message phù hợp
        String message = determineMessage(exception);

        // Ghi log exception
        logException(exception);

        // Tạo response với định dạng ErrorMessage
        ErrorMessage errorMessage = new ErrorMessage(
            status.value(),
            new Date(),
            message,
            exception.getMessage()
        );

        return new ResponseEntity<>(errorMessage, status);
    }

    // Xử lý exception khi không tìm thấy resource (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorMessage> resourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ErrorMessage errorMessage = new ErrorMessage(
            HttpStatus.NOT_FOUND.value(),
            new Date(),
            ex.getMessage(),
            request.getDescription(false)
        );
        return new ResponseEntity<>(errorMessage, HttpStatus.NOT_FOUND);
    }

    // Xác định HTTP status code phù hợp dựa trên loại exception
    private HttpStatus determineHttpStatus(Exception exception) {
        // Sai thông tin đăng nhập
        if (exception instanceof BadCredentialsException) {
            return HttpStatus.UNAUTHORIZED;
        } 
        // Tài khoản bị khóa
        else if (exception instanceof AccountStatusException) {
            return HttpStatus.FORBIDDEN;
        } 
        // Không có quyền truy cập
        else if (exception instanceof AccessDeniedException) {
            return HttpStatus.FORBIDDEN;
        } 
        // JWT signature không hợp lệ
        else if (exception instanceof SignatureException) {
            return HttpStatus.FORBIDDEN;
        } 
        // JWT token hết hạn
        else if (exception instanceof ExpiredJwtException) {
            return HttpStatus.FORBIDDEN;
        } 
        // Lỗi xử lý file
        else if (exception instanceof IOException) {
            return HttpStatus.BAD_REQUEST;
        } 
        // Argument không hợp lệ
        else if (exception instanceof IllegalArgumentException) {
            return HttpStatus.BAD_REQUEST;
        } 
        // Lỗi không xác định
        else {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

    // Xác định message phù hợp dựa trên loại exception
    private String determineMessage(Exception exception) {
        // Sai email hoặc mật khẩu
        if (exception instanceof BadCredentialsException) {
            return "Sai tên đăng nhập hoặc mật khẩu";
        } 
        // Tài khoản bị khóa
        else if (exception instanceof AccountStatusException) {
            return "Tài khoản đã bị khóa";
        } 
        // Không có quyền truy cập
        else if (exception instanceof AccessDeniedException) {
            return "Bạn không có quyền truy cập tài nguyên này";
        } 
        // JWT signature không hợp lệ
        else if (exception instanceof SignatureException) {
            return "Chữ ký JWT không hợp lệ";
        } 
        // JWT token hết hạn
        else if (exception instanceof ExpiredJwtException) {
            return "Token JWT đã hết hạn";
        } 
        // Lỗi xử lý file
        else if (exception instanceof IOException) {
            return "Lỗi xử lý tệp tin";
        } 
        // Argument không hợp lệ
        else if (exception instanceof IllegalArgumentException) {
            return "Tham số truyền vào không hợp lệ";
        } 
        // Lỗi không xác định
        else {
            return "Lỗi máy chủ nội bộ không xác định";
        }
    }

    // Ghi log exception vào file log
    private void logException(Exception exception) {
        logger.error("Exception occurred: ", exception);
    }
}
