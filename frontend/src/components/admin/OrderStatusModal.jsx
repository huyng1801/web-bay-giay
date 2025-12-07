import React, { useState } from 'react';
import { Modal, Select, Input, Timeline, message, Button, Space, Typography, Divider } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { statusOptions, getStatusTag, getStatusText, isValidSequentialStatus, getNextStatus, sequentialStatusFlow, isFinalStatus } from '../../utils/orderUtils';
import OrderService from '../../services/admin/OrderService';

const { Text, Title } = Typography;

const OrderStatusModal = ({
  visible,
  onCancel,
  selectedOrder,
  onSuccess
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusUpdateReason, setStatusUpdateReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);

  // Fetch order status history
  const fetchStatusHistory = React.useCallback(async () => {
    if (!selectedOrder?.orderId) return;
    
    try {
      const history = await OrderService.getOrderStatusHistory(selectedOrder.orderId);
      setStatusHistory(Array.isArray(history) ? history : []);
    } catch (error) {
      console.error('Error fetching status history:', error);
      setStatusHistory([]);
    }
  }, [selectedOrder?.orderId]);

  // Reset form khi modal mở và fetch status history
  React.useEffect(() => {
    if (visible && selectedOrder) {
      setSelectedStatus(selectedOrder.orderStatus || '');
      setStatusUpdateReason('');
      fetchStatusHistory();
    }
  }, [visible, selectedOrder, fetchStatusHistory]);

  // Get timestamp for a specific status from history
  const getStatusTimestamp = (status) => {
    if (!statusHistory.length) return null;
    
    // Find the history entry where this status was set as 'toStatus'
    const historyEntry = statusHistory.find(entry => entry.toStatus === status);
    return historyEntry?.changedAt ? new Date(historyEntry.changedAt) : null;
  };

  const handleSubmit = async () => {
    if (!selectedOrder || !selectedStatus) {
      message.warning('Vui lòng chọn trạng thái mới!');
      return;
    }

    if (selectedStatus === selectedOrder.orderStatus) {
      message.warning('Trạng thái mới không khác trạng thái hiện tại!');
      return;
    }

    setLoading(true);
    try {
      await OrderService.updateOrderStatusAdmin(
        selectedOrder.orderId,
        selectedStatus,
        'Admin',
        statusUpdateReason || `Cập nhật trạng thái từ "${getStatusText(selectedOrder.orderStatus)}" sang "${getStatusText(selectedStatus)}"`
      );
      
      message.success('Cập nhật trạng thái đơn hàng thành công!');
      
      // Reset form
      setSelectedStatus('');
      setStatusUpdateReason('');
      
      // Gọi callback để refresh data
      if (onSuccess) {
        onSuccess();
      }
      
      // Đóng modal
      onCancel();
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Lỗi khi cập nhật trạng thái đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  // Handle Yes/No for sequential status update
  const handleSequentialUpdate = async (shouldUpdate) => {
    if (!shouldUpdate) {
      onCancel();
      return;
    }

    const nextStatus = getNextStatus(selectedOrder?.orderStatus);
    if (nextStatus) {
      setLoading(true);
      try {
        await OrderService.updateOrderStatusAdmin(
          selectedOrder.orderId,
          nextStatus,
          'Admin',
          `Cập nhật trạng thái từ "${getStatusText(selectedOrder.orderStatus)}" sang "${getStatusText(nextStatus)}"`
        );
        
        message.success('Đã cập nhật trạng thái đơn hàng!');
        
        if (onSuccess) {
          onSuccess();
        }
        
        onCancel();
      } catch (error) {
        console.error('Error updating order status:', error);
        message.error('Lỗi khi cập nhật trạng thái!');
      } finally {
        setLoading(false);
      }
    }
  };

  // Check if current order uses sequential status system
  const isSequential = selectedOrder && isValidSequentialStatus(selectedOrder.orderStatus);
  const nextStatus = isSequential ? getNextStatus(selectedOrder.orderStatus) : null;
  
  // Check if order is in final status (cannot be changed)
  const isOrderFinal = selectedOrder && isFinalStatus(selectedOrder.orderStatus);

  return (
    <Modal
      title={`Cập nhật trạng thái đơn hàng #${selectedOrder?.orderId || ''}`}
      visible={visible}
      onOk={isSequential || isOrderFinal ? null : handleSubmit}
      onCancel={onCancel}
      okText={isSequential || isOrderFinal ? null : "Cập nhật trạng thái"}
      cancelText="Hủy"
      confirmLoading={loading}
      width={700}
      footer={isSequential || isOrderFinal ? null : undefined}
    >
      {/* Sequential Status Update Section */}
      {isSequential && nextStatus && (
        <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 8, border: '1px solid #d1ecf1' }}>
          <div style={{ marginBottom: 16 }}>
            <Text strong>Trạng thái hiện tại: </Text>
            {getStatusTag(selectedOrder.orderStatus)}
          </div>
          <div style={{ marginBottom: 16 }}>
            <Text strong>Chuyển sang trạng thái tiếp theo: </Text>
            {getStatusTag(nextStatus)}
          </div>
          <div style={{ marginBottom: 16, color: '#666' }}>
            <Text>Bạn có muốn chuyển đơn hàng sang trạng thái tiếp theo không?</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<CheckOutlined />}
              loading={loading}
              onClick={() => handleSequentialUpdate(true)}
              style={{ minWidth: 80 }}
            >
              Đồng ý
            </Button>
            <Button 
              icon={<CloseOutlined />}
              onClick={() => handleSequentialUpdate(false)}
              style={{ minWidth: 80 }}
            >
              Hủy
            </Button>
          </Space>
        </div>
      )}

      {/* Show message when order is in final status */}
      {isOrderFinal && (
        <div style={{ 
          marginBottom: 24, 
          padding: 16, 
          backgroundColor: selectedOrder.orderStatus === 'COMPLETED' ? '#f6ffed' : 
                           selectedOrder.orderStatus === 'CANCELED' ? '#fff2f0' : '#fff7e6', 
          borderRadius: 8, 
          border: selectedOrder.orderStatus === 'COMPLETED' ? '1px solid #b7eb8f' : 
                  selectedOrder.orderStatus === 'CANCELED' ? '1px solid #ffccc7' : '1px solid #ffd591'
        }}>
          <Title level={4} style={{ 
            marginBottom: 12, 
            color: selectedOrder.orderStatus === 'COMPLETED' ? '#52c41a' : 
                   selectedOrder.orderStatus === 'CANCELED' ? '#ff4d4f' : '#fa8c16'
          }}>
            {selectedOrder.orderStatus === 'COMPLETED' ? '✅ Đơn hàng đã hoàn thành' : 
             selectedOrder.orderStatus === 'CANCELED' ? '❌ Đơn hàng đã bị hủy' : 
             selectedOrder.orderStatus === 'FAILED' ? '⚠️ Giao hàng thất bại' :
             selectedOrder.orderStatus === 'RETURNED' ? '🔄 Đã trả hàng' :
             selectedOrder.orderStatus === 'REFUNDED' ? '💰 Đã hoàn tiền' : 'Đơn hàng đã kết thúc'}
          </Title>
          <div style={{ marginBottom: 16 }}>
            <Text strong>Trạng thái hiện tại: </Text>
            {getStatusTag(selectedOrder.orderStatus)}
          </div>
          <Text style={{ 
            color: selectedOrder.orderStatus === 'COMPLETED' ? '#52c41a' : 
                   selectedOrder.orderStatus === 'CANCELED' ? '#ff4d4f' : '#fa8c16'
          }}>
            {selectedOrder.orderStatus === 'COMPLETED' ? 'Đơn hàng này đã hoàn thành tất cả các bước!' : 
             selectedOrder.orderStatus === 'CANCELED' ? 'Đơn hàng này đã bị hủy và không thể thay đổi trạng thái.' :
             selectedOrder.orderStatus === 'FAILED' ? 'Đơn hàng giao thất bại, cần xử lý riêng.' :
             selectedOrder.orderStatus === 'RETURNED' ? 'Hàng đã được trả lại, cần xử lý hoàn tiền.' :
             selectedOrder.orderStatus === 'REFUNDED' ? 'Đã hoàn tiền cho khách hàng.' : 'Đơn hàng ở trạng thái cuối, không thể thay đổi.'}
          </Text>
        </div>
      )}

      {/* Show completion message if sequential and no next status (but not final) */}
      {isSequential && !nextStatus && !isOrderFinal && (
        <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
          <Title level={4} style={{ marginBottom: 12, color: '#52c41a' }}>
            Đơn hàng đã hoàn thành
          </Title>
          <div style={{ marginBottom: 16 }}>
            <Text strong>Trạng thái hiện tại: </Text>
            {getStatusTag(selectedOrder.orderStatus)}
          </div>
          <Text style={{ color: '#52c41a' }}>✅ Đơn hàng này đã hoàn thành tất cả các bước!</Text>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        {/* Shipping Process Timeline */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 12, fontWeight: 'bold', fontSize: '16px' }}>
            Tiến trình vận chuyển:
          </label>
          <Timeline 
            mode="left"
            style={{ 
              backgroundColor: '#fafafa', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}
          >
            {/* Timeline Item 1: Đặt hàng */}
            <Timeline.Item 
              color={selectedOrder?.orderStatus === 'PENDING_PAYMENT' ? 'blue' : 
                     ['PAYMENT_CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(selectedOrder?.orderStatus) ? 'green' : 'gray'}
              dot={selectedOrder?.orderStatus === 'PENDING_PAYMENT' ? 
                   <div style={{ width: 12, height: 12, backgroundColor: '#1890ff', borderRadius: '50%' }} /> : null}
            >
              <div style={{ fontWeight: 'bold', color: '#1890ff' }}>1. Đặt hàng</div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {selectedOrder?.orderStatus === 'PENDING_PAYMENT' ? 'Đơn hàng đã được tạo' : 'Hoàn thành'}
              </div>
              <div style={{ color: '#999', fontSize: '11px' }}>
                {selectedOrder?.orderDate ? new Date(selectedOrder.orderDate).toLocaleString('vi-VN') : ''}
              </div>
            </Timeline.Item>
            
            {/* Timeline Item 2: Chờ xác nhận */}
            <Timeline.Item 
              color={selectedOrder?.orderStatus === 'PAYMENT_CONFIRMED' ? 'blue' : 
                     ['PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(selectedOrder?.orderStatus) ? 'green' : 'gray'}
              dot={selectedOrder?.orderStatus === 'PAYMENT_CONFIRMED' ? 
                   <div style={{ width: 12, height: 12, backgroundColor: '#1890ff', borderRadius: '50%' }} /> : null}
            >
              <div style={{ fontWeight: 'bold', color: '#1890ff' }}>2. Chờ xác nhận</div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {selectedOrder?.orderStatus === 'PAYMENT_CONFIRMED' ? 'Chờ xác nhận đơn hàng' : 
                 ['PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(selectedOrder?.orderStatus) ? 'Đã xác nhận' : 'Chưa xác nhận'}
              </div>
              {getStatusTimestamp('PAYMENT_CONFIRMED') && (
                <div style={{ color: '#999', fontSize: '11px' }}>
                  {getStatusTimestamp('PAYMENT_CONFIRMED').toLocaleString('vi-VN')}
                </div>
              )}
            </Timeline.Item>
            
            {/* Timeline Item 3: Đã xác nhận */}
            <Timeline.Item 
              color={selectedOrder?.orderStatus === 'PROCESSING' ? 'blue' : 
                     ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(selectedOrder?.orderStatus) ? 'green' : 'gray'}
              dot={selectedOrder?.orderStatus === 'PROCESSING' ? 
                   <div style={{ width: 12, height: 12, backgroundColor: '#1890ff', borderRadius: '50%' }} /> : null}
            >
              <div style={{ fontWeight: 'bold', color: '#1890ff' }}>3. Đã xác nhận</div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {selectedOrder?.orderStatus === 'PROCESSING' ? 'Đơn hàng đã được xác nhận' : 
                 ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(selectedOrder?.orderStatus) ? 'Đã xử lý xong' : 'Chưa xử lý'}
              </div>
              {getStatusTimestamp('PROCESSING') && (
                <div style={{ color: '#999', fontSize: '11px' }}>
                  {getStatusTimestamp('PROCESSING').toLocaleString('vi-VN')}
                </div>
              )}
            </Timeline.Item>
            
            {/* Timeline Item 4: Chờ vận chuyển */}
            <Timeline.Item 
              color={selectedOrder?.orderStatus === 'SHIPPED' ? 'blue' : 
                     ['OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(selectedOrder?.orderStatus) ? 'green' : 'gray'}
              dot={selectedOrder?.orderStatus === 'SHIPPED' ? 
                   <div style={{ width: 12, height: 12, backgroundColor: '#1890ff', borderRadius: '50%' }} /> : null}
            >
              <div style={{ fontWeight: 'bold', color: '#1890ff' }}>4. Chờ vận chuyển</div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {selectedOrder?.orderStatus === 'SHIPPED' ? 'Chuẩn bị vận chuyển' : 
                 ['OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(selectedOrder?.orderStatus) ? 'Đã xuất kho' : 'Chưa xuất kho'}
              </div>
              {selectedOrder?.shippingName && (
                <div style={{ color: '#999', fontSize: '11px' }}>
                  Đơn vị: {selectedOrder.shippingName}
                </div>
              )}
              {getStatusTimestamp('SHIPPED') && (
                <div style={{ color: '#999', fontSize: '11px' }}>
                  {getStatusTimestamp('SHIPPED').toLocaleString('vi-VN')}
                </div>
              )}
            </Timeline.Item>
            
            {/* Timeline Item 5: Đang vận chuyển */}
            <Timeline.Item 
              color={selectedOrder?.orderStatus === 'OUT_FOR_DELIVERY' ? 'blue' : 
                     ['DELIVERED', 'COMPLETED'].includes(selectedOrder?.orderStatus) ? 'green' : 'gray'}
              dot={selectedOrder?.orderStatus === 'OUT_FOR_DELIVERY' ? 
                   <div style={{ width: 12, height: 12, backgroundColor: '#1890ff', borderRadius: '50%' }} /> : null}
            >
              <div style={{ fontWeight: 'bold', color: '#1890ff' }}>5. Đang vận chuyển</div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {selectedOrder?.orderStatus === 'OUT_FOR_DELIVERY' ? 'Đang giao hàng' : 
                 ['DELIVERED', 'COMPLETED'].includes(selectedOrder?.orderStatus) ? 'Đã giao hàng' : 'Chưa giao hàng'}
              </div>
              {selectedOrder?.deliveryTime && (
                <div style={{ color: '#999', fontSize: '11px' }}>
                  Thời gian dự kiến: {selectedOrder.deliveryTime}
                </div>
              )}
              {getStatusTimestamp('OUT_FOR_DELIVERY') && (
                <div style={{ color: '#999', fontSize: '11px' }}>
                  {getStatusTimestamp('OUT_FOR_DELIVERY').toLocaleString('vi-VN')}
                </div>
              )}
            </Timeline.Item>
            
            {/* Timeline Item 6: Đã giao hàng */}
            <Timeline.Item 
              color={selectedOrder?.orderStatus === 'DELIVERED' ? 'blue' : 
                     selectedOrder?.orderStatus === 'COMPLETED' ? 'green' : 'gray'}
              dot={selectedOrder?.orderStatus === 'DELIVERED' ? 
                   <div style={{ width: 12, height: 12, backgroundColor: '#1890ff', borderRadius: '50%' }} /> : null}
            >
              <div style={{ fontWeight: 'bold', color: '#1890ff' }}>6. Đã giao hàng</div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {selectedOrder?.orderStatus === 'DELIVERED' ? 'Đã giao hàng thành công' : 
                 selectedOrder?.orderStatus === 'COMPLETED' ? 'Đã giao hàng' : 'Chưa giao hàng'}
              </div>
              {getStatusTimestamp('DELIVERED') && (
                <div style={{ color: '#999', fontSize: '11px' }}>
                  {getStatusTimestamp('DELIVERED').toLocaleString('vi-VN')}
                </div>
              )}
            </Timeline.Item>
            
            {/* Timeline Item 7: Hoàn thành */}
            <Timeline.Item 
              color={selectedOrder?.orderStatus === 'COMPLETED' ? 'green' : 'gray'}
              dot={selectedOrder?.orderStatus === 'COMPLETED' ? 
                   <div style={{ width: 12, height: 12, backgroundColor: '#52c41a', borderRadius: '50%' }} /> : null}
            >
              <div style={{ fontWeight: 'bold', color: '#52c41a' }}>7. Hoàn thành</div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {selectedOrder?.orderStatus === 'COMPLETED' ? 'Đơn hàng đã hoàn thành' : 'Chưa hoàn thành'}
              </div>
              {getStatusTimestamp('COMPLETED') && (
                <div style={{ color: '#999', fontSize: '11px' }}>
                  {getStatusTimestamp('COMPLETED').toLocaleString('vi-VN')}
                </div>
              )}
            </Timeline.Item>
          </Timeline>
        </div>

        {/* Status Update Section - Only show for non-sequential statuses and non-final orders */}
        {!isSequential && !isOrderFinal && (
          <>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Trạng thái hiện tại: {selectedOrder && getStatusTag(selectedOrder.orderStatus)}
            </label>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Chọn trạng thái mới:
            </label>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: '100%', marginBottom: 16 }}
              placeholder="Chọn trạng thái"
            >
              {statusOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Lý do thay đổi (bắt buộc):
            </label>
            <Input.TextArea
              value={statusUpdateReason}
              onChange={(e) => setStatusUpdateReason(e.target.value)}
              placeholder="Nhập lý do thay đổi trạng thái (VD: Khách hàng yêu cầu hủy đơn, Lỗi sản phẩm...)..."
              rows={3}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default OrderStatusModal;