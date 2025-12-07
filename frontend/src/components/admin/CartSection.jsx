import React from 'react';
import { Card, Input, Button, Table, InputNumber, Space, Divider, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const CartSection = ({ 
  cart, 
  customer, 
  phone, 
  setPhone,
  findingCustomer,
  onFindCustomer,
  onCreateCustomer,
  onShowCustomerList,
  availableVouchers,
  appliedVoucher,
  onSelectVoucher,
  onRemoveVoucher,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
  loading 
}) => {
  // Calculate current subtotal for voucher preview
  const currentSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
  
  // Helper function to calculate voucher discount preview
  const calculateVoucherDiscount = (voucher) => {
    if (!voucher) return 0;
    
    let discount = 0;
    if (voucher.discountType === 'PERCENTAGE') {
      discount = currentSubtotal * (voucher.discountValue / 100);
      // Apply max discount limit if exists - check for both existence and > 0
      if (voucher.maxDiscount && voucher.maxDiscount > 0 && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount;
      }
    } else {
      discount = voucher.discountValue || 0;
    }
    
    return Math.min(discount, currentSubtotal);
  };
  // Inline styles
  const styles = {
    customerSection: {
      marginBottom: '16px'
    },
    customerInfo: {
      marginTop: '8px', 
      color: '#3182ce'
    },
    totalSection: {
      textAlign: 'right', 
      marginTop: '16px'
    },
    actionButtons: {
      display: 'flex', 
      gap: '8px', 
      marginTop: '16px'
    },
    clearButton: {
      flex: 1
    },
    checkoutButton: {
      flex: 2
    },
    quantityContainer: {
      width: '140px'
    },
    quantityHelp: {
      fontSize: '11px', 
      color: '#999', 
      marginTop: '2px'
    }
  };

  // Calculate subtotal (before discount)
  const subtotalAmount = cart.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
  
  // Calculate voucher discount
  const voucherDiscount = appliedVoucher ? calculateVoucherDiscount(appliedVoucher) : 0;
  
  // Calculate final total (after discount)
  const totalAmount = subtotalAmount - voucherDiscount;

  // Cart columns configuration
  const cartColumns = [
    { 
      title: 'Sản phẩm', 
      dataIndex: 'productName', 
      key: 'productName',
      width: '35%',
      render: (productName, record) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{productName}</div>
          <Space size={4}>
            <Tag color="blue">{record.colorName}</Tag>
            <Tag color="green">{record.sizeValue}</Tag>
          </Space>
        </div>
      )
    },
    { 
      title: 'Đơn giá', 
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: '15%',
      render: (v) => (
        <span style={{ fontWeight: 'bold', color: '#f5222d' }}>
          {v ? v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 ₫'}
        </span>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '25%',
      render: (q, record) => (
        <div>
          <InputNumber 
            min={1} 
            max={record.stockQuantity + record.quantity}
            value={q} 
            onChange={(val) => onUpdateQuantity(record.cartKey, val)}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: '11px', color: '#999', marginTop: 2 }}>
            Tồn kho: {record.stockQuantity}
          </div>
        </div>
      )
    },
    {
      title: 'Thành tiền',
      key: 'total',
      width: '15%',
      render: (_, record) => {
        const total = (record.unitPrice || 0) * (record.quantity || 0);
        return (
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </span>
        );
      }
    },
    {
      title: '',
      key: 'remove',
      width: '8%',
      render: (_, record) => (
        <Button 
          type="link" 
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoveFromCart(record.cartKey)}
        />
      )
    }
  ];

  return (
    <Card title="Giỏ hàng & Khách hàng" bordered={false}>
      {/* Customer Search Section */}
      <div style={styles.customerSection}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input.Search
            placeholder="Nhập số điện thoại khách hàng..."
            allowClear
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onSearch={onFindCustomer}
            loading={findingCustomer}
          />
          <Space style={{ width: '100%' }}>
            <Button 
              type="default" 
              onClick={onCreateCustomer}
              style={{ flex: 1 }}
            >
              Tạo mới
            </Button>
            <Button 
              type="primary" 
              ghost
              onClick={onShowCustomerList}
              style={{ flex: 1 }}
            >
              Chọn từ danh sách
            </Button>
          </Space>
        </Space>
        {customer && (
          <div style={styles.customerInfo}>
            Khách: {customer.fullName} ({customer.phone})
          </div>
        )}
      </div>

      {/* Voucher Section */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Mã giảm giá khả dụng</h4>
        {availableVouchers && availableVouchers.length > 0 ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              {availableVouchers.map(voucher => (
                <div 
                  key={voucher.voucherId}
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '8px',
                    cursor: 'pointer',
                    backgroundColor: appliedVoucher?.voucherId === voucher.voucherId ? '#f6ffed' : '#fff'
                  }}
                  onClick={() => onSelectVoucher(voucher)}
                >
                  <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    {voucher.voucherCode || voucher.code}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {voucher.voucherName || voucher.name} - Giảm {
                      voucher.discountType === 'PERCENTAGE' 
                        ? `${voucher.discountValue}%`
                        : `${voucher.discountValue?.toLocaleString()}₫`
                    }
                    {voucher.discountType === 'PERCENTAGE' && voucher.maxDiscount > 0 && (
                      <span style={{ color: '#ff7a00' }}>
                        {' '}(Giảm tối đa {voucher.maxDiscount?.toLocaleString()}₫)
                      </span>
                    )}
                    {voucher.minOrderValue > 0 && (
                      <span style={{ color: '#ff7a00' }}>
                        {' '}(Giá trị đơn hàng tối thiểu {voucher.minOrderValue?.toLocaleString()}₫)
                      </span>
                    )}
                  </div>
                  {currentSubtotal > 0 && (
                    <div style={{ fontSize: '11px', color: '#52c41a', fontWeight: 'bold' }}>
                      Giảm được: {calculateVoucherDiscount(voucher).toLocaleString()}₫ cho đơn này
                    </div>
                  )}
                  {voucher.usageLimit && (
                    <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                      Đã sử dụng: {voucher.usedCount || 0}/{voucher.usageLimit}
                      {voucher.usedCount >= voucher.usageLimit && (
                        <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>
                          (Hết lượt)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {appliedVoucher && (
                <Button 
                  type="link" 
                  onClick={onRemoveVoucher}
                  style={{ color: '#ff4d4f', padding: 0 }}
                >
                  Hủy voucher đã chọn
                </Button>
              )}
            </Space>
          ) : (
            <div style={{ color: '#999', fontSize: '12px' }}>
              <div>Không có voucher khả dụng</div>
              <div style={{ fontSize: '10px', marginTop: '4px' }}>
                Khách hàng: {customer ? customer.fullName : 'Khách vãng lai'} | 
                Giá trị đơn hàng: {subtotalAmount.toLocaleString()}₫
              </div>
            </div>
          )}
        </div>

      <Divider />

      {/* Cart Table */}
      <Table
        dataSource={cart}
        columns={cartColumns}
        rowKey="cartKey"
        pagination={false}
        size="small"
        locale={{ emptyText: 'Chưa có sản phẩm trong giỏ hàng' }}
      />

      {/* Total and Actions */}
      <div style={styles.totalSection}>
        <div style={{ marginBottom: '4px' }}>
          <span>Tạm tính: {subtotalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
        </div>
        {appliedVoucher && voucherDiscount > 0 && (
          <div style={{ marginBottom: '4px', color: '#52c41a' }}>
            <span>Giảm giá ({appliedVoucher.voucherCode || appliedVoucher.code}): -{voucherDiscount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
          </div>
        )}
        <div style={{ fontSize: '16px', fontWeight: 'bold', borderTop: '1px solid #d9d9d9', paddingTop: '8px', marginTop: '8px' }}>
          <span>Tổng tiền: {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
        </div>
      </div>
      
      <div style={styles.actionButtons}>
        <Button
          danger
          onClick={onClearCart}
          disabled={!cart.length}
          style={styles.clearButton}
        >
          Làm trống giỏ hàng
        </Button>
        <Button
          type="primary"
          onClick={onCheckout}
          disabled={!cart.length}
          loading={loading}
          style={styles.checkoutButton}
        >
          Thanh toán
        </Button>
      </div>
    </Card>
  );
};

export default CartSection;