package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.PaymentMethod;
import jakarta.validation.constraints.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    @NotNull(message = "Total price must not be null")
    @PositiveOrZero(message = "Total price must be zero or positive")
    private Long totalPrice;

    @NotNull(message = "Original price must not be null")
    @PositiveOrZero(message = "Original price must be zero or positive")
    private Long originalPrice;

    @PositiveOrZero(message = "Voucher discount must be zero or positive")
    private Long voucherDiscount;

    @Deprecated // Will be removed - voucher should be handled separately
    private String voucherCode;

    private boolean isPaid;

    private String orderNote;

    @NotNull(message = "Payment method must not be null")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Shipping ID must not be null")
    private Integer shippingId;
    
    private String assignedStaffId;

    private boolean skipStockReduction = false;
}
