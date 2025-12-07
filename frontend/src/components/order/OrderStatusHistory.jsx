import React, { useState, useEffect, useCallback } from 'react';
import { Timeline, Tag, Typography, Spin, message, Button, Modal } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { getOrderStatusHistory } from '../../services/home/HomeService';

const { Text } = Typography;

const OrderStatusHistory = ({ orderId, isAdmin = false, open, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatusHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrderStatusHistory(orderId);
      // Sort history by time (newest first)
      const historyArray = data?.history || data || [];
      const sortedHistory = historyArray.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
      setHistory(sortedHistory);
    } catch (error) {
      console.error('Error fetching status history:', error);
      message.error('Không thể tải lịch sử trạng thái đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (open && orderId) {
      fetchStatusHistory();
    }
  }, [open, orderId, fetchStatusHistory]);

  const getStatusTag = (status) => {
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
      'FAILED': { color: 'red', text: 'Thất bại' }
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const timelineItems = history.map((item, index) => {
    const changeTime = item.changedAt ? new Date(item.changedAt).toLocaleString('vi-VN') : 'Không xác định';
    const changedBy = item.changedBy ? item.changedBy.replace('Admin: ', '').replace('Admin:', '') : 'Hệ thống';
    
    return {
      key: index,
      color: index === 0 ? 'green' : 'blue',
      children: (
        <div style={{ paddingBottom: '16px' }}>
          <div style={{ 
            backgroundColor: '#fafafa', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {getStatusTag(item.fromStatus)}
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>→</span>
              {getStatusTag(item.toStatus)}
            </div>
            <div style={{ color: '#666', fontSize: '13px', marginBottom: 4 }}>
              <strong>Thời gian:</strong> {changeTime}
            </div>
            <div style={{ color: '#666', fontSize: '13px', marginBottom: 4 }}>
              <strong>Người thay đổi:</strong> {changedBy}
            </div>
            {item.changeReason && item.changeReason !== 'Cập nhật trạng thái đơn hàng' && (
              <div style={{ color: '#888', fontSize: '12px', marginTop: 4 }}>
                <strong>Lý do:</strong> {item.changeReason}
              </div>
            )}
          </div>
        </div>
      )
    };
  });

  return (
    <Modal
  okText="Lưu"
  cancelText="Hủy"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClockCircleOutlined style={{ color: '#1890ff' }} />
          <span>Lịch sử trạng thái đơn hàng #{orderId}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={700}
      style={{ top: 20 }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">Đang tải lịch sử trạng thái...</Text>
          </div>
        </div>
      ) : history.length > 0 ? (
        <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px' }}>
          <Timeline
            mode="left"
            items={timelineItems}
          />
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          <ClockCircleOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <div>Chưa có lịch sử thay đổi trạng thái</div>
        </div>
      )}
    </Modal>
  );
};

export default OrderStatusHistory;
