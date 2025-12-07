import React from 'react';
import { Table, Button, Space, Tag, Typography } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  HistoryOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  StopOutlined,
  DeleteOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { statusOptions, getStatusTag, canAdminCancelOrder, isOnlineOrder } from '../../utils/orderUtils';

const { Text } = Typography;

const OrderTable = ({
  data,
  loading,
  onViewDetails,
  onUpdateStatus,
  onViewHistory,
  onDeliverySuccess,
  onDeliveryFailed,
  onDeleteOrder,
  onUpdateStaff,
  onReturnOrder,
  onCancelOrder,
  onShowStaffAssignment
}) => {

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 130,
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 150,
      render: (orderDate) => {
        if (!orderDate) return <Text type="secondary">N/A</Text>;
        const date = new Date(orderDate);
        return (
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500' }}>
              {date.toLocaleDateString('vi-VN')}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      },
      sorter: (a, b) => new Date(b.orderDate) - new Date(a.orderDate),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Tổng giá',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 110,
      align: 'right',
      render: (totalPrice, record) => {
        if (record.voucherDiscount && record.voucherDiscount > 0) {
          return (
            <div>
              <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px' }}>
                {record.originalPrice ? `${record.originalPrice.toLocaleString()}₫` : ''}
              </div>
              <div style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '14px' }}>
                {totalPrice.toLocaleString()}₫
              </div>
            </div>
          );
        }
        return (
          <Text strong style={{ color: '#333', fontSize: '14px' }}>
            {totalPrice.toLocaleString()}₫
          </Text>
        );
      },
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Voucher',
      key: 'voucher',
      width: 80,
      render: (text, record) => {
        if (record.voucherCode && record.voucherDiscount) {
          return (
            <div>
              <Tag color="blue" style={{ marginBottom: '4px' }}>
                {record.voucherCode}
              </Tag>
              <div style={{ color: '#52c41a', fontSize: '12px' }}>
                -{record.voucherDiscount.toLocaleString()} VND
              </div>
            </div>
          );
        }
        return <span style={{ color: '#999' }}>Không</span>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 160,
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paid',
      key: 'paid',

      align: 'center',
      render: (paid) => (
        paid ? (
          <CheckCircleOutlined size="small" style={{ color: '#52c41a', fontSize: 20 }} title="Đã thanh toán" />
        ) : (
          <CloseCircleOutlined size="small" style={{ color: '#ff4d4f', fontSize: 20 }} title="Chưa thanh toán" />
        )
      ),
    },
    {
      title: 'Vận chuyển',
      key: 'shipping',
      render: (text, record) => {
        if (record.shippingName) {
          return (
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                {record.shippingName}
              </div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                {record.shippingFee ? `${record.shippingFee.toLocaleString()} VND` : ''}
              </div>
              <div style={{ color: '#999', fontSize: '11px' }}>
                {record.deliveryTime || ''}
              </div>
            </div>
          );
        }
        return <span style={{ color: '#999' }}>Chưa chọn</span>;
      },
    },
    {
      title: 'Khách hàng',
      key: 'customerInfo',
      render: (text, record) => {
        const isOnline = isOnlineOrder(record.paymentMethod);
        
        if (isOnline) {
          // Online order - show customer name if available, otherwise show guest
          const customerName = record.customerName || record.guestName || 'Khách hàng';
          return (
            <div>
              <div style={{ fontSize: '12px', color: '#52c41a', fontWeight: 'bold' }}>
                {customerName}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                🌐 Bán online
              </div>
            </div>
          );
        } else {
          // In-store order
          const customerName = record.guestName || record.customerName || 'Khách hàng';
          return (
            <div>
              <div style={{ fontSize: '12px', color: '#1890ff', fontWeight: 'bold' }}>
                {customerName}
              </div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                🏪 Bán tại quầy
              </div>
            </div>
          );
        }
      },
    },
    {
      title: 'Loại bán hàng',
      key: 'saleType',
      render: (text, record) => {
        const isOnline = isOnlineOrder(record.paymentMethod);
        
        if (isOnline) {
          return (
            <Tag color="green" style={{ fontSize: '11px' }}>
              🌐 Online
            </Tag>
          );
        } else {
          return (
            <Tag color="blue" style={{ fontSize: '11px' }}>
              🏪 Tại quầy
            </Tag>
          );
        }
      },
      filters: [
        { text: '🏪 Bán tại quầy', value: 'counter' },
        { text: '🌐 Bán online', value: 'online' },
      ],
      onFilter: (value, record) => {
        const isOnline = isOnlineOrder(record.paymentMethod);
        if (value === 'counter') return !isOnline;
        if (value === 'online') return isOnline;
        return false;
      },
      width: 120,
    },
    {
      title: 'Nhân viên phụ trách',
      key: 'staffAssignment',
      width: 150,
      render: (text, record) => {
        const isOnline = isOnlineOrder(record.paymentMethod);
        
        // Show current assigned staff if exists
        if (record.assignedStaffId && record.assignedStaffName) {
          return (
            <div>
              <div style={{ marginBottom: '8px' }}>
                <Tag color="blue" icon={<UserOutlined />}>
                  {record.assignedStaffName}
                </Tag>
              </div>
            </div>
          );
        }
        
        // For counter sales (not online), show auto-assigned status
        if (!isOnline) {
          return (
            <div>
              <Tag color="green" icon={<UserOutlined />}>
                Tự động chỉ định
              </Tag>
              <div style={{ fontSize: '11px', color: '#666' }}>
                (Bán tại quầy)
              </div>
            </div>
          );
        }

        // For online orders without staff assignment
        return (
          <div>
            <Tag color="orange" style={{ marginBottom: '4px' }}>
              ⚠️ Chưa gán
            </Tag>
            <div style={{ fontSize: '11px', color: '#999' }}>
              Nhấn "Gán NV" để chỉ định
            </div>
          </div>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Space wrap>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => onViewDetails(record)} 
            title="Xem chi tiết"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onUpdateStatus(record)}
            title="Cập nhật trạng thái"
          />
          <Button
            type="link"
            icon={<HistoryOutlined />}
            onClick={() => onViewHistory(record)}
            title="Xem lịch sử trạng thái"
          />
          {/* Nút giao thành công/thất bại khi đang giao hàng */}
          {record.orderStatus === 'OUT_FOR_DELIVERY' && (
            <>
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => onDeliverySuccess(record)}
                title="Giao thành công"
              />
              <Button
                type="link"
                icon={<CloseCircleOutlined />}
                danger
                onClick={() => onDeliveryFailed(record)}
                title="Giao thất bại"
              />
              <Button
                type="link"
                icon={<RollbackOutlined />}
                style={{ color: '#fa541c' }}
                onClick={() => onReturnOrder && onReturnOrder(record)}
                title="Trả hoàn hàng (Khách không nhận/Bom hàng)"
              />
            </>
          )}
          {/* Nút trả hàng khi giao thất bại hoặc khách không nhận */}
          {(record.orderStatus === 'FAILED') && (
            <Button
              type="link"
              icon={<ReloadOutlined />}
              style={{ color: '#fa8c16' }}
              onClick={() => onReturnOrder && onReturnOrder(record)}
              title="Xử lý trả hàng"
            />
          )}
          {/* Nút gán nhân viên - hiện cho tất cả đơn online */}
          {isOnlineOrder(record.paymentMethod) && (
            <Button
              type="link"
              icon={<UserOutlined />}
              style={{ color: record.assignedStaffId ? '#1890ff' : '#52c41a' }}
              onClick={() => onShowStaffAssignment && onShowStaffAssignment(record)}
              title={record.assignedStaffId ? "Thay đổi nhân viên phụ trách" : "Gán nhân viên phụ trách"}
            />
          )}
          {/* Nút hủy đơn hàng nếu có thể hủy */}
          {canAdminCancelOrder(record.orderStatus) && (
            <Button
              type="link"
              icon={<StopOutlined />}
              danger
              onClick={() => onCancelOrder && onCancelOrder(record)}
              title="Hủy đơn hàng"
            />
          )}
          {/* Nút xóa đơn hàng - có thể bật lên nếu cần */}
          {/* <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDeleteOrder(record)}
            title="Xóa đơn hàng"
          /> */}
        </Space>
      ),
    },
  ];

  return (
    <Table 
      dataSource={data} 
      columns={columns} 
      rowKey="orderId" 
      pagination={{ 
        pageSize: 8,
      }}
      loading={loading}
      scroll={{ x: 1500 }}
      size="middle"
      bordered
    />
  );
};

export default OrderTable;
