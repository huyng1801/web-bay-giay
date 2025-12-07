import React from 'react';
import { Steps, Progress, Typography } from 'antd';
import { getOrderProgress } from '../../utils/orderHistoryUtils';

const { Text, Title } = Typography;

const OrderProgress = ({ order, statusHistory = [] }) => {
    const styles = {
        orderStatusSection: {
            marginBottom: '16px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
        },
        statusTitle: {
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#333'
        },
        statusProgress: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '12px'
        },
        statusSteps: {
            marginBottom: '12px',
        },
    };

    const { currentStep, steps } = getOrderProgress(order.orderStatus, order.isPaid, statusHistory);

    return (
        <div style={styles.orderStatusSection}>
            <Title level={5} style={styles.statusTitle}>Tiến trình đơn hàng</Title>
            <Steps 
                current={currentStep}
                size="small"
                style={styles.statusSteps}
                items={steps}
            />
            
            {/* Progress Bar */}
            <div style={styles.statusProgress}>
                <Text type="secondary">Tiến độ: </Text>
                <Progress 
                    percent={Math.round((currentStep + 1) / 7 * 100)}
                    size="small"
                    status={order.orderStatus === 'CANCELED' || order.orderStatus === 'FAILED' ? 'exception' : 'active'}
                    style={{ flex: 1, marginLeft: 8 }}
                />
            </div>
        </div>
    );
};

export default OrderProgress;