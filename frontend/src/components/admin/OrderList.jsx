import React, { useState, useEffect, useCallback } from 'react';
import { Typography, message, Modal, Input } from 'antd';
import OrderService from '../../services/admin/OrderService';
import OrderFilter from './OrderFilter';
import OrderTable from './OrderTable';
import OrderDetailsModal from './OrderDetailsModal';
import OrderStatusModal from './OrderStatusModal';
import OrderHistoryModal from './OrderHistoryModal';
import StaffAssignmentModal from './StaffAssignmentModal';
import { getStatusText } from '../../utils/orderUtils';

const { Text } = Typography;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSummary, setFilterSummary] = useState(null);
  
  // Modal states
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
  const [isStaffAssignmentModalVisible, setIsStaffAssignmentModalVisible] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');


  // Filter states
  const [filters, setFilters] = useState({
    searchText: '',
    statusFilter: 'all',
    paymentFilter: 'all',
    dateRange: [],
    customerTypeFilter: 'all',
    filter: 'all'
  });

  // Load orders with filters
  const loadOrders = useCallback(async (appliedFilters = filters) => {
    try {
      setLoading(true);
      
      // Check if any filter is applied
      const hasActiveFilters = (
        (appliedFilters.searchText && appliedFilters.searchText.trim()) ||
        (appliedFilters.statusFilter && appliedFilters.statusFilter !== 'all') ||
        (appliedFilters.paymentFilter && appliedFilters.paymentFilter !== 'all') ||
        (appliedFilters.customerTypeFilter && appliedFilters.customerTypeFilter !== 'all') ||
        (appliedFilters.dateRange && appliedFilters.dateRange.length === 2 && appliedFilters.dateRange[0] && appliedFilters.dateRange[1])
      );

      if (hasActiveFilters) {
        // Use filtered API
        const response = await OrderService.getFilteredOrders(appliedFilters);
        setFilteredOrders(response.orders || []);
        setFilterSummary(response.filterSummary);
        setOrders([]); // Clear orders when using filtered API
      } else {
        // Use regular API when no filters
        const data = await OrderService.getAllOrders();
        setOrders(data || []);
        setFilteredOrders(data || []);
        setFilterSummary(null);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      message.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load orders when filters change
  useEffect(() => {
    loadOrders(filters);
  }, [loadOrders, filters]);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      searchText: '',
      statusFilter: 'all',
      paymentFilter: 'all',
      dateRange: [],
      customerTypeFilter: 'all',
      filter: 'all'
    });
    message.success('Đã xóa tất cả bộ lọc');
  };

  // View order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    OrderService.getOrderItemsByOrderId(order.orderId)
      .then(setOrderItems)
      .catch(() => message.error("Lỗi khi tải chi tiết đơn hàng"));
    setIsDetailsModalVisible(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalVisible(false);
    setSelectedOrder(null);
    setOrderItems([]);
  };

  // Update order status
  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setIsStatusModalVisible(true);
  };



  const handleStatusCancel = () => {
    setIsStatusModalVisible(false);
    setSelectedOrder(null);
  };

  // View order history
  const handleViewHistory = async (order) => {
    try {
      setSelectedOrder(order);
      const history = await OrderService.getOrderStatusHistory(order.orderId);
      // Sort history from oldest to newest
      const sortedHistory = (history || []).sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt));
      setOrderHistory(sortedHistory);
      setIsHistoryModalVisible(true);
    } catch (error) {
      console.error('Error loading order history:', error);
      message.error('Lỗi khi tải lịch sử đơn hàng');
    }
  };

  const handleHistoryCancel = () => {
    setIsHistoryModalVisible(false);
    setSelectedOrder(null);
    setOrderHistory([]);
  };

  // Delivery actions
  const handleDeliverySuccess = async (order) => {
    try {
      await OrderService.updateOrderStatusAdmin(
        order.orderId, 
        'DELIVERED', 
        'Admin', 
        `Cập nhật trạng thái từ "${getStatusText(order.orderStatus)}" sang "Đã giao hàng" - Giao hàng thành công`
      );
      message.success('Đã cập nhật trạng thái giao hàng thành công');
      loadOrders();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      message.error('Lỗi khi cập nhật trạng thái giao hàng');
    }
  };

  const handleDeliveryFailed = async (order) => {
    try {
      await OrderService.updateOrderStatusAdmin(
        order.orderId, 
        'FAILED', 
        'Admin', 
        `Cập nhật trạng thái từ "${getStatusText(order.orderStatus)}" sang "Giao hàng thất bại" - Không thể giao hàng`
      );
      message.success('Đã cập nhật trạng thái giao hàng thất bại');
      loadOrders();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      message.error('Lỗi khi cập nhật trạng thái giao hàng');
    }
  };



  // Staff assignment
  const handleUpdateStaff = async (orderId, staffId) => {
    try {
      await OrderService.updateStaffAssignment(orderId, staffId);
      // Don't show message here - let OrderTable handle it
      loadOrders();
    } catch (error) {
      console.error('Error updating staff assignment:', error);
      // Re-throw error for OrderTable to handle
      throw error;
    }
  };

  // Return order handling
  const handleReturnOrder = (order) => {
    setSelectedOrder(order);
    setIsReturnModalVisible(true);
  };

  const confirmReturnOrder = async () => {
    if (selectedOrder) {
      try {
        await OrderService.processReturnOrder(
          selectedOrder.orderId,
          returnReason || 'Khách hàng không nhận hàng'
        );
        message.success('Đã xử lý trả hàng');
        loadOrders();
      } catch (error) {
        console.error('Error processing return:', error);
        message.error('Lỗi khi xử lý trả hàng');
      } finally {
        setIsReturnModalVisible(false);
        setSelectedOrder(null);
        setReturnReason('');
      }
    }
  };

  const cancelReturnOrder = () => {
    setIsReturnModalVisible(false);
    setSelectedOrder(null);
    setReturnReason('');
  };

  // Cancel order with reason
  const handleCancelOrder = (order) => {
    setSelectedOrder(order);
    setIsCancelModalVisible(true);
  };

  const confirmCancelOrder = async () => {
    if (selectedOrder) {
      try {
        await OrderService.cancelOrderWithValidation(
          selectedOrder.orderId,
          cancelReason || 'Không có lý do',
          true // isAdmin = true
        );
        message.success('Đã hủy đơn hàng');
        loadOrders();
      } catch (error) {
        console.error('Error canceling order:', error);
        message.error(error.response?.data?.error || 'Lỗi khi hủy đơn hàng');
      } finally {
        setIsCancelModalVisible(false);
        setSelectedOrder(null);
        setCancelReason('');
      }
    }
  };

  const cancelCancelOrder = () => {
    setIsCancelModalVisible(false);
    setSelectedOrder(null);
    setCancelReason('');
  };

  // Staff assignment modal
  const handleShowStaffAssignment = (order) => {
    setSelectedOrder(order);
    setIsStaffAssignmentModalVisible(true);
  };

  const handleStaffAssignmentCancel = () => {
    setIsStaffAssignmentModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div>


      {/* Order Filter Component */}
      <OrderFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReload={loadOrders}
        onClearFilters={clearAllFilters}
        loading={loading}
      />

      {/* Results Summary */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Text type="secondary">
          Hiển thị <Text strong style={{ color: '#1890ff' }}>{filteredOrders.length}</Text> đơn hàng
          {filterSummary ? 
            ` (đã lọc từ ${filterSummary.totalOrdersBeforeFilter} đơn hàng)` :
            (orders.length > 0 && orders.length !== filteredOrders.length ? 
              ` (đã lọc từ ${orders.length} đơn hàng)` : '')
          }
        </Text>
      </div>

      {/* Order Table Component */}
      <OrderTable
        data={filteredOrders}
        loading={loading}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onViewHistory={handleViewHistory}
        onDeliverySuccess={handleDeliverySuccess}
        onDeliveryFailed={handleDeliveryFailed}
        onUpdateStaff={handleUpdateStaff}
        onReturnOrder={handleReturnOrder}
        onCancelOrder={handleCancelOrder}
        onShowStaffAssignment={handleShowStaffAssignment}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        visible={isDetailsModalVisible}
        onCancel={handleCloseDetailsModal}
        selectedOrder={selectedOrder}
        orderItems={orderItems}
      />



      {/* Order Status Update Modal */}
      <OrderStatusModal
        visible={isStatusModalVisible}
        onCancel={handleStatusCancel}
        selectedOrder={selectedOrder}
        onSuccess={loadOrders}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        visible={isHistoryModalVisible}
        onCancel={handleHistoryCancel}
        selectedOrder={selectedOrder}
        orderHistory={orderHistory}
      />

      {/* Return Order Modal */}
      <Modal
        title="Xử lý trả hàng"
        visible={isReturnModalVisible}
        onOk={confirmReturnOrder}
        onCancel={cancelReturnOrder}
        okText="Xác nhận trả hàng"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xử lý trả hàng cho đơn hàng <strong>#{selectedOrder?.orderId}</strong>?</p>
        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
            Lý do trả hàng:
          </label>
          <Input.TextArea
            rows={3}
            placeholder="Nhập lý do trả hàng (VD: Khách hàng không nhận hàng, hàng bị hỏng...)"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
          />
        </div>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        title="Hủy đơn hàng"
        visible={isCancelModalVisible}
        onOk={confirmCancelOrder}
        onCancel={cancelCancelOrder}
        okText="Xác nhận hủy"
        cancelText="Quay lại"
        okType="danger"
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng <strong>#{selectedOrder?.orderId}</strong>?</p>
        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: 'red' }}>
            Lý do hủy đơn hàng: *
          </label>
          <Input.TextArea
            rows={3}
            placeholder="Nhập lý do hủy đơn hàng (bắt buộc)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </Modal>

      {/* Staff Assignment Modal */}
      <StaffAssignmentModal
        visible={isStaffAssignmentModalVisible}
        onCancel={handleStaffAssignmentCancel}
        selectedOrder={selectedOrder}
        onAssignStaff={handleUpdateStaff}
      />
    </div>
  );
};

export default OrderList;