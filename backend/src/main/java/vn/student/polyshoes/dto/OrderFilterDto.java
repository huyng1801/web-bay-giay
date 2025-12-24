package vn.student.polyshoes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

/**
 * DTO dùng để lọc, tìm kiếm và phân trang đơn hàng
 * Sử dụng Lombok để tự động sinh constructor, getter, setter, toString
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderFilterDto {
    private String searchText;
    private String statusFilter;
    private String paymentFilter;
    private LocalDate startDate;
    private LocalDate endDate;
    private String customerTypeFilter;
    private String sortBy;
    private String sortDirection;
    private Integer page;
    private Integer size;

    // Helper methods
    public boolean hasDateRange() {
        return startDate != null && endDate != null;
    }

    public boolean hasSearchText() {
        return searchText != null && !searchText.trim().isEmpty();
    }

    public boolean hasStatusFilter() {
        return statusFilter != null && !"all".equals(statusFilter);
    }

    public boolean hasPaymentFilter() {
        return paymentFilter != null && !"all".equals(paymentFilter);
    }

    public boolean hasCustomerTypeFilter() {
        return customerTypeFilter != null && !"all".equals(customerTypeFilter);
    }
}