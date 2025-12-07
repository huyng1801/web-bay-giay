import React, { useState } from 'react';
import {
    Table,
    Button,
    Space, 
    Tag,
    Tooltip
} from 'antd';
import {
    EditOutlined,
    EyeOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    StopOutlined
} from '@ant-design/icons';
import { formatPrice } from '../../../utils/formatters';
import { getVoucherStatus, getVoucherStatusText, getVoucherStatusColor } from '../../../utils/voucherUtils';
import dayjs from 'dayjs';
import VoucherUsageModal from './VoucherUsageModal';

const VoucherTable = ({ 
    vouchers, 
    loading, 
    onEditVoucher,
    getConditionTypeText,
    getDiscountText 
}) => {
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [usageModalVisible, setUsageModalVisible] = useState(false);

    const handleViewUsage = (voucherId) => {
        setSelectedVoucherId(voucherId);
        setUsageModalVisible(true);
    };


    const columns = [
        {
            title: 'Mã voucher',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Tên voucher',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Loại giảm giá',
            key: 'discount',
            render: (_, record) => {
                if (record.discountType === 'PERCENTAGE' || record.discountType === 'percentage') {
                    return `${record.discountValue}% (tối đa ${formatPrice(record.maxDiscount || 0)})`;
                } else {
                    return formatPrice(record.discountValue);
                }
            },
        },
        {
            title: 'Điều kiện áp dụng',
            key: 'condition',
            render: (_, record) => {
                const conditionText = record.conditionType === 'ALL_CUSTOMERS' || record.conditionType === 'all_customers' 
                    ? 'Tất cả khách hàng' 
                    : 'Khách hàng mới';
                const minOrder = record.minOrderValue ? ` (Tối thiểu ${formatPrice(record.minOrderValue)})` : '';
                return conditionText + minOrder;
            },
        },
        {
            title: 'Thời gian',
            key: 'dateRange',
            render: (_, record) => {
                const status = getVoucherStatus(record);
                const startDate = dayjs(record.startDate);
                const endDate = dayjs(record.endDate);
                const color = getVoucherStatusColor(status);
                
                return (
                    <div>
                        <div style={{ color, fontWeight: 'bold' }}>
                            {startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {status === 'NOT_STARTED' && `Còn ${startDate.diff(dayjs(), 'day')} ngày`}
                            {status === 'ACTIVE' && `Còn ${endDate.diff(dayjs(), 'day')} ngày`}
                            {status === 'EXPIRED' && `Đã kết thúc ${dayjs().diff(endDate, 'day')} ngày`}
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Sử dụng',
            key: 'usage',
            render: (_, record) => {
                if (!record.usageLimit) {
                    return (
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{record.usedCount}/∞</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Không giới hạn</div>
                        </div>
                    );
                }
                
                const usagePercent = (record.usedCount / record.usageLimit) * 100;
                const remaining = record.usageLimit - record.usedCount;
                let color = '#52c41a';
                
                if (usagePercent >= 100) color = '#ff4d4f';
                else if (usagePercent >= 90) color = '#ff7875';
                else if (usagePercent >= 70) color = '#faad14';
                
                return (
                    <div>
                        <div style={{ color, fontWeight: 'bold' }}>
                            {record.usedCount}/{record.usageLimit}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {remaining > 0 ? `Còn ${remaining} lượt` : 'Đã hết lượt'}
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => {
                const status = getVoucherStatus(record);
                const statusText = getVoucherStatusText(status);
                const color = getVoucherStatusColor(status);
                
                let icon = null;
                let tooltipText = '';
                
                switch (status) {
                    case 'NOT_STARTED':
                        icon = <ClockCircleOutlined />;
                        tooltipText = `Voucher sẽ bắt đầu vào ${dayjs(record.startDate).format('DD/MM/YYYY')}`;
                        break;
                    case 'ACTIVE':
                        icon = null;
                        tooltipText = `Voucher có hiệu lực đến ${dayjs(record.endDate).format('DD/MM/YYYY')}`;
                        break;
                    case 'EXPIRED':
                        icon = <StopOutlined />;
                        tooltipText = `Voucher đã hết hạn từ ${dayjs(record.endDate).format('DD/MM/YYYY')}`;
                        break;
                    case 'OUT_OF_USES':
                        icon = <ExclamationCircleOutlined />;
                        tooltipText = `Voucher đã sử dụng hết ${record.usageLimit} lượt`;
                        break;
                    default:
                        break;
                }
                
                return (
                    <Tooltip title={tooltipText}>
                        <Tag style={{borderColor: color, color: color}}>
                            {icon && <span style={{ marginRight: 4 }}>{icon}</span>}
                            {statusText}
                        </Tag>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => {
                const status = getVoucherStatus(record);
                const isExpired = status === 'EXPIRED';
                
                return (
                    <Space>
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewUsage(record.voucherId)}
                            title="Xem lịch sử sử dụng"
                        />
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => onEditVoucher(record)}
                            disabled={isExpired}
                            title={isExpired ? "Không thể sửa voucher đã hết hạn" : "Chỉnh sửa voucher"}
                        />
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={vouchers}
                rowKey="voucherId"
                loading={loading}
                pagination={{
                    pageSize: 10,

                }}
            />
            
            <VoucherUsageModal
                visible={usageModalVisible}
                voucherId={selectedVoucherId}
                onCancel={() => {
                    setUsageModalVisible(false);
                    setSelectedVoucherId(null);
                }}
            />
        </>
    );
};

export default VoucherTable;