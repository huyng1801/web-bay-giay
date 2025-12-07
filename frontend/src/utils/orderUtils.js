import { Tag } from 'antd';
import moment from 'moment';



// Helper function to safely parse and compare dates
const parseOrderDate = (dateInput) => {
  if (!dateInput) return null;
  
  // Handle different date formats
  let parsedDate;
  
  if (moment.isMoment(dateInput)) {
    parsedDate = dateInput;
  } else if (dateInput instanceof Date) {
    parsedDate = moment(dateInput);
  } else if (typeof dateInput === 'string') {
    // Try parsing with different formats
    parsedDate = moment(dateInput);
    
    // If standard parsing fails, try common formats
    if (!parsedDate.isValid()) {
      const formats = [
        'YYYY-MM-DD HH:mm:ss',
        'YYYY-MM-DD',
        'DD/MM/YYYY HH:mm:ss', 
        'DD/MM/YYYY',
        'MM/DD/YYYY HH:mm:ss',
        'MM/DD/YYYY'
      ];
      
      for (const format of formats) {
        parsedDate = moment(dateInput, format);
        if (parsedDate.isValid()) break;
      }
    }
  } else {
    parsedDate = moment(dateInput);
  }
  
  return parsedDate && parsedDate.isValid() ? parsedDate : null;
};

