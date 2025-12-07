import BaseService from './BaseService';

const API_URL = '/orders';

const OrderService = {
  async getAllOrders() {
    try {
      const response = await BaseService.get(API_URL);
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getFilteredOrders(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add search text
      if (filters.searchText && filters.searchText.trim()) {
        params.append('searchText', filters.searchText.trim());
      }
      
      // Add status filter
      if (filters.statusFilter && filters.statusFilter !== 'all') {
        params.append('statusFilter', filters.statusFilter);
      }
      
      // Add payment filter
      if (filters.paymentFilter && filters.paymentFilter !== 'all') {
        params.append('paymentFilter', filters.paymentFilter);
      }
      
      // Add customer type filter
      if (filters.customerTypeFilter && filters.customerTypeFilter !== 'all') {
        params.append('customerTypeFilter', filters.customerTypeFilter);
      }
      
      // Add date range
      if (filters.dateRange && Array.isArray(filters.dateRange) && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        if (startDate && endDate) {
          params.append('startDate', startDate.format('YYYY-MM-DD'));
          params.append('endDate', endDate.format('YYYY-MM-DD'));
        }
      }
      
      // Add sorting
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      if (filters.sortDirection) {
        params.append('sortDirection', filters.sortDirection);
      }
      
      // Add pagination
      if (filters.page !== undefined) {
        params.append('page', filters.page.toString());
      }
      if (filters.size !== undefined) {
        params.append('size', filters.size.toString());
      }
      
      const queryString = params.toString();
      const url = queryString ? `${API_URL}/filter?${queryString}` : `${API_URL}/filter`;
      
      const response = await BaseService.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
      throw error;
    }
  },

  async getFilteredOrdersPost(filterDto) {
    try {
      // Convert moment objects to strings for API
      if (filterDto.dateRange && Array.isArray(filterDto.dateRange) && filterDto.dateRange.length === 2) {
        const [startDate, endDate] = filterDto.dateRange;
        if (startDate && endDate) {
          filterDto.startDate = startDate.format('YYYY-MM-DD');
          filterDto.endDate = endDate.format('YYYY-MM-DD');
        }
        delete filterDto.dateRange; // Remove the moment objects
      }

      const response = await BaseService.post(`${API_URL}/filter`, filterDto);
      return response;
    } catch (error) {
      console.error('Error fetching filtered orders (POST):', error);
      throw error;
    }
  },

  async createOrder(orderRequestData) {
    try {
      const response = await BaseService.post(API_URL, orderRequestData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async updateOrder(orderId, orderData) {
    try {
      const response = await BaseService.put(`${API_URL}/${orderId}`, orderData);
      return response;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async updateStaffAssignment(orderId, staffId) {
    try {
      const response = await BaseService.put(`${API_URL}/${orderId}/staff`, { assignedStaffId: staffId });
      return response;
    } catch (error) {
      console.error('Error updating staff assignment:', error);
      throw error;
    }
  },

  async processReturnOrder(orderId, reason) {
    try {
      const response = await BaseService.put(`${API_URL}/${orderId}/return`, { reason: reason });
      return response;
    } catch (error) {
      console.error('Error processing return order:', error);
      throw error;
    }
  },

  async cancelOrderWithValidation(orderId, reason, isAdmin = true) {
    try {
      const response = await BaseService.put(`${API_URL}/${orderId}/cancel`, { reason: reason, isAdmin: isAdmin });
      return response;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const response = await BaseService.delete(`${API_URL}/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await BaseService.put(`${API_URL}/${orderId}/status`, { orderStatus: status });
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Admin: Update order status with history tracking
  async updateOrderStatusAdmin(orderId, status, changedBy, reason) {
    try {
      const response = await BaseService.put(
        `${API_URL}/order-status/${orderId}`,
        {
          status: status,
          changedBy: changedBy || 'Admin',
          reason: reason || 'Cập nhật trạng thái đơn hàng'
        }
      );
      return response;
    } catch (error) {
      console.error('Error updating order status (admin):', error);
      throw error;
    }
  },

  // Get order status history
  async getOrderStatusHistory(orderId) {
    try {
      const response = await BaseService.get(`${API_URL}/order-status/${orderId}/history`);
      return response.history || response; // Handle different response formats
    } catch (error) {
      console.error('Error fetching order status history:', error);
      throw error;
    }
  },

  // Order Items operations
  async getOrderItemsByOrderId(orderId) {
    try {
      const response = await BaseService.get(`${API_URL}/${orderId}/items`);
      return response;
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  },

  async addOrderItem(orderId, itemData) {
    try {
      const response = await BaseService.post(`${API_URL}/${orderId}/items`, itemData);
      return response;
    } catch (error) {
      console.error('Error adding order item:', error);
      throw error;
    }
  },

  async updateOrderItem(orderId, itemId, itemData) {
    try {
      const response = await BaseService.put(`${API_URL}/${orderId}/items/${itemId}`, itemData);
      return response;
    } catch (error) {
      console.error('Error updating order item:', error);
      throw error;
    }
  },

  async deleteOrderItem(orderId, itemId) {
    try {
      const response = await BaseService.delete(`${API_URL}/${orderId}/items/${itemId}`);
      return response;
    } catch (error) {
      console.error('Error deleting order item:', error);
      throw error;
    }
  },

  // Additional order management functions
  async getOrdersByCustomerId(customerId) {
    try {
      const response = await BaseService.get(`${API_URL}/customer/${customerId}`);
      return response;
    } catch (error) {
      console.error('Error fetching orders by customer ID:', error);
      throw error;
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await BaseService.get(`${API_URL}/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  },

  async getAllOrdersWithDetails() {
    try {
      const response = await BaseService.get(`${API_URL}/with-details`);
      return response;
    } catch (error) {
      console.error('Error fetching orders with details:', error);
      throw error;
    }
  },

  async updateOrderPaymentStatus(orderId, isPaid) {
    try {
      const response = await BaseService.patch(`${API_URL}/${orderId}/payment-status`, { isPaid });
      return response;
    } catch (error) {
      console.error('Error updating order payment status:', error);
      throw error;
    }
  },

  async getOrderStatistics(dateFrom, dateTo) {
    try {
      const response = await BaseService.get(`${API_URL}/statistics`, {
        params: { dateFrom, dateTo }
      });
      return response;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  },

  async getOrdersByDateRange(startDate, endDate) {
    try {
      const response = await BaseService.get(`${API_URL}/date-range`, {
        params: { startDate, endDate }
      });
      return response;
    } catch (error) {
      console.error('Error fetching orders by date range:', error);
      throw error;
    }
  },

  async getOrdersByStatus(status) {
    try {
      const response = await BaseService.get(`${API_URL}/by-status/${status}`);
      return response;
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw error;
    }
  }
};

export default OrderService;