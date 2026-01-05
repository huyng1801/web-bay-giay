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
        @PositiveOrZero(message = "ID khách hàng phải lớn hơn hoặc bằng 0")
    private int customerId;

    // Thông tin khách hàng (bao gồm cả khách hàng đăng ký và khách vãng lai)
    @Valid
    private CustomerDto customerDto;

    // Thông tin chính của đơn hàng
        @NotNull(message = "Thông tin đơn hàng không được để trống")
    @Valid
    private OrderDto orderDto;

    // Danh sách các sản phẩm của đơn hàng
        @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    @Valid
    private List<OrderItemDto> orderItemDtos;
}
