package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.OrderStatus;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingOrderResponse {

    private Integer pendingOrderId;
    private String pendingOrderCode;
    private String tableNumber;
    private String staffNote;
    private Long totalAmount;
    private OrderStatus status;
    private Date createdAt;
    private Date updatedAt;
    private Date completedAt;

    // Staff information
    private String staffId;
    private String staffName;

    // Items
    private List<PendingOrderItemResponse> items;

    // Summary information
    private Integer totalItems;
    private Integer totalQuantity;

    // Calculate derived fields
    public Integer getTotalItems() {
        return items != null ? items.size() : 0;
    }

    public Integer getTotalQuantity() {
        return items != null ? 
                items.stream().mapToInt(PendingOrderItemResponse::getQuantity).sum() : 0;
    }
}