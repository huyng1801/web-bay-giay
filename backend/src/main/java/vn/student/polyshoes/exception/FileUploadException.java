package vn.student.polyshoes.exception;

// Exception tùy chỉnh để xử lý lỗi khi upload file
public class FileUploadException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    
    // Constructor với thông báo lỗi
    public FileUploadException(String message) {
        super(message);
    }

    // Constructor với thông báo lỗi và nguyên nhân gốc
    public FileUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
