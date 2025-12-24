package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO cho chi tiết sản phẩm trong đơn hàng
 * Sử dụng để trả về thông tin từng sản phẩm trong đơn hàng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Integer productId; // ID của sản phẩm
    private String productName; // Tên sản phẩm
    private String colorName; // Tên màu sắc được chọn
    private String sizeValue; // Kích cỡ được chọn
    private int quantity; // Số lượng mua
    private long unitPrice; // Giá đơn vị tại thời điểm mua
    private String imageUrl; // URL hình ảnh sản phẩm
  
}