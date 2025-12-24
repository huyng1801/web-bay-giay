package vn.student.polyshoes.dto;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO dùng để nhận toàn bộ dữ liệu cần thiết để tạo đơn hàng
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {
    // ID khách hàng (nếu có tài khoản, nếu 0 thì là khách hàng không đăng nhập)
    @PositiveOrZero(message = "Customer ID must be zero or positive")
    private int customerId;

    // Thông tin khách hàng không đăng nhập (nếu là khách hàng)
    @Valid
    private GuestDto guestDto;

    // Thông tin chính của đơn hàng
    @NotNull(message = "Order details must not be null")
    @Valid
    private OrderDto orderDto;

    // Danh sách các sản phẩm của đơn hàng
    @NotEmpty(message = "Order items must not be empty")
    @Valid
    private List<OrderItemDto> orderItemDtos;
}
