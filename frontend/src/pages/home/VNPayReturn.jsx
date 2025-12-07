import React, { useEffect, useState } from 'react';
import { Result, Button, Spin, Steps, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyVNPayPayment } from '../../services/home/HomeService';
import CustomerLayout from '../../layouts/CustomerLayout';
import { 
    ShoppingOutlined, 
    UserOutlined, 
    CheckCircleOutlined,
    CreditCardOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '48px 0',
    },
    steps: {
        marginBottom: '48px',
        background: '#fff',
        padding: '24px',
        borderRadius: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #eaeaea',
    },
    vnpayInfo: {
        backgroundColor: '#fff9f6',
        padding: '24px',
        borderRadius: '14px',
        marginBottom: '32px',
        border: '1.5px solid #eaeaea',
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.08)',
    },
    vnpayTitle: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#ff6b35',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textTransform: 'uppercase',
    },
    result: {
        padding: '32px 0',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        border: '1.5px solid #eaeaea',
        margin: '0 auto',
        maxWidth: '600px',
    },
    orderNumber: {
        fontSize: '18px',
        color: '#222',
        marginTop: '12px',
        fontWeight: '600',
        letterSpacing: '0.5px',
    },
    button: {
        height: '48px',
        fontSize: '16px',
        fontWeight: '700',
        borderRadius: '999px',
        background: 'linear-gradient(90deg, #ff6b35 0%, #ff8a50 100%)',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(255, 107, 53, 0.15)',
        border: 'none',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        marginBottom: '8px',
        padding: '0 40px',
    },
    buttonSecondary: {
        height: '48px',
        fontSize: '16px',
        fontWeight: '700',
        borderRadius: '999px',
        background: '#fff',
        color: '#ff6b35',
        border: '1.5px solid #ff6b35',
        marginLeft: '12px',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.08)',
        padding: '0 40px',
    },
    buttonHover: {
        opacity: 0.95,
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.25)',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: '16px',
    },
};

const VNPayReturn = () => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const processPayment = async () => {
            try {
                // Get URL parameters
                const params = new URLSearchParams(location.search);
                const response = await verifyVNPayPayment(Object.fromEntries(params));
                
                if (response.includes('Thanh toán thành công')) {
                    setSuccess(true);
                    // Clear both cart and buyNowItem from localStorage
                    localStorage.removeItem('cart');
                    localStorage.removeItem('buyNowItem');
                    
                    // Get pending order info before clearing it
                    const pendingOrderInfo = localStorage.getItem('pendingOrder');
                    const pendingOrder = pendingOrderInfo ? JSON.parse(pendingOrderInfo) : null;
                    
                    // Navigate to success page with order info
                    setTimeout(() => {
                        navigate('/success', {
                            state: {
                                orderData: {
                                    orderId: pendingOrder?.orderId || null
                                }
                            }
                        });
                    }, 2000); // Show success message for 2 seconds before redirecting
                } else {
                    setSuccess(false);
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setSuccess(false);
            } finally {
                setLoading(false);
                localStorage.removeItem('pendingOrder');
            }
        };

        processPayment();
    }, [location.search, navigate]);

    if (loading) {
        return (
            <CustomerLayout>
                <div style={styles.loadingContainer}>
                    <Spin size="large" />
                    <Text style={{ color: '#666', fontSize: '16px' }}>
                        Đang xác thực thanh toán VNPay...
                    </Text>
                </div>
            </CustomerLayout>
        );
    }

    // Get pending order info for display
    const pendingOrderInfo = localStorage.getItem('pendingOrder');
    const pendingOrder = pendingOrderInfo ? JSON.parse(pendingOrderInfo) : null;

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <div style={styles.steps}>
                    <Steps
                        items={[
                            {
                                title: 'Giỏ hàng',
                                status: 'finish',
                                icon: <ShoppingOutlined />,
                            },
                            {
                                title: 'Thông tin đặt hàng',
                                status: 'finish',
                                icon: <UserOutlined />,
                            },
                            {
                                title: 'Thanh toán VNPay',
                                status: success ? 'finish' : 'error',
                                icon: success ? <CreditCardOutlined /> : <CloseCircleOutlined />,
                            },
                            {
                                title: 'Hoàn tất',
                                status: success ? 'finish' : 'wait',
                                icon: <CheckCircleOutlined />,
                            },
                        ]}
                    />
                </div>

                <div style={styles.vnpayInfo}>
                    <div style={styles.vnpayTitle}>
                        <CreditCardOutlined style={{ color: '#ff6b35' }} />
                        Thông tin thanh toán VNPay
                    </div>
                    <Text style={{ color: '#666', fontSize: '15px' }}>
                        {success 
                            ? "Giao dịch đã được VNPay xử lý thành công và xác nhận thanh toán."
                            : "Giao dịch VNPay không thành công. Vui lòng kiểm tra lại thông tin thanh toán."
                        }
                    </Text>
                </div>

                <div style={styles.result}>
                    <Result
                        status={success ? "success" : "error"}
                        title={<div style={{ fontSize: '28px', fontWeight: '800', color: success ? '#27ae60' : '#ff4d4f', textTransform: 'uppercase', marginBottom: '8px' }}>{success ? "Thanh toán VNPay thành công!" : "Thanh toán VNPay thất bại!"}</div>}
                        subTitle={
                            <div>
                                <div style={styles.orderNumber}>
                                    {success 
                                        ? `Mã đơn hàng: ${pendingOrder?.orderId || 'Đang tạo mã đơn hàng...'}`
                                        : "Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
                                    }
                                </div>
                                <div style={{ marginTop: '8px', color: '#666' }}>
                                    {success 
                                        ? "Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý ngay lập tức."
                                        : "Có lỗi xảy ra trong quá trình xác thực thanh toán với VNPay."
                                    }
                                </div>
                            </div>
                        }
                        style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
                    />
                </div>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                        type="button"
                        style={styles.button}
                        onClick={() => navigate('/')}
                    >
                        <ShoppingOutlined style={{ marginRight: 8 }} />
                        Về trang chủ
                    </button>
                    {success && (
                        <button
                            type="button"
                            style={styles.buttonSecondary}
                            onClick={() => navigate('/order-history')}
                        >
                            Xem đơn hàng
                        </button>
                    )}
                    {!success && (
                        <button
                            type="button"
                            style={styles.buttonSecondary}
                            onClick={() => navigate('/cart')}
                        >
                            Quay lại giỏ hàng
                        </button>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default VNPayReturn;