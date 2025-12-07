import React from 'react';
import { Button, Tag, Popconfirm, Typography } from 'antd';
import { 
    HistoryOutlined, 
    CloseOutlined,
    TruckOutlined
} from '@ant-design/icons';
import OrderProgress from './OrderProgress';
import OrderItem from './OrderItem';
import { formatPrice } from '../../utils/formatters';
import { getStatusTag, canCancelOrder } from '../../utils/orderHistoryUtils';

const { Text } = Typography;

const OrderCard = ({ 
    order, 
    orderStatusHistory,
    onViewStatusHistory, 
    onCancelOrder,
    onFeedback,
    formatDate,
    loading 
}) => {
    const styles = {
        // Premium card wrapper
        card: {
            background: '#fff',
            borderRadius: '14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid #eaeaea',
            padding: '24px',
            marginBottom: '24px',
            transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        },

        cardHover: {
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            transform: 'translateY(-2px)',
        },

        orderHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1.5px solid #eaeaea',
        },

        orderInfo: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        },

        orderId: {
            fontSize: '18px',
            fontWeight: '800',
            color: '#222',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },

        orderDate: {
            color: '#999',
            fontSize: '13px',
            fontStyle: 'italic',
        },

        orderActions: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        },

        orderItems: {
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1.5px solid #eaeaea',
        },

        itemDetails: {
            color: '#666',
            fontSize: '14px',
            marginBottom: '8px',
            lineHeight: '1.6',
        },

        orderTotal: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            padding: '20px 0',
            borderTop: '1.5px solid #eaeaea',
        },

        totalLabel: {
            fontSize: '16px',
            fontWeight: '700',
            color: '#222',
        },

        totalAmount: {
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(90deg, #ff6b35 0%, #ff8a50 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
        },

        voucherInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            padding: '16px',
            background: '#fff9f6',
            borderRadius: '10px',
            border: '1.5px solid #ffdbcc',
        },

        voucherDiscount: {
            color: '#ff6b35',
            fontWeight: '800',
            fontSize: '15px',
        },

        originalPrice: {
            textDecoration: 'line-through',
            color: '#999',
            fontSize: '13px',
            marginBottom: '4px',
        },

        button: {
            height: '40px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            border: '1.5px solid #eaeaea',
            transition: 'all 0.3s ease',
        },

        buttonPrimary: {
            background: 'linear-gradient(90deg, #ff6b35 0%, #ff8a50 100%)',
            color: '#fff',
            border: 'none',
        },

        buttonDanger: {
            borderColor: '#ff4d4f',
            color: '#ff4d4f',
        },

        shippingInfo: {
            padding: '16px',
            backgroundColor: '#f0f7ff',
            borderRadius: '10px',
            marginBottom: '16px',
            border: '1.5px solid #bae6fd',
        },

        shippingTitle: {
            color: '#1890ff',
            fontWeight: '700',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },

        shippingDetail: {
            color: '#666',
            fontSize: '14px',
            marginBottom: '8px',
            lineHeight: '1.6',
        }
    };

    return (
        <div style={styles.card}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={styles.orderHeader}>
                <div style={styles.orderInfo}>
                    <Text style={styles.orderId}>
                        Đơn hàng #{order.orderId}
                    </Text>
                    <Text style={styles.orderDate}>
                        Đặt hàng: {formatDate(order.orderDate)}
                    </Text>
                </div>
                <div style={styles.orderActions}>
                    <Button 
                        size="small" 
                        icon={<HistoryOutlined />}
                        onClick={() => onViewStatusHistory(order.orderId)}
                        style={styles.button}
                    >
                        Lịch sử
                    </Button>
                    {canCancelOrder(order.orderStatus) && (
                        <Popconfirm
                            title="Hủy đơn hàng"
                            description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                            onConfirm={() => onCancelOrder(order.orderId)}
                            okText="Có, hủy đơn"
                            cancelText="Không"
                            okType="danger"
                            disabled={loading}
                        >
                            <Button 
                                size="small" 
                                loading={loading}
                                disabled={loading}
                                icon={!loading && <CloseOutlined />}
                                style={{...styles.button, ...styles.buttonDanger}}
                            >
                                {loading ? 'Đang hủy...' : 'Hủy đơn'}
                            </Button>
                        </Popconfirm>
                    )}
                    {getStatusTag(order.orderStatus, order.isPaid)}
                </div>
            </div>

            <OrderProgress 
                order={order}
                statusHistory={orderStatusHistory}
            />

            <div style={styles.orderItems}>
                {order.orderItems && order.orderItems.map((item, index) => (
                    <OrderItem
                        key={index}
                        item={item}
                        orderId={order.orderId}
                        orderStatus={order.orderStatus}
                        onFeedback={onFeedback}
                    />
                ))}
            </div>

            {order.orderNote && (
                <div style={styles.itemDetails}>
                    <strong>📝 Ghi chú:</strong> {order.orderNote}
                </div>
            )}

            {/* Shipping Information */}
            {order.shipping && (
                <div style={styles.shippingInfo}>
                    <div style={styles.shippingTitle}>
                        <TruckOutlined />
                        Thông tin vận chuyển
                    </div>
                    <div style={styles.shippingDetail}>
                        <strong>Đơn vị:</strong> {order.shipping.shippingName}
                    </div>
                    <div style={styles.shippingDetail}>
                        <strong>Mã vận chuyển:</strong> {order.shipping.shippingCode}
                    </div>
                    <div style={styles.shippingDetail}>
                        <strong>Phí ship:</strong> <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>
                            {formatPrice(order.shipping.shippingFee)}
                        </span>
                    </div>
                    <div style={styles.shippingDetail}>
                        <strong>Thời gian giao hàng:</strong> {order.shipping.deliveryTime}
                    </div>
                </div>
            )}

            {/* Voucher Information */}
            {order.voucherCode && order.voucherDiscount && (
                <div style={styles.voucherInfo}>
                    <div>
                        <Tag color="orange" style={{ marginBottom: '4px' }}>
                            🎟️ {order.voucherCode}
                        </Tag>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            Mã giảm giá đã áp dụng
                        </div>
                    </div>
                    <div style={styles.voucherDiscount}>
                        -{formatPrice(order.voucherDiscount)}
                    </div>
                </div>
            )}

            <div style={styles.orderTotal}>
                <div>
                    {order.originalPrice && order.voucherDiscount && (
                        <div style={styles.originalPrice}>
                            Giá gốc: {formatPrice(order.originalPrice)}
                        </div>
                    )}
                    <Text style={styles.totalLabel}>Tổng cộng:</Text>
                </div>
                <Text style={styles.totalAmount}>
                    {formatPrice(order.totalPrice)}
                </Text>
            </div>
        </div>
    );
};

export default OrderCard;