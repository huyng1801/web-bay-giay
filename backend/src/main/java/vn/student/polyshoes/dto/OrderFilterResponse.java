package vn.student.polyshoes.dto;

import java.util.List;

import vn.student.polyshoes.response.OrderResponse;

public class OrderFilterResponse {
    private List<OrderResponse> orders;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;
    private OrderFilterSummary filterSummary;

    // Constructors
    public OrderFilterResponse() {}

    public OrderFilterResponse(List<OrderResponse> orders, long totalElements, int totalPages, 
                              int currentPage, int pageSize, boolean hasNext, boolean hasPrevious,
                              OrderFilterSummary filterSummary) {
        this.orders = orders;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
        this.filterSummary = filterSummary;
    }

    // Getters and Setters
    public List<OrderResponse> getOrders() {
        return orders;
    }

    public void setOrders(List<OrderResponse> orders) {
        this.orders = orders;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }

    public OrderFilterSummary getFilterSummary() {
        return filterSummary;
    }

    public void setFilterSummary(OrderFilterSummary filterSummary) {
        this.filterSummary = filterSummary;
    }

    // Inner class for filter summary
    public static class OrderFilterSummary {
        private int totalOrdersBeforeFilter;
        private int filteredOrdersCount;
        private boolean dateRangeApplied;
        private boolean statusFilterApplied;
        private boolean paymentFilterApplied;
        private boolean searchTextApplied;
        private boolean customerTypeFilterApplied;

        // Constructors
        public OrderFilterSummary() {}

        public OrderFilterSummary(int totalOrdersBeforeFilter, int filteredOrdersCount,
                                 boolean dateRangeApplied, boolean statusFilterApplied,
                                 boolean paymentFilterApplied, boolean searchTextApplied,
                                 boolean customerTypeFilterApplied) {
            this.totalOrdersBeforeFilter = totalOrdersBeforeFilter;
            this.filteredOrdersCount = filteredOrdersCount;
            this.dateRangeApplied = dateRangeApplied;
            this.statusFilterApplied = statusFilterApplied;
            this.paymentFilterApplied = paymentFilterApplied;
            this.searchTextApplied = searchTextApplied;
            this.customerTypeFilterApplied = customerTypeFilterApplied;
        }

        // Getters and Setters
        public int getTotalOrdersBeforeFilter() {
            return totalOrdersBeforeFilter;
        }

        public void setTotalOrdersBeforeFilter(int totalOrdersBeforeFilter) {
            this.totalOrdersBeforeFilter = totalOrdersBeforeFilter;
        }

        public int getFilteredOrdersCount() {
            return filteredOrdersCount;
        }

        public void setFilteredOrdersCount(int filteredOrdersCount) {
            this.filteredOrdersCount = filteredOrdersCount;
        }

        public boolean isDateRangeApplied() {
            return dateRangeApplied;
        }

        public void setDateRangeApplied(boolean dateRangeApplied) {
            this.dateRangeApplied = dateRangeApplied;
        }

        public boolean isStatusFilterApplied() {
            return statusFilterApplied;
        }

        public void setStatusFilterApplied(boolean statusFilterApplied) {
            this.statusFilterApplied = statusFilterApplied;
        }

        public boolean isPaymentFilterApplied() {
            return paymentFilterApplied;
        }

        public void setPaymentFilterApplied(boolean paymentFilterApplied) {
            this.paymentFilterApplied = paymentFilterApplied;
        }

        public boolean isSearchTextApplied() {
            return searchTextApplied;
        }

        public void setSearchTextApplied(boolean searchTextApplied) {
            this.searchTextApplied = searchTextApplied;
        }

        public boolean isCustomerTypeFilterApplied() {
            return customerTypeFilterApplied;
        }

        public void setCustomerTypeFilterApplied(boolean customerTypeFilterApplied) {
            this.customerTypeFilterApplied = customerTypeFilterApplied;
        }
    }
}