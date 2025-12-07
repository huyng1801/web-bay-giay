import React, { useState, useEffect } from 'react';
import { Input, Tag, message } from 'antd';
import { GiftOutlined, CheckCircleOutlined, CloseCircleOutlined, PercentageOutlined, DollarOutlined } from '@ant-design/icons';
import { getAvailableVouchersForCustomer, applyVoucher } from '../../services/home/HomeService';
import { formatPrice } from '../../utils/formatters';

const flatsomeStyles = {
    container: {
        marginBottom: '24px',
    },
    card: {
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        border: '1.5px solid #eaeaea',
        padding: '32px 28px',
        maxWidth: '600px',
        margin: '0 auto',
    },
    sectionTitle: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#222',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: '2px solid #ff6b35',
        paddingBottom: '8px',
    },
    inputRow: {
        marginBottom: '20px',
        display: 'flex',
        gap: '12px',
    },
    input: {
        height: '44px',
        borderRadius: '8px',
        border: '1.5px solid #eaeaea',
        fontSize: '15px',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        flex: 1,
    },
    applyButton: {
        height: '36px', // smaller height
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '14px', // smaller font
        background: 'linear-gradient(90deg, #ff6b35 0%, #ff8a50 100%)',
        color: '#fff',
        border: 'none',
        padding: '0 16px', // less horizontal padding
        minWidth: '80px', // set a min width for compact look
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.10)',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    },
    voucherList: {
        marginTop: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    voucherCard: {
        borderRadius: '12px',
        border: '1.5px solid #eaeaea',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    voucherCardHover: {
        borderColor: '#ff6b35',
        boxShadow: '0 8px 32px rgba(255,107,53,0.08)',
        transform: 'translateY(-2px)',
    },
    selectedVoucherCard: {
        border: '2px solid #ff6b35',
        background: '#fff9f6',
    },
    voucherHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
    },
    voucherCode: {
        fontWeight: 'bold',
        color: '#ff6b35',
        fontSize: '17px',
        letterSpacing: '1px',
    },
    discountBadge: {
        borderRadius: '999px',
        padding: '4px 16px',
        fontWeight: 'bold',
        fontSize: '14px',
        background: '#fff3e6',
        color: '#ff6b35',
        border: '1.5px solid #ff6b35',
    },
    voucherDescription: {
        color: '#666',
        fontSize: '15px',
        marginBottom: '2px',
    },
    voucherCondition: {
        color: '#999',
        fontSize: '13px',
        fontStyle: 'italic',
    },
    discountSummary: {
        background: '#fff9f6',
        border: '1.5px solid #ffdbcc',
        borderRadius: '10px',
        padding: '16px',
        marginTop: '16px',
        marginBottom: '8px',
    },
    removeButton: {
        background: 'none',
        color: '#ff4d4f',
        border: 'none',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        marginLeft: '12px',
    },
    noVoucher: {
        color: '#bbb',
        textAlign: 'center',
        marginTop: '18px',
        fontSize: '15px',
    },
};

