import React from 'react';
import { Image, Button, Tag } from 'antd';
import { StarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { formatPrice } from '../../utils/formatters';

const OrderItem = ({ item, orderId, orderStatus, onFeedback, customerFeedbacks = {} }) => {
    // Get productId from item
    const productId = item.productId || item.product_id || item.id;
    
    // Create key for checking feedback: orderId_productId
    const feedbackKey = `${orderId}_${productId}`;
    
    // Check if this product has been reviewed by customer for this specific order
    const hasReviewed = customerFeedbacks[feedbackKey] !== undefined && customerFeedbacks[feedbackKey] !== null;
    
    // Only show feedback button if order is DELIVERED/COMPLETED and product hasn't been reviewed
    // Check for multiple possible completion statuses
    const isOrderCompleted = ['DELIVERED', 'COMPLETED', 'FINISHED', 'DONE'].includes(orderStatus);
    const showFeedbackButton = isOrderCompleted && !hasReviewed;
    
    console.log(`OrderItem [${orderId}_${productId}]:`, {
        orderStatus,
        isOrderCompleted,
        feedbackKey,
        hasReviewed,
        showFeedbackButton,
        customerFeedbacksKeys: Object.keys(customerFeedbacks),
        allCustomerFeedbacks: customerFeedbacks
    });
    const styles = {
        itemRow: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f8f9fa',
        },
        itemImage: {
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            marginRight: '16px',
        },
        itemInfo: {
            flex: 1,
        },
        itemName: {
            fontWeight: 'bold',
            marginBottom: '4px',
            color: '#001529',
        },
        itemDetails: {
            color: '#666',
            fontSize: '14px',
            marginBottom: '2px',
        },
        itemPrice: {
            fontWeight: 'bold',
            color: '#f50',
        },
        feedbackButton: {
            marginTop: '8px',
            backgroundColor: '#faad14',
            borderColor: '#faad14',
            borderRadius: '6px',
            fontSize: '12px',
            height: '28px',
        }
    };

    return (
        <div style={styles.itemRow}>
            <Image
                src={item.imageUrl}
                alt={item.productName}
                style={styles.itemImage}
                preview={false}
            />
            <div style={styles.itemInfo}>
                <div style={styles.itemName}>
                    {item.productName}
                </div>
                <div style={styles.itemDetails}>
                    Màu sắc: {item.colorName} | Kích cỡ: {item.sizeValue}
                </div>
                <div style={styles.itemDetails}>
                    Số lượng: {item.quantity}
                </div>
                <div style={styles.itemPrice}>
                    {formatPrice(item.unitPrice)}
                </div>
                {showFeedbackButton && (
                    <Button
                        type="primary"
                        size="small"
                        icon={<StarOutlined />}
                        onClick={() => onFeedback(item, orderId)}
                        style={styles.feedbackButton}
                    >
                        Đánh giá
                    </Button>
                )}
                {hasReviewed && (
                    <Tag color="success" icon={<CheckCircleOutlined />} style={{ marginTop: '8px' }}>
                        Đã đánh giá
                    </Tag>
                )}
            </div>
        </div>
    );
};

export default OrderItem;