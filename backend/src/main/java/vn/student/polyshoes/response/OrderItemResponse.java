package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Integer productId;
    private String productName;
    private String colorName;
    private String sizeValue;
    private int quantity;
    private long unitPrice;
    private String imageUrl;
  
}