package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.OrderStatus;

import java.util.Date;

/**
 * Response DTO cho lịch sử thay đổi trạng thái đơn hàng
 * Sử dụng để trả về thông tin lịch sử thay đổi trạng thái của đơn hàng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistoryResponse {
    private Integer historyId; // ID duy nhất của bản ghi lịch sử
    private String orderId; // ID của đơn hàng
    private OrderStatus fromStatus; // Trạng thái trước khi thay đổi
    private OrderStatus toStatus; // Trạng thái sau khi thay đổi
    private String changedBy; // ID hoặc tên người thay đổi trạng thái
    private String changeReason; // Lý do thay đổi trạng thái
    private Date changedAt; // Thời gian thay đổi
    private String ipAddress; // Địa chỉ IP của người thực hiện thay đổi

    // Các field hiển thị thân thiện cho frontend
    private String fromStatusDisplay; // Trạng thái trước dạng văn bản hiển thị
    private String toStatusDisplay; // Trạng thái sau dạng văn bản hiển thị
    private String timeDisplay; // Thời gian định dạng dễ đọc
}
