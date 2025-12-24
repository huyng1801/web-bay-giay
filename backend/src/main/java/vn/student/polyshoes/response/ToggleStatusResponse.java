package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho kết quả thay đổi trạng thái hoạt động
 * Sử dụng để trả về kết quả sau khi bật/tắt hoạt động của một thực thể
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToggleStatusResponse {
    private Integer id; // ID của thực thể (category, product, size, ...)
    private Boolean isActive; // Trạng thái mới sau khi thay đổi (true: hoạt động, false: tạm tắt)
}
