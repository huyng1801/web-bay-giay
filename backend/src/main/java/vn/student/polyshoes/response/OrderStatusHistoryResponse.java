package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.OrderStatus;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistoryResponse {
    
    private Integer historyId;
    private String orderId;
    private OrderStatus fromStatus;
    private OrderStatus toStatus;
    private String changedBy;
    private String changeReason;
    private Date changedAt;
    private String ipAddress;

    // Thêm các field hiển thị thân thiện
    private String fromStatusDisplay;
    private String toStatusDisplay;
    private String timeDisplay; // Định dạng thời gian dễ đọc
}
