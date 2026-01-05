// Controller quản lý các chức năng liên quan đến đơn hàng
package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import vn.student.polyshoes.dto.CustomerDto;
import vn.student.polyshoes.dto.OrderDto;
import vn.student.polyshoes.dto.OrderFilterDto;
import vn.student.polyshoes.dto.OrderItemDto;
import vn.student.polyshoes.dto.OrderRequestDto;
import vn.student.polyshoes.enums.OrderStatus;
import vn.student.polyshoes.response.OrderFilterResponse;
import vn.student.polyshoes.response.OrderItemResponse;
import vn.student.polyshoes.response.OrderResponse;
import vn.student.polyshoes.response.OrderStatusHistoryResponse;
import vn.student.polyshoes.service.OrderService;
import vn.student.polyshoes.service.OrderStatusHistoryService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import java.util.List;
import java.util.Map;

// Đánh dấu đây là REST controller, xử lý các API liên quan đến đơn hàng
@RestController
// Định nghĩa đường dẫn gốc cho các API của controller này
@RequestMapping("/orders")
public class OrderController {

    // Inject OrderService để xử lý logic đơn hàng
    @Autowired
    private OrderService orderService;

    // Inject OrderStatusHistoryService để lấy lịch sử trạng thái đơn hàng
    @Autowired
    private OrderStatusHistoryService orderStatusHistoryService;

    // Lấy danh sách tất cả đơn hàng
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Lọc đơn hàng có phân trang
    @GetMapping("/filter")
    public ResponseEntity<?> getFilteredOrders(
            @RequestParam(required = false) String searchText,
            @RequestParam(required = false) String statusFilter,
            @RequestParam(required = false) String paymentFilter,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String customerTypeFilter,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            OrderFilterDto filterDto = new OrderFilterDto();
            
            // Set basic filters
            filterDto.setSearchText(searchText);
            filterDto.setStatusFilter(statusFilter != null ? statusFilter : "all");
            filterDto.setPaymentFilter(paymentFilter != null ? paymentFilter : "all");
            filterDto.setCustomerTypeFilter(customerTypeFilter != null ? customerTypeFilter : "all");
            filterDto.setSortBy(sortBy);
            filterDto.setSortDirection(sortDirection);
            filterDto.setPage(page);
            filterDto.setSize(size);

            // Parse date range
            if (startDate != null && !startDate.isEmpty() && endDate != null && !endDate.isEmpty()) {
                try {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    filterDto.setStartDate(LocalDate.parse(startDate, formatter));
                    filterDto.setEndDate(LocalDate.parse(endDate, formatter));
                } catch (DateTimeParseException e) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Invalid date format. Use yyyy-MM-dd"));
                }
            }

