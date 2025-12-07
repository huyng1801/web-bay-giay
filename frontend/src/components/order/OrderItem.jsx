import React from 'react';
import { Image, Button } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { formatPrice } from '../../utils/formatters';

const OrderItem = ({ item, orderId, orderStatus, onFeedback }) => {
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
                {orderStatus === 'DELIVERED' && (
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
            </div>
        </div>
    );
};

export default OrderItem;