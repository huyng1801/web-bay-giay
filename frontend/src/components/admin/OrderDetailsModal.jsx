import React from 'react';
import { Modal, Descriptions, Tag, Avatar, Table, Card, Typography } from 'antd';
import { UserOutlined, ClockCircleOutlined, ShoppingOutlined, CreditCardOutlined } from '@ant-design/icons';
import { getStatusTag } from '../../utils/orderUtils';

const { Text } = Typography;

const OrderDetailsModal = ({
  visible,
  onCancel,
  selectedOrder,
  orderItems
}) => {
  const getPaymentMethodText = (method) => {
    const paymentMap = {
      'CASH_ON_DELIVERY': 'Thanh toán khi nhận hàng (COD)',
      'VNPAY': 'Thanh toán VNPay', 
      'IN_STORE': 'Thanh toán tại cửa hàng',
      'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
      'CREDIT_CARD': 'Thẻ tín dụng',
      'QR_CODE': 'Thanh toán bằng mã QR'
    };
    return paymentMap[method] || method;
  };

  const getOrderDateText = (order) => {
    if (!order?.orderDate) return '';
    const date = new Date(order.orderDate);
    return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Table columns for products
  const productColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      align: 'center',
      render: (_, item) => (
        <Avatar 
          size={60} 
          src={item.productColorImageUrl || item.imageUrl || '/placeholder-product.png'} 
          shape="square"
          style={{ border: '1px solid #d9d9d9', borderRadius: '8px' }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (text) => (
        <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Màu sắc',
      dataIndex: 'colorName',
      key: 'colorName',
      width: 100,
      align: 'center',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Kích cỡ',
      dataIndex: 'sizeValue',
      key: 'sizeValue',
      width: 80,
      align: 'center',
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'center',
      render: (text) => (
        <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      align: 'right',
      render: (text) => (
        <Text strong style={{ color: '#52c41a' }}>
          {text.toLocaleString()} ₫
        </Text>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      width: 140,
      align: 'right',
      render: (_, item) => (
        <Text strong style={{ fontSize: '16px', color: '#722ed1' }}>
          {(item.quantity * item.unitPrice).toLocaleString()} ₫
        </Text>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingOutlined style={{ color: '#1890ff' }} />
          <span>Chi tiết đơn hàng {selectedOrder?.orderId}</span>
          {selectedOrder?.orderDate && (
            <Tag icon={<ClockCircleOutlined />} color="blue">
              {getOrderDateText(selectedOrder)}
            </Tag>
          )}
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      bodyStyle={{ padding: '24px' }}
    >
      {selectedOrder && (
        <>
          {/* Basic Order Information */}
          <Card 
            title={
              <Text strong style={{ fontSize: '16px' }}>
                <CreditCardOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                Thông tin đơn hàng
              </Text>
            }
            size="small"
            style={{ marginBottom: 24 }}
          >
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã đơn hàng">
                <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                  {selectedOrder.orderId}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt hàng">
                {selectedOrder.orderDate ? (
                  <Text>
                    {new Date(selectedOrder.orderDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}{' '}
                    {new Date(selectedOrder.orderDate).toLocaleDateString('vi-VN')}
                  </Text>
                ) : <Text type="secondary">N/A</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="Thông tin khách hàng">
                <div>
                  <Text strong style={{ color: '#1890ff' }}>
                    {selectedOrder.customerName || selectedOrder.guestName || 'Khách chưa xác định'}
                  </Text>
                  <br />
                  {(selectedOrder.customerEmail || selectedOrder.guestEmail) && (
                    <>
                      <Text type="secondary">{selectedOrder.customerEmail || selectedOrder.guestEmail}</Text>
                      <br />
                    </>
                  )}
                  {(selectedOrder.customerPhone || selectedOrder.guestPhone) && (
                    <Text type="secondary">{selectedOrder.customerPhone || selectedOrder.guestPhone}</Text>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                <Tag color="geekblue">
                  {getPaymentMethodText(selectedOrder.paymentMethod)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái đơn hàng">
                {getStatusTag(selectedOrder.orderStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={selectedOrder.paid ? 'green' : 'orange'}>
                  {selectedOrder.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
              </Descriptions.Item>
             
              {selectedOrder.originalPrice && selectedOrder.voucherDiscount ? (
                <>
                  <Descriptions.Item label="Giá gốc">
                    <Text delete style={{ color: '#999' }}>
                      {selectedOrder.originalPrice.toLocaleString()} ₫
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Voucher áp dụng">
                    <div>
                      <Tag color="blue">{selectedOrder.voucherCode}</Tag>
                      <br />
                      <Text style={{ color: '#52c41a' }}>
                        Giảm: {selectedOrder.voucherDiscount.toLocaleString()} ₫
                      </Text>
                    </div>
                  </Descriptions.Item>
                </>
              ) : null}
              <Descriptions.Item label="Tổng tiền" span={selectedOrder.originalPrice && selectedOrder.voucherDiscount ? 2 : 1}>
                <Text strong style={{ color: '#52c41a', fontSize: '18px' }}>
                  {selectedOrder.totalPrice.toLocaleString()} ₫
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Nhân viên phụ trách" span={2}>
                {selectedOrder.assignedStaffName ? (
                  <div>
                    <Tag color="blue" icon={<UserOutlined />} style={{ marginBottom: '4px' }}>
                      {selectedOrder.assignedStaffName}
                    </Tag>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Email: {selectedOrder.assignedStaffEmail || 'N/A'}
                    </Text>
                  </div>
                ) : (
                  <Tag color="orange">⚠️ Chưa được gán nhân viên</Tag>
                )}
              </Descriptions.Item>
              {selectedOrder.orderNote && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  <Text italic style={{ color: '#666' }}>
                    {selectedOrder.orderNote}
                  </Text>
                </Descriptions.Item>
              )}
               <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                {selectedOrder.shippingAddress || selectedOrder.shippingCity ? (
                  <Text style={{ lineHeight: '1.5' }}>
                    <span>
                      {selectedOrder.shippingAddress}
                    </span>
                    {selectedOrder.shippingCity && (
                      <span>, {selectedOrder.shippingCity}</span>
                    )}
                    <br />
                    <span style={{ marginTop: '4px', display: 'inline-block', fontSize: '12px', color: '#888' }}>
                       Địa chỉ  phụ: {selectedOrder.shippingAddress2 ? ` ${selectedOrder.shippingAddress2}` : 'Không có'}
                    </span>
                  </Text>
                ) : (
                  <Text type="secondary">Chưa có địa chỉ giao hàng</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Thông tin vận chuyển" span={2}>
                {selectedOrder.shippingName ? (
                  <div>
                    <Text strong style={{ color: '#1890ff' }}>{selectedOrder.shippingName}</Text>
                    <br />
                    <Text>Phí ship: <Text strong style={{ color: '#52c41a' }}>{selectedOrder.shippingFee?.toLocaleString() || 0} ₫</Text></Text>
                    <br />
                    <Text type="secondary">Thời gian: {selectedOrder.deliveryTime || 'N/A'}</Text>
                    {selectedOrder.orderNote && (
                      <>
                        <br />
                        <Text italic style={{ color: '#888', fontSize: '13px' }}>
                          📝 Ghi chú: {selectedOrder.orderNote}
                        </Text>
                      </>
                    )}
                  </div>
                ) : (
              <Text type="danger">Bán tại cửa hàng</Text>
                )}
              </Descriptions.Item>

            </Descriptions>
          </Card>

          {/* Products Table */}
          <Card 
            title={
              <Text strong style={{ fontSize: '16px' }}>
                <ShoppingOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                Danh sách sản phẩm ({orderItems.length} sản phẩm)
              </Text>
            }
            size="small"
          >
            <Table
              columns={productColumns}
              dataSource={orderItems}
              rowKey={(item, idx) => item.productId ? `${item.productId}-${item.sizeValue}-${item.colorName}` : idx}
              pagination={false}
              bordered
              size="middle"
              style={{ marginTop: 16 }}
              summary={(pageData) => {
                const totalQuantity = pageData.reduce((total, item) => total + item.quantity, 0);
                const totalAmount = pageData.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
                
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <Text strong>Tổng cộng:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} align="center">
                      <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                        {totalQuantity}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="right">
                      <Text strong style={{ color: '#722ed1', fontSize: '16px' }}>
                        {totalAmount.toLocaleString()} ₫
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </Card>
        </>
      )}
    </Modal>
  );
};

export default OrderDetailsModal;