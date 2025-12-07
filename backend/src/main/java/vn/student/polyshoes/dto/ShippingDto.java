package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.ShippingType;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingDto {
    
    private Integer shippingId;

    @NotBlank(message = "Shipping code must not be blank")
    private String shippingCode;

    @NotBlank(message = "Shipping name must not be blank")
    private String shippingName;

    @NotNull(message = "Shipping fee must not be null")
    @PositiveOrZero(message = "Shipping fee must be zero or positive")
    private Integer shippingFee;

    @NotBlank(message = "Delivery time must not be blank")
    private String deliveryTime; // e.g., "1-2 days", "3-5 days"

    @NotNull(message = "Shipping type must not be null")
    private ShippingType shippingType;

    private Boolean isActive;
}
