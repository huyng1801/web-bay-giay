
// Lớp tiện ích kiểm tra và lấy thông báo lỗi validate từ BindingResult
package vn.student.polyshoes.util;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.List;
import java.util.stream.Collectors;


/**
 * Lớp tiện ích hỗ trợ xử lý kết quả validate và lấy danh sách thông báo lỗi
 */
public class ValidationUtils {


    /**
     * Lấy danh sách thông báo lỗi từ BindingResult sau khi validate
     * @param result BindingResult chứa kết quả validate
     * @return Danh sách chuỗi thông báo lỗi dạng "field: message" hoặc "object: message"
     */
    public static List<String> getErrorMessages(BindingResult result) {
        return result.getAllErrors().stream()
            // Nếu là lỗi của field thì trả về "field: message", còn lại trả về "object: message"
            .map(error -> error instanceof FieldError
                ? ((FieldError) error).getField() + ": " + error.getDefaultMessage()
                : error.getObjectName() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
    }
}
