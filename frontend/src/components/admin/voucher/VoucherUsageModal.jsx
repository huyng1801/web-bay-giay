import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Tag, Typography, Space, Spin } from 'antd';
import { getVoucherUsageStats } from '../../../services/admin/VoucherService';
import dayjs from 'dayjs';

const { Text } = Typography;

const VoucherUsageModal = ({ visible, voucherId, voucherCode, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [usageData, setUsageData] = useState([]);

  const fetchUsageStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getVoucherUsageStats(voucherId);
      setUsageData(response || []);
    } catch (error) {
      console.error('Error fetching voucher usage stats:', error);
      setUsageData([]);
    } finally {
      setLoading(false);
    }
  }, [voucherId]);

  useEffect(() => {
    if (visible && voucherId) {
      fetchUsageStats();
    }
  }, [visible, voucherId, fetchUsageStats]);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId) => (
        <Text code style={{ color: '#1890ff' }}>{orderId}</Text>
      )
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => (
        <div>
          <Text strong>{record.customerName || record.guestName || 'Khách vãng lai'}</Text>
          {(record.customerPhone || record.guestPhone) && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                📞 {record.customerPhone || record.guestPhone}
              </Text>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Giá trị đơn hàng',
      dataIndex: 'originalPrice',
      key: 'originalPrice',
      align: 'right',
      render: (price) => (
        <Text strong>{price?.toLocaleString()}₫</Text>
      )
    },
    {
      title: 'Giảm giá',
      dataIndex: 'voucherDiscount',
      key: 'voucherDiscount',
      align: 'right',
      render: (discount) => (
        <Text style={{ color: '#52c41a' }}>-{discount?.toLocaleString()}₫</Text>
      )
    },
    {
      title: 'Tổng thanh toán',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'right',
      render: (total) => (
        <Text strong style={{ color: '#722ed1' }}>{total?.toLocaleString()}₫</Text>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => {
        const statusColors = {
          'COMPLETED': 'green',
          'DELIVERED': 'blue',
          'CANCELED': 'red',
          'PENDING_PAYMENT': 'orange',
          'PAYMENT_CONFIRMED': 'cyan',
          'PROCESSING': 'purple',
          'SHIPPED': 'geekblue'
        };
        
        const statusLabels = {
          'COMPLETED': 'Hoàn thành',
          'DELIVERED': 'Đã giao',
          'CANCELED': 'Đã hủy',
          'PENDING_PAYMENT': 'Chờ thanh toán',
          'PAYMENT_CONFIRMED': 'Đã xác nhận',
          'PROCESSING': 'Đang xử lý',
          'SHIPPED': 'Đang vận chuyển'
        };

        return (
          <Tag color={statusColors[status] || 'default'}>
            {statusLabels[status] || status}
          </Tag>
        );
      }
    },
    {
      title: 'Ngày sử dụng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div>
          <div>{dayjs(date).format('DD/MM/YYYY')}</div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {dayjs(date).format('HH:mm')}
          </Text>
        </div>
      )
    }
  ];

  return (
    <Modal
      title={
        <Space>
          <span>Lịch sử sử dụng voucher</span>
        </Space>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary">
          Tổng số lượt sử dụng: <Text strong>{usageData.length}</Text>
        </Text>
      </div>
      
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={usageData}
          rowKey="orderId"
          pagination={{
            pageSize: 10,

          }}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Spin>
    </Modal>
  );
};

export default VoucherUsageModal;