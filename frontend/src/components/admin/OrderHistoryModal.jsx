import React from 'react';
import { Modal, Timeline } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { getStatusTag } from '../../utils/orderUtils';

const OrderHistoryModal = ({
  visible,
  onCancel,
  selectedOrder,
  orderHistory
}) => {
  
  return (
    <Modal
  okText="Lưu"
  cancelText="Hủy"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HistoryOutlined style={{ color: '#1890ff' }} />
          <span>Lịch sử trạng thái đơn hàng #{selectedOrder?.orderId || ''}</span>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px' }}>
        <Timeline mode="left">
          {orderHistory.map((history, index) => {
            const changeTime = history.changedAt ? new Date(history.changedAt).toLocaleString('vi-VN') : 'Không xác định';
            const changedBy = history.changedBy ? history.changedBy.replace('Admin: ', '').replace('Admin:', '') : 'Hệ thống';
            
            return (
              <Timeline.Item 
                key={index}
                color={index === 0 ? 'green' : 'blue'}
                style={{ paddingBottom: '16px' }}
              >
                <div style={{ 
                  backgroundColor: '#fafafa', 
                  padding: '12px', 
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getStatusTag(history.fromStatus)}
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>→</span>
                    {getStatusTag(history.toStatus)}
                  </div>
                  <div style={{ color: '#666', fontSize: '13px', marginBottom: 4 }}>
                    <strong>Thời gian:</strong> {changeTime}
                  </div>
                  <div style={{ color: '#666', fontSize: '13px', marginBottom: 4 }}>
                    <strong>Người thay đổi:</strong> {changedBy}
                  </div>
                  {history.changeReason && history.changeReason !== 'Cập nhật trạng thái đơn hàng' && (
                    <div style={{ color: '#888', fontSize: '12px', marginTop: 4 }}>
                      <strong>Lý do:</strong> {history.changeReason}
                    </div>
                  )}
                </div>
              </Timeline.Item>
            );
          })}
        </Timeline>
        {orderHistory.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
            <HistoryOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>Chưa có lịch sử thay đổi trạng thái</div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OrderHistoryModal;
