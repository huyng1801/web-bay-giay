package vn.student.polyshoes.dto;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {
    @PositiveOrZero(message = "Customer ID must be zero or positive")
    private int customerId;

    @Valid
    private GuestDto guestDto;

    @NotNull(message = "Order details must not be null")
    @Valid
    private OrderDto orderDto;

    @NotEmpty(message = "Order items must not be empty")
    @Valid
    private List<OrderItemDto> orderItemDtos;
}
