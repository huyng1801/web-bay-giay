import React from 'react';
import { Button, Steps, Result } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomerLayout from '../../layouts/CustomerLayout';
import { 
    ShoppingOutlined, 
    UserOutlined, 
    CheckCircleOutlined,
} from '@ant-design/icons';

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
    buttonHover: {
        opacity: 0.95,
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.25)',
    },
};

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.orderData;
    const [hoveredButton, setHoveredButton] = React.useState(false);

    const handleContinueShopping = () => {
        navigate('/');
    };

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
                                title: 'Hoàn tất',
                                status: 'finish',
                                icon: <CheckCircleOutlined />,
                            },
                        ]}
                    />
                </div>

                <div style={styles.result}>
                    <Result
                        status="success"
                        title={<div style={{ fontSize: '28px', fontWeight: '800', color: '#222', textTransform: 'uppercase', marginBottom: '8px' }}>Đặt hàng thành công!</div>}
                        subTitle={
                            <div style={styles.orderNumber}>
                                Mã đơn hàng: {orderData?.orderId || 'Đang tạo mã đơn hàng...'}
                            </div>
                        }
                        style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
                    />
                </div>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                        type="button"
                        style={{
                            ...styles.button,
                            ...(hoveredButton ? styles.buttonHover : {})
                        }}
                        onClick={handleContinueShopping}
                        onMouseEnter={() => setHoveredButton(true)}
                        onMouseLeave={() => setHoveredButton(false)}
                    >
                        <ShoppingOutlined style={{ marginRight: 8 }} />
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default SuccessPage;