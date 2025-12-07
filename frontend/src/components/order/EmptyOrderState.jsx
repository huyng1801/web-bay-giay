import React from 'react';
import { Button, Typography } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const EmptyOrderState = ({ onStartShopping }) => {
    const styles = {
        emptyState: {
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
        },
        emptyIcon: {
            fontSize: '64px',
            color: '#d9d9d9',
            marginBottom: '16px',
        },
        emptyTitle: {
            color: '#001529',
            marginBottom: '8px',
        },
        emptyText: {
            fontSize: '16px',
            color: '#666',
            marginBottom: '16px',
        },
        shopButton: {
            marginTop: '16px',
            background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)',
            border: 'none',
            borderRadius: '8px',
            height: '40px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0, 21, 41, 0.3)',
            transition: 'all 0.3s ease',
        },
    };

    return (
        <div style={styles.emptyState}>
            <ShoppingOutlined style={styles.emptyIcon} />
            <Title level={4} style={styles.emptyTitle}>
                Chưa có đơn hàng nào
            </Title>
            <Text style={styles.emptyText}>
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </Text>
            <br />
            <Button 
                type="primary" 
                style={styles.shopButton}
                onClick={onStartShopping}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(0, 21, 41, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 21, 41, 0.3)';
                }}
            >
                Bắt đầu mua sắm
            </Button>
        </div>
    );
};

export default EmptyOrderState;