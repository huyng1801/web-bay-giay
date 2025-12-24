package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.ShippingType;
import jakarta.validation.constraints.*;

// DTO dùng để nhận dữ liệu tạo mới hoặc cập nhật phương thức vận chuyển
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingDto {
    
    // ID của phương thức vận chuyển
    private Integer shippingId;

    // Mã code của phương thức (VD: "FAST", "STANDARD")
    @NotBlank(message = "Shipping code must not be blank")
    private String shippingCode;

    // Tên phương thức vận chuyển (VD: "Giao hàng nhanh")
    @NotBlank(message = "Shipping name must not be blank")
    private String shippingName;

    // Phí vận chuyển (VD: 30000 đồng)
    @NotNull(message = "Shipping fee must not be null")
    @PositiveOrZero(message = "Shipping fee must be zero or positive")
    private Integer shippingFee;

    // Thời gian giao hàng (đờ của người dùng, VD: "1-2 ngày")
    @NotBlank(message = "Delivery time must not be blank")
    private String deliveryTime; // e.g., "1-2 days", "3-5 days"

    // Loại vận chuyển (FAST, STANDARD, ...)
    @NotNull(message = "Shipping type must not be null")
    private ShippingType shippingType;

    // Trạng thái hoạt động
    private Boolean isActive;
}
