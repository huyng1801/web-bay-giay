package vn.student.polyshoes.response;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho thông tin vai trò/quyền
 * Sử dụng để trả về dữ liệu vai trò của người dùng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {
    private String roleId; // ID duy nhất của vai trò
    private String roleName; // Tên vai trò (ADMIN, STAFF, USER, ...)
    private String description; // Mô tả chi tiết của vai trò
}