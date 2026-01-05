package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingOrderItemResponse {

    private Integer pendingItemId;
    private Integer quantity;
    private Long unitPrice;
    private Long totalPrice;
    private String note;

    // Product information
    private Integer productDetailsId;
    private String productName;
    private String colorName;
    private String sizeValue;
    private Long price; // Current price in product details
    private Integer stockQuantity;

    // Calculate total price
    public Long getTotalPrice() {
        return quantity != null && unitPrice != null ? quantity * unitPrice : 0L;
    }
}