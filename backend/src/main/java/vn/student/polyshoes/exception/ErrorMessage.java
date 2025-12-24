package vn.student.polyshoes.exception;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Lớp dùng để tương ứng lỗi/exception trả về cho client
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorMessage {
  // Mã HTTP status code (404, 500, 400, ...)
  private int statusCode;
  // Thời gian lỗi xảy ra
  private Date timestamp;
  // Thông báo lỗi chính (user-friendly message)
  private String message;
  // Mô tả chi tiết về lỗi (có thể là request path hoặc nguyên nhân lỗi)
  private String description;
}