package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho lỗi/ngoại lệ
 * Sử dụng để trả về thông tin lỗi cho client khi có exception
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String message; // Mô tả chi tiết của lỗi
    private int status; // HTTP status code (400, 404, 500, ...)
}
