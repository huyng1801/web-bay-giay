package vn.student.polyshoes.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    // Constructors
    public OrderFilterDto() {}

    public OrderFilterDto(String searchText, String statusFilter, String paymentFilter, 
                         LocalDate startDate, LocalDate endDate, String customerTypeFilter,
                         String sortBy, String sortDirection, Integer page, Integer size) {
        this.searchText = searchText;
        this.statusFilter = statusFilter;
        this.paymentFilter = paymentFilter;
        this.startDate = startDate;
        this.endDate = endDate;
        this.customerTypeFilter = customerTypeFilter;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
        this.page = page;
        this.size = size;
    }

    // Getters and Setters
    public String getSearchText() {
        return searchText;
    }

    public void setSearchText(String searchText) {
        this.searchText = searchText;
    }

    public String getStatusFilter() {
        return statusFilter;
    }

    public void setStatusFilter(String statusFilter) {
        this.statusFilter = statusFilter;
    }

    public String getPaymentFilter() {
        return paymentFilter;
    }

    public void setPaymentFilter(String paymentFilter) {
        this.paymentFilter = paymentFilter;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getCustomerTypeFilter() {
        return customerTypeFilter;
    }

    public void setCustomerTypeFilter(String customerTypeFilter) {
        this.customerTypeFilter = customerTypeFilter;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortDirection() {
        return sortDirection;
    }

    public void setSortDirection(String sortDirection) {
        this.sortDirection = sortDirection;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

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

    @Override
    public String toString() {
        return "OrderFilterDto{" +
                "searchText='" + searchText + '\'' +
                ", statusFilter='" + statusFilter + '\'' +
                ", paymentFilter='" + paymentFilter + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", customerTypeFilter='" + customerTypeFilter + '\'' +
                ", sortBy='" + sortBy + '\'' +
                ", sortDirection='" + sortDirection + '\'' +
                ", page=" + page +
                ", size=" + size +
                '}';
    }
}