            OrderFilterResponse response = orderService.getFilteredOrders(filterDto);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error filtering orders: " + e.getMessage()));
        }
    }

    // Endpoint POST cho lọc đơn hàng phức tạp
    @PostMapping("/filter")
    public ResponseEntity<?> getFilteredOrdersPost(@RequestBody OrderFilterDto filterDto) {
        try {
            // Set defaults if not provided
            if (filterDto.getStatusFilter() == null) filterDto.setStatusFilter("all");
            if (filterDto.getPaymentFilter() == null) filterDto.setPaymentFilter("all");
            if (filterDto.getCustomerTypeFilter() == null) filterDto.setCustomerTypeFilter("all");
            if (filterDto.getSortBy() == null) filterDto.setSortBy("createdAt");
            if (filterDto.getSortDirection() == null) filterDto.setSortDirection("desc");
            if (filterDto.getPage() == null) filterDto.setPage(0);
            if (filterDto.getSize() == null) filterDto.setSize(10);

            OrderFilterResponse response = orderService.getFilteredOrders(filterDto);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error filtering orders: " + e.getMessage()));
        }
    }

    // Lấy danh sách đơn hàng theo id khách hàng
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomerId(@PathVariable Integer customerId) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByCustomerId(customerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Tạo mới đơn hàng
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        CustomerDto customerDto = orderRequestDto.getCustomerDto();
        OrderDto orderDto = orderRequestDto.getOrderDto();
        int customerId = orderRequestDto.getCustomerId();
        List<OrderItemDto> orderItemDtos = orderRequestDto.getOrderItemDtos();
        OrderResponse createdOrder = orderService.createOrder(customerId, customerDto, orderDto, orderItemDtos);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    // Cập nhật thông tin đơn hàng
    @PutMapping("/{orderId}")
    public ResponseEntity<OrderResponse> updateOrder(@PathVariable String orderId, @RequestBody OrderDto orderDto) {
        OrderResponse updatedOrder = orderService.updateOrder(orderId, orderDto);
        if (updatedOrder != null) {
            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Lấy thông tin đơn hàng theo id
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String orderId) {
        OrderResponse orderResponse = orderService.getOrderById(orderId);
        if (orderResponse != null) {
            return ResponseEntity.ok(orderResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Lấy danh sách sản phẩm trong đơn hàng theo id đơn hàng
    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItemResponse>> getOrderItemsByOrderId(@PathVariable String orderId) {
        try {
            List<OrderItemResponse> orderItems = orderService.getOrderItemsByOrderId(orderId);
            if (orderItems != null && !orderItems.isEmpty()) {
                return ResponseEntity.ok(orderItems);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Xóa đơn hàng theo id
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
    
    // Cập nhật nhân viên xử lý đơn hàng
    @PutMapping("/{orderId}/staff")
    public ResponseEntity<?> updateStaffAssignment(@PathVariable String orderId, @RequestBody Map<String, String> requestBody) {
        try {
            String staffId = requestBody.get("assignedStaffId");
            OrderResponse updatedOrder = orderService.updateStaffAssignment(orderId, staffId);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }
    
    // Xử lý trả hàng
    @PutMapping("/{orderId}/return")
    public ResponseEntity<?> processReturnOrder(@PathVariable String orderId, @RequestBody Map<String, String> requestBody) {
        try {
            String reason = requestBody.get("reason");
            OrderResponse updatedOrder = orderService.processReturnOrder(orderId, reason);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }
    
    // Hủy đơn hàng với kiểm tra hợp lệ
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderId, @RequestBody Map<String, Object> requestBody) {
        try {
            String reason = (String) requestBody.get("reason");
            Boolean isAdmin = (Boolean) requestBody.get("isAdmin");
            if (isAdmin == null) isAdmin = true; // default to admin
            
            OrderResponse canceledOrder = orderService.cancelOrder(orderId, reason, isAdmin);
            return ResponseEntity.ok(canceledOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    // Cập nhật trạng thái đơn hàng (user)
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable String orderId, @RequestBody Map<String, String> statusUpdate) {
        try {
            String orderStatus = statusUpdate.get("orderStatus");
            if (orderStatus == null || orderStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            OrderResponse updatedOrder = orderService.updateOrderStatus(orderId, orderStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Cập nhật trạng thái đơn hàng (admin)
    @PutMapping("/{orderId}/admin-status")
    public ResponseEntity<?> updateOrderStatusAdmin(
            @PathVariable String orderId,
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {
        try {
            String statusStr = (String) requestBody.get("status");
            String changeReason = (String) requestBody.get("reason");
            String changedBy = (String) requestBody.get("changedBy");
            if (statusStr == null || changedBy == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Thiếu thông tin trạng thái hoặc người thay đổi"));
            }
            OrderStatus newStatus;
            try {
                newStatus = OrderStatus.valueOf(statusStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Trạng thái không hợp lệ: " + statusStr));
            }
            String ipAddress = getClientIpAddress(request);
            var updatedOrder = orderService.updateOrderStatus(
                orderId, 
                newStatus, 
                "Admin: " + changedBy, 
                changeReason, 
                ipAddress
            );
            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật trạng thái đơn hàng thành công",
                "order", updatedOrder
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    // Cập nhật trạng thái đơn hàng (admin) - endpoint thay thế cho frontend
    @PutMapping("/order-status/{orderId}")
    public ResponseEntity<?> updateOrderStatusAdminAlt(
            @PathVariable String orderId,
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request) {
        try {
            String statusStr = (String) requestBody.get("status");
            String changeReason = (String) requestBody.get("reason");
            String changedBy = (String) requestBody.get("changedBy");
            if (statusStr == null || changedBy == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Thiếu thông tin trạng thái hoặc người thay đổi"));
            }
            OrderStatus newStatus;
            try {
                newStatus = OrderStatus.valueOf(statusStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Trạng thái không hợp lệ: " + statusStr));
            }
            String ipAddress = getClientIpAddress(request);
            var updatedOrder = orderService.updateOrderStatus(
                orderId, 
                newStatus, 
                "Admin: " + changedBy, 
                changeReason, 
                ipAddress
            );
            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật trạng thái đơn hàng thành công",
                "order", updatedOrder
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }

    // Lấy lịch sử trạng thái đơn hàng
    @GetMapping("/order-status/{orderId}/history")
    public ResponseEntity<?> getOrderStatusHistoryAlt(@PathVariable String orderId) {
        try {
            List<OrderStatusHistoryResponse> history = orderStatusHistoryService.getOrderStatusHistory(orderId);
            
            return ResponseEntity.ok(Map.of(
                "message", "Lấy lịch sử trạng thái thành công",
                "history", history
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "Lỗi khi lấy lịch sử: " + e.getMessage()));
        }
    }

    // Hàm hỗ trợ: lấy địa chỉ IP của client
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader == null) {
            return request.getRemoteAddr();
        } else {
            return xForwardedForHeader.split(",")[0];
        }
    }
}