export const statusOptions = [
  { label: 'Đặt hàng', value: 'PENDING_PAYMENT' },
  { label: 'Chờ xác nhận', value: 'PAYMENT_CONFIRMED' },
  { label: 'Đã xác nhận', value: 'PROCESSING' },
  { label: 'Chờ vận chuyển', value: 'SHIPPED' },
  { label: 'Đang vận chuyển', value: 'OUT_FOR_DELIVERY' },
  { label: 'Đã giao hàng', value: 'DELIVERED' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
  { label: 'Đã hủy', value: 'CANCELED' },
  { label: 'Yêu cầu trả hàng', value: 'RETURN_REQUESTED' },
  { label: 'Đã trả hàng', value: 'RETURNED' },
  { label: 'Đã hoàn tiền', value: 'REFUNDED' },
  { label: 'Giao hàng thất bại', value: 'FAILED' }
];

// Sequential status flow for checkout system
export const sequentialStatusFlow = [
  { key: 'PENDING_PAYMENT', label: 'Đặt hàng', description: 'Đơn hàng đã được tạo' },
  { key: 'PAYMENT_CONFIRMED', label: 'Chờ xác nhận', description: 'Chờ xác nhận đơn hàng' },
  { key: 'PROCESSING', label: 'Đã xác nhận', description: 'Đơn hàng đã được xác nhận' },
  { key: 'SHIPPED', label: 'Chờ vận chuyển', description: 'Chuẩn bị vận chuyển' },
  { key: 'OUT_FOR_DELIVERY', label: 'Đang vận chuyển', description: 'Đơn hàng đang được vận chuyển' },
  { key: 'DELIVERED', label: 'Đã giao hàng', description: 'Đã giao hàng thành công' },
  { key: 'COMPLETED', label: 'Hoàn thành', description: 'Đơn hàng đã hoàn thành' }
];

export const getStatusText = (status) => {
  const statusMap = {
    'PENDING_PAYMENT': 'Đặt hàng',
    'PAYMENT_CONFIRMED': 'Chờ xác nhận',
    'PROCESSING': 'Đã xác nhận',
    'SHIPPED': 'Chờ vận chuyển',
    'OUT_FOR_DELIVERY': 'Đang vận chuyển',
    'DELIVERED': 'Đã giao hàng',
    'COMPLETED': 'Hoàn thành',
    'CANCELED': 'Đã hủy',
    'RETURN_REQUESTED': 'Yêu cầu trả hàng',
    'RETURNED': 'Đã trả hàng',
    'REFUNDED': 'Đã hoàn tiền',
    'FAILED': 'Giao hàng thất bại'
  };
  return statusMap[status] || status;
};

export const getStatusTag = (status) => {
  const statusMap = {
    'PENDING_PAYMENT': { color: 'orange', text: 'Đặt hàng' },
    'PAYMENT_CONFIRMED': { color: 'blue', text: 'Chờ xác nhận' },
    'PROCESSING': { color: 'purple', text: 'Đã xác nhận' },
    'SHIPPED': { color: 'geekblue', text: 'Chờ vận chuyển' },
    'OUT_FOR_DELIVERY': { color: 'cyan', text: 'Đang vận chuyển' },
    'DELIVERED': { color: 'green', text: 'Đã giao hàng' },
    'COMPLETED': { color: 'green', text: 'Hoàn thành' },
    'CANCELED': { color: 'red', text: 'Đã hủy' },
    'RETURN_REQUESTED': { color: 'volcano', text: 'Yêu cầu trả hàng' },
    'RETURNED': { color: 'magenta', text: 'Đã trả hàng' },
    'REFUNDED': { color: 'lime', text: 'Đã hoàn tiền' },
    'FAILED': { color: 'volcano', text: 'Giao hàng thất bại' }
  };
  
  const statusInfo = statusMap[status] || { color: 'default', text: status };
  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
};

// Helper functions for sequential status system
export const getStatusIndex = (status) => {
  return sequentialStatusFlow.findIndex(item => item.key === status);
};

export const getNextStatus = (currentStatus) => {
  const currentIndex = getStatusIndex(currentStatus);
  if (currentIndex === -1 || currentIndex >= sequentialStatusFlow.length - 1) {
    return null;
  }
  return sequentialStatusFlow[currentIndex + 1].key;
};

export const canAdvanceToStatus = (currentStatus, targetStatus) => {
  const currentIndex = getStatusIndex(currentStatus);
  const targetIndex = getStatusIndex(targetStatus);
  
  // Can only advance to the next status in sequence
  return targetIndex === currentIndex + 1;
};

export const isValidSequentialStatus = (status) => {
  return sequentialStatusFlow.some(item => item.key === status);
};

// Helper function to determine if order is online based on payment method
export const isOnlineOrder = (paymentMethod) => {
  return paymentMethod === 'CASH_ON_DELIVERY' || paymentMethod === 'VNPAY';
};

export const getActiveFilterCount = (filters) => {
  const { searchText, statusFilter, paymentFilter, dateRange, customerTypeFilter, filter } = filters;
  let count = 0;
  if (searchText?.trim()) count++;
  if (statusFilter !== 'all') count++;
  if (paymentFilter !== 'all') count++;
  if (dateRange && Array.isArray(dateRange) && dateRange.length === 2 && dateRange[0] && dateRange[1]) count++;
  if (customerTypeFilter !== 'all') count++;
  if (filter !== 'all') count++;
  return count;
};

export const filterOrders = (orders, filters) => {
  const {
    searchText,
    statusFilter,
    paymentFilter,
    dateRange,
    customerTypeFilter,
    filter
  } = filters;



  let filtered = [...orders];

  // Filter by sale type (online vs counter)
  if (customerTypeFilter !== 'all') {
    if (customerTypeFilter === 'online') {
      filtered = filtered.filter((order) => isOnlineOrder(order.paymentMethod));
    } else if (customerTypeFilter === 'counter') {
      filtered = filtered.filter((order) => !isOnlineOrder(order.paymentMethod));
    }
  }

  // Filter by status
  if (statusFilter !== 'all') {
    filtered = filtered.filter((order) => order.orderStatus === statusFilter);
  }

  // Filter by payment status
  if (paymentFilter !== 'all') {
    const isPaid = paymentFilter === 'paid';
    filtered = filtered.filter((order) => order.paid === isPaid);
  }

  // Filter by date range
  if (dateRange && Array.isArray(dateRange) && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
    const [startDate, endDate] = dateRange;
    
    // Validate date range - ensure startDate <= endDate
    if (moment(startDate).isAfter(moment(endDate))) {
      console.warn('Invalid date range: startDate is after endDate');
      return filtered; // Return unfiltered if invalid range
    }
    
    // Tạo boundaries chuẩn xác
    const startBoundary = moment(startDate).startOf('day'); // 00:00:00
    const endBoundary = moment(endDate).endOf('day'); // 23:59:59
    
    filtered = filtered.filter((order) => {
      if (!order.orderDate) return false;
      
      // Parse ngày đơn hàng với nhiều format khác nhau
      const orderMoment = parseOrderDate(order.orderDate);
      if (!orderMoment) return false;
      
      // Kiểm tra nằm trong khoảng (bao gồm 2 đầu mút)
      return orderMoment.isSameOrAfter(startBoundary) && orderMoment.isSameOrBefore(endBoundary);
    });
  }

  // Filter by search text (order ID, customer name, guest name, phone)
  if (searchText?.trim()) {
    const searchLower = searchText.toLowerCase().trim();
    filtered = filtered.filter((order) => {
      return (
        order.orderId?.toLowerCase().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.guestName?.toLowerCase().includes(searchLower) ||
        order.customerPhone?.includes(searchText.trim()) ||
        order.guestPhone?.includes(searchText.trim())
      );
    });
  }

  // Legacy filter support
  if (filter === 'guest') {
    filtered = filtered.filter((order) => order.guestName);
  } else if (filter === 'customer') {
    filtered = filtered.filter((order) => order.customerName);
  }

  return filtered;
};

// Cancellation Rules
export const canAdminCancelOrder = (orderStatus) => {
  // Admin cannot cancel from 'waiting for shipping' (SHIPPED) and beyond
  const restrictedStatuses = ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELED', 'FAILED' ,'RETURNED', 'REFUNDED'];
  return !restrictedStatuses.includes(orderStatus);
};

export const canCustomerCancelOrder = (orderStatus) => {
  // Customer cannot cancel from 'confirmed' (PROCESSING) and beyond  
  const restrictedStatuses = ['PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELED', 'RETURNED', 'REFUNDED'];
  return !restrictedStatuses.includes(orderStatus);
};

export const getCancellationRuleMessage = (orderStatus, isAdmin = true) => {
  if (isAdmin) {
    if (!canAdminCancelOrder(orderStatus)) {
      return 'Admin không thể hủy đơn hàng từ trạng thái "Chờ vận chuyển" trở đi';
    }
  } else {
    if (!canCustomerCancelOrder(orderStatus)) {
      return 'Khách hàng không thể hủy đơn hàng từ trạng thái "Đã xác nhận" trở đi';
    }
  }
  return '';
};

// Kiểm tra xem order có ở trạng thái final (đã kết thúc) không
export const isFinalStatus = (orderStatus) => {
  const finalStatuses = ['COMPLETED', 'CANCELED', 'FAILED', 'RETURNED', 'REFUNDED'];
  return finalStatuses.includes(orderStatus);
};