const VoucherSelector = ({ customerId, orderValue, onVoucherApplied, appliedVoucher }) => {
    const [availableVouchers, setAvailableVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    const [selectedVoucher, setSelectedVoucher] = useState(appliedVoucher);

    useEffect(() => {
        if (customerId && orderValue) {
            fetchAvailableVouchers();
        }
    }, [customerId, orderValue]);

    const fetchAvailableVouchers = async () => {
        try {
            const vouchers = await getAvailableVouchersForCustomer(customerId, orderValue);
            setAvailableVouchers(vouchers);
        } catch (error) {
            console.error('Error fetching available vouchers:', error);
        }
    };

    const handleApplyVoucherCode = async () => {
        if (!voucherCode.trim()) {
            message.warning('Vui lòng nhập mã voucher');
            return;
        }

        setLoading(true);
        try {
            const result = await applyVoucher(voucherCode, customerId, orderValue);
            if (result.valid) {
                setSelectedVoucher(result.voucher);
                onVoucherApplied(result.voucher, result.discountAmount);
                message.success('Áp dụng voucher thành công!');
                setVoucherCode('');
            } else {
                message.error(result.message || 'Voucher không hợp lệ');
            }
        } catch (error) {
            message.error('Không thể áp dụng voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectVoucher = async (voucher) => {
        setLoading(true);
        try {
            const result = await applyVoucher(voucher.code, customerId, orderValue);
            if (result.valid) {
                setSelectedVoucher(voucher);
                onVoucherApplied(voucher, result.discountAmount);
                message.success('Áp dụng voucher thành công!');
            } else {
                message.error(result.message || 'Voucher không hợp lệ');
            }
        } catch (error) {
            message.error('Không thể áp dụng voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveVoucher = () => {
        setSelectedVoucher(null);
        onVoucherApplied(null, 0);
        message.info('Đã bỏ voucher');
    };

    const getDiscountText = (voucher) => {
        if (voucher.discountType === 'PERCENTAGE') {
            return (
                <span style={flatsomeStyles.discountBadge}>
                    <PercentageOutlined /> -{voucher.discountValue}%
                    {voucher.maxDiscount && ` (Tối đa ${formatPrice(voucher.maxDiscount)})`}
                </span>
            );
        } else if (voucher.discountType === 'FIXED') {
            return (
                <span style={flatsomeStyles.discountBadge}>
                    <DollarOutlined /> -{formatPrice(voucher.discountValue)}
                </span>
            );
        }
    };

    const getConditionText = (voucher) => {
        switch (voucher.conditionType) {
            case 'FIRST_ORDER':
                return 'Dành cho khách hàng mới';
            case 'TOTAL_PURCHASED':
                return `Dành cho khách đã mua >= ${formatPrice(voucher.conditionValue)}`;
            case 'ORDER_VALUE':
                return `Áp dụng cho đơn >= ${formatPrice(voucher.conditionValue)}`;
            case 'SPECIFIC_DATE':
                return `Chỉ áp dụng trong ngày cụ thể`;
            case 'ALL_CUSTOMERS':
            default:
                return 'Áp dụng cho tất cả khách hàng';
        }
    };

    const calculateDiscount = (voucher, orderValue) => {
        if (!voucher || !orderValue) return 0;
        
        let discount = 0;
        
        if (voucher.discountType === 'PERCENTAGE') {
            // Tính giảm giá theo phần trăm
            discount = (orderValue * voucher.discountValue) / 100;
            
            // Áp dụng giới hạn giảm giá tối đa nếu có
            if (voucher.maxDiscount && discount > voucher.maxDiscount) {
                discount = voucher.maxDiscount;
            }
        } else if (voucher.discountType === 'FIXED') {
            // Giảm giá cố định
            discount = voucher.discountValue;
            
            // Giảm giá không được vượt quá giá trị đơn hàng
            if (discount > orderValue) {
                discount = orderValue;
            }
        }
        
        return Math.max(0, discount); // Đảm bảo không âm
    };

    return (
        <div style={flatsomeStyles.container}>
            <div style={flatsomeStyles.card}>
                <div style={flatsomeStyles.sectionTitle}>
                    <GiftOutlined />
                    Voucher giảm giá
                </div>
                <div style={flatsomeStyles.inputRow}>
                    <Input
                        placeholder="Nhập mã voucher"
                        value={voucherCode}
                        style={flatsomeStyles.input}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        onPressEnter={handleApplyVoucherCode}
                        onFocus={e => {
                            e.target.style.borderColor = '#ff6b35';
                            e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onBlur={e => {
                            e.target.style.borderColor = '#eaeaea';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    <button
                        type="button"
                        style={flatsomeStyles.applyButton}
                        disabled={loading}
                        onClick={handleApplyVoucherCode}
                        onMouseEnter={e => {
                            e.target.style.opacity = 0.95;
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.18)';
                        }}
                        onMouseLeave={e => {
                            e.target.style.opacity = 1;
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.10)';
                        }}
                    >
                        {loading ? 'Đang áp dụng...' : 'Áp dụng'}
                    </button>
                </div>

                {selectedVoucher && (
                    <div style={flatsomeStyles.discountSummary}>
                        <div style={flatsomeStyles.voucherHeader}>
                            <span style={{ color: '#52c41a', fontWeight: 700 }}>
                                <CheckCircleOutlined style={{ marginRight: 8 }} />
                                Đã áp dụng: {selectedVoucher.code}
                            </span>
                            <button
                                type="button"
                                style={flatsomeStyles.removeButton}
                                onClick={handleRemoveVoucher}
                            >
                                <CloseCircleOutlined style={{ marginRight: 4 }} /> Bỏ voucher
                            </button>
                        </div>
                        <div style={flatsomeStyles.voucherDescription}>
                            {selectedVoucher.description}
                        </div>
                        <span style={{ color: '#ff6b35', fontWeight: 700 }}>
                            Tiết kiệm: {formatPrice(calculateDiscount(selectedVoucher, orderValue))}
                        </span>
                    </div>
                )}

                {availableVouchers.length > 0 && !selectedVoucher && (
                    <div style={flatsomeStyles.voucherList}>
                        {availableVouchers.map((voucher) => (
                            <div
                                key={voucher.voucherId}
                                style={{
                                    ...flatsomeStyles.voucherCard,
                                    ...(selectedVoucher && selectedVoucher.voucherId === voucher.voucherId ? flatsomeStyles.selectedVoucherCard : {}),
                                }}
                                onClick={() => handleSelectVoucher(voucher)}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#ff6b35';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,107,53,0.08)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#eaeaea';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={flatsomeStyles.voucherHeader}>
                                    <span style={flatsomeStyles.voucherCode}>{voucher.code}</span>
                                    {getDiscountText(voucher)}
                                </div>
                                <div style={flatsomeStyles.voucherDescription}>
                                    {voucher.description}
                                </div>
                                <div style={flatsomeStyles.voucherCondition}>
                                    {getConditionText(voucher)}
                                    {voucher.minOrderValue && voucher.minOrderValue > 0 && (
                                        <span> • Đơn tối thiểu: {formatPrice(voucher.minOrderValue)}</span>
                                    )}
                                </div>
                                <div style={{ marginTop: '4px' }}>
                                    <span style={{ color: '#ff6b35', fontWeight: 700, fontSize: 13 }}>
                                        Tiết kiệm: {formatPrice(calculateDiscount(voucher, orderValue))}
                                    </span>
                                    {voucher.discountType === 'PERCENTAGE' && voucher.maxDiscount && (
                                        <span style={{ color: '#bbb', fontSize: 11, marginLeft: 8 }}>
                                            (Giảm tối đa: {formatPrice(voucher.maxDiscount)})
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {availableVouchers.length === 0 && !selectedVoucher && (
                    <div style={flatsomeStyles.noVoucher}>
                        Không có voucher khả dụng cho đơn hàng này
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoucherSelector;
