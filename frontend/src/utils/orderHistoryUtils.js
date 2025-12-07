import React from 'react';
import { Tag } from 'antd';
import { 
    ClockCircleOutlined, 
    CreditCardOutlined, 
    TruckOutlined, 
    CheckCircleOutlined 
} from '@ant-design/icons';

export const getStatusTag = (orderStatus, isPaid) => {
    const styles = {
        statusTag: {
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        },
        statusIcon: {
            fontSize: '16px',
            marginRight: '4px',
        }
    };

    const getStatusInfo = (status, paid) => {
        if (status === 'PENDING_PAYMENT') {
            return { 
                text: 'Chờ thanh toán', 
                color: 'orange', 
                icon: <ClockCircleOutlined style={styles.statusIcon} />
            };
        } else if (status === 'PAYMENT_CONFIRMED') {
            return { 
                text: 'Đã thanh toán', 
                color: 'blue', 
                icon: <CreditCardOutlined style={styles.statusIcon} />
            };
        } else if (status === 'PROCESSING') {
            return { 
                text: 'Đang xử lý', 
                color: 'purple', 
                icon: <ClockCircleOutlined style={styles.statusIcon} />
            };
        } else if (status === 'SHIPPED') {
            return { 
                text: 'Đã giao cho vận chuyển', 
                color: 'geekblue', 
                icon: <TruckOutlined style={styles.statusIcon} />
            };
        } else if (status === 'OUT_FOR_DELIVERY') {
            return { 
                text: 'Đang giao hàng', 
                color: 'cyan', 
                icon: <TruckOutlined style={styles.statusIcon} />
            };
        } else if (status === 'DELIVERED') {
            return { 
                text: 'Đã giao hàng', 
                color: 'success', 
                icon: <CheckCircleOutlined style={styles.statusIcon} />
            };
        } else if (status === 'COMPLETED') {
            return { 
                text: 'Hoàn thành', 
                color: 'green', 
                icon: <CheckCircleOutlined style={styles.statusIcon} />
            };
        } else if (status === 'CANCELED') {
            return { 
                text: 'Đã hủy', 
                color: 'error', 
                icon: <ClockCircleOutlined style={styles.statusIcon} />
            };
        } else if (status === 'RETURNED' || status === 'RETURN_REQUESTED') {
            return { 
                text: status === 'RETURN_REQUESTED' ? 'Yêu cầu trả hàng' : 'Đã trả hàng', 
                color: 'volcano', 
                icon: <TruckOutlined style={styles.statusIcon} />
            };
        } else if (status === 'REFUNDED') {
            return { 
                text: 'Đã hoàn tiền', 
                color: 'lime', 
                icon: <CreditCardOutlined style={styles.statusIcon} />
            };
        } else if (status === 'FAILED') {
            return { 
                text: 'Thất bại', 
                color: 'error', 
                icon: <ClockCircleOutlined style={styles.statusIcon} />
            };
        }
        
        // Fallback
        if (paid) {
            return { 
                text: 'Đã thanh toán', 
                color: 'success', 
                icon: <CheckCircleOutlined style={styles.statusIcon} />
            };
        } else {
            return { 
                text: 'Chưa thanh toán', 
                color: 'warning', 
                icon: <ClockCircleOutlined style={styles.statusIcon} />
            };
        }
    };

    const statusInfo = getStatusInfo(orderStatus, isPaid);
    return (
        <Tag color={statusInfo.color} style={styles.statusTag}>
            {statusInfo.icon}
            {statusInfo.text}
        </Tag>
    );
};

export const getOrderProgress = (orderStatus, isPaid, statusHistory = []) => {
    const steps = [
        { title: 'Đặt hàng', status: 'finish' },
        { title: 'Chờ xác nhận', status: 'wait' },
        { title: 'Đã xác nhận', status: 'wait' },
        { title: 'Chờ vận chuyển', status: 'wait' },
        { title: 'Đang vận chuyển', status: 'wait' },
        { title: 'Đã giao hàng', status: 'wait' },
        { title: 'Hoàn thành', status: 'wait' }
    ];

    // Note: Removed time information display as descriptions are no longer used

    // Set step statuses based on current order status
    let currentStep = 0;
    
    if (orderStatus === 'PENDING_PAYMENT') {
        currentStep = 0;
        steps[0].status = 'process';
    } else if (orderStatus === 'PAYMENT_CONFIRMED') {
        currentStep = 1;
        steps[0].status = 'finish';
        steps[1].status = 'process';
    } else if (orderStatus === 'PROCESSING') {
        currentStep = 2;
        steps[0].status = 'finish';
        steps[1].status = 'finish';
        steps[2].status = 'process';
    } else if (orderStatus === 'SHIPPED') {
        currentStep = 3;
        steps[0].status = 'finish';
        steps[1].status = 'finish';
        steps[2].status = 'finish';
        steps[3].status = 'process';
    } else if (orderStatus === 'OUT_FOR_DELIVERY') {
        currentStep = 4;
        steps[0].status = 'finish';
        steps[1].status = 'finish';
        steps[2].status = 'finish';
        steps[3].status = 'finish';
        steps[4].status = 'process';
    } else if (orderStatus === 'DELIVERED') {
        currentStep = 5;
        steps[0].status = 'finish';
        steps[1].status = 'finish';
        steps[2].status = 'finish';
        steps[3].status = 'finish';
        steps[4].status = 'finish';
        steps[5].status = 'process';
    } else if (orderStatus === 'COMPLETED') {
        currentStep = 6;
        steps[0].status = 'finish';
        steps[1].status = 'finish';
        steps[2].status = 'finish';
        steps[3].status = 'finish';
        steps[4].status = 'finish';
        steps[5].status = 'finish';
        steps[6].status = 'finish';
    } else if (orderStatus === 'CANCELED' || orderStatus === 'FAILED') {
        steps[currentStep].status = 'error';
    }

    return { currentStep, steps };
};

export const canCancelOrder = (orderStatus) => {
    // Customers can only cancel before "Đã xác nhận" step (PROCESSING)
    return orderStatus === 'PENDING_PAYMENT' || orderStatus === 'PAYMENT_CONFIRMED';
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};