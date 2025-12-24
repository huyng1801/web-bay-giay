package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * Response DTO cho kết quả lọc và phân trang đơn hàng
 * Sử dụng để trả về danh sách đơn hàng có phân trang và thống kê lọc
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderFilterResponse {
    private List<OrderResponse> orders; // Danh sách đơn hàng trong trang hiện tại
    private long totalElements; // Tổng số đơn hàng sau lọc
    private int totalPages; // Tổng số trang
    private int currentPage; // Trang hiện tại (0-indexed)
    private int pageSize; // Số đơn hàng trên mỗi trang
    private boolean hasNext; // Có trang tiếp theo hay không
    private boolean hasPrevious; // Có trang trước hay không
    private OrderFilterSummary filterSummary; // Thống kê về các bộ lọc được áp dụng

    // Inner class for filter summary
    /**
     * Lớp lồng để chứa thống kê về các bộ lọc đã được áp dụng
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderFilterSummary {
        private int totalOrdersBeforeFilter; // Tổng số đơn hàng trước khi áp dụng bộ lọc
        private int filteredOrdersCount; // Số đơn hàng sau khi áp dụng bộ lọc
        private boolean dateRangeApplied; // Có áp dụng bộ lọc theo ngày hay không
        private boolean statusFilterApplied; // Có áp dụng bộ lọc theo trạng thái hay không
        private boolean paymentFilterApplied; // Có áp dụng bộ lọc theo phương thức thanh toán hay không
        private boolean searchTextApplied; // Có áp dụng tìm kiếm text hay không
        private boolean customerTypeFilterApplied; // Có áp dụng bộ lọc theo loại khách hàng hay không
    }
}