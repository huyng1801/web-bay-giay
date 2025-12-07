import React from 'react';
import { Card, Row, Col, Statistic, Tag } from 'antd';
import { getVoucherStatus, getVoucherStatusColor } from '../../../utils/voucherUtils';

const VoucherStats = ({ vouchers }) => {
    const stats = vouchers.reduce((acc, voucher) => {
        const status = getVoucherStatus(voucher);
        acc[status] = (acc[status] || 0) + 1;
        acc.total += 1;
        return acc;
    }, {
        total: 0,
        NOT_STARTED: 0,
        ACTIVE: 0,
        EXPIRED: 0,
        OUT_OF_USES: 0
    });

    return (
        <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
                <Col span={4}>
                    <Statistic
                        title="Tổng voucher"
                        value={stats.total}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Col>
                <Col span={5}>
                    <Statistic
                        title={
                            <span>
                                Chưa bắt đầu{' '}
                                <Tag 
                                    size="small" 
                                    style={{ 
                                        borderColor: getVoucherStatusColor('NOT_STARTED'),
                                        color: getVoucherStatusColor('NOT_STARTED'),
                                        marginLeft: 4
                                    }}
                                >
                                    {stats.NOT_STARTED}
                                </Tag>
                            </span>
                        }
                        value={stats.NOT_STARTED}
                        valueStyle={{ color: getVoucherStatusColor('NOT_STARTED') }}
                    />
                </Col>
                <Col span={5}>
                    <Statistic
                        title={
                            <span>
                                Đang hoạt động{' '}
                                <Tag 
                                    size="small" 
                                    style={{ 
                                        borderColor: getVoucherStatusColor('ACTIVE'),
                                        color: getVoucherStatusColor('ACTIVE'),
                                        marginLeft: 4
                                    }}
                                >
                                    {stats.ACTIVE}
                                </Tag>
                            </span>
                        }
                        value={stats.ACTIVE}
                        valueStyle={{ color: getVoucherStatusColor('ACTIVE') }}
                    />
                </Col>
                <Col span={5}>
                    <Statistic
                        title={
                            <span>
                                Đã kết thúc{' '}
                                <Tag 
                                    size="small" 
                                    style={{ 
                                        borderColor: getVoucherStatusColor('EXPIRED'),
                                        color: getVoucherStatusColor('EXPIRED'),
                                        marginLeft: 4
                                    }}
                                >
                                    {stats.EXPIRED}
                                </Tag>
                            </span>
                        }
                        value={stats.EXPIRED}
                        valueStyle={{ color: getVoucherStatusColor('EXPIRED') }}
                    />
                </Col>
                <Col span={5}>
                    <Statistic
                        title={
                            <span>
                                Hết lượt sử dụng{' '}
                                <Tag 
                                    size="small" 
                                    style={{ 
                                        borderColor: getVoucherStatusColor('OUT_OF_USES'),
                                        color: getVoucherStatusColor('OUT_OF_USES'),
                                        marginLeft: 4
                                    }}
                                >
                                    {stats.OUT_OF_USES}
                                </Tag>
                            </span>
                        }
                        value={stats.OUT_OF_USES}
                        valueStyle={{ color: getVoucherStatusColor('OUT_OF_USES') }}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default VoucherStats;