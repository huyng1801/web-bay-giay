package vn.student.polyshoes.exception;

// Exception tùy chỉnh khi không tìm thấy tài nguyên yêu cầu (VD: không tìm thấy user, product, order,...)
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;
  
    // Constructor với thông báo lỗi
    public ResourceNotFoundException(String message) {
      super(message);
    }
  }