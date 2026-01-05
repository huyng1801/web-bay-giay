import React, { useEffect, useState } from 'react';
import { 
    Form, 
    Input, 
    Typography, 
    Row, 
    Col, 
    message, 
    Spin, 
    Divider,
    Modal,
    Select 
} from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    HomeOutlined, 
    LockOutlined,
    EditOutlined,
    SaveOutlined 
} from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';
import { getOrdersByCustomerId, getCustomerByEmail } from '../../services/home/HomeService';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const styles = {
    // Main wrapper
    container: {
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '48px 0',
    },

    contentWrapper: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
    },

    // Page Header
    pageHeader: {
        marginBottom: '48px',
        textAlign: 'center',
    },

    pageTitle: {
        fontSize: '42px',
        fontWeight: '800',
        color: '#222',
        marginBottom: '12px',
        letterSpacing: '-0.5px',
        textTransform: 'uppercase',
    },

    pageTitleUnderline: {
        height: '3px',
        width: '80px',
        background: '#ff6b35',
        margin: '0 auto 24px',
        borderRadius: '2px',
    },

    subtitle: {
        color: '#666',
        fontSize: '15px',
        lineHeight: '1.6',
    },

    // Cards
    card: {
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        border: '1px solid #eaeaea',
        padding: '28px 24px',
        marginBottom: '28px',
    },

    cardTitle: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#222',
        marginBottom: '24px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '2px solid #ff6b35',
        paddingBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },

    // Form
    formItem: {
        marginBottom: '24px',
    },

    formLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#222',
        marginBottom: '8px',
        display: 'block',
    },

    input: {
        height: '44px',
        borderRadius: '8px',
        border: '1.5px solid #eaeaea',
        fontSize: '15px',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    },

    inputFocus: {
        borderColor: '#ff6b35',
        boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.1)',
    },

    select: {
        height: '44px',
        borderRadius: '8px',
        border: '1.5px solid #eaeaea !important',
    },

    divider: {
        borderColor: '#eaeaea',
        margin: '32px 0',
    },

    infoText: {
        color: '#999',
        fontSize: '13px',
        fontStyle: 'italic',
        marginTop: '8px',
        display: 'block',
    },

    // Buttons
    button: {
        height: '48px',
        fontSize: '16px',
        fontWeight: '700',
        borderRadius: '999px',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    },

    primaryButton: {
        background: 'linear-gradient(90deg, #ff6b35 0%, #ff8a50 100%)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 4px 15px rgba(255, 107, 53, 0.15)',
        width: '100%',
    },

    primaryButtonHover: {
        opacity: 0.95,
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.25)',
    },

    dangerButton: {
        background: 'linear-gradient(90deg, #ff4d4f 0%, #ff6b6b 100%)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 4px 15px rgba(255, 77, 79, 0.15)',
        width: '100%',
    },

    dangerButtonHover: {
        opacity: 0.95,
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(255, 77, 79, 0.25)',
    },

    secondaryButton: {
        background: '#fff',
        color: '#ff6b35',
        border: '1.5px solid #ff6b35',
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.08)',
    },

    secondaryButtonHover: {
        background: '#fff9f6',
        borderColor: '#ff6b35',
    },

    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
    },

    securityBox: {
        background: '#f4f6fb',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #eaeaea',
        marginBottom: '20px',
    },

    securityText: {
        color: '#666',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '16px',
    },
};

const ProfilePage = () => {
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerInfo = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    message.error('Vui lòng đăng nhập để xem thông tin cá nhân');
                    navigate('/login');
                    return;
                }

                const decodedToken = jwtDecode(token);
                const customerData = await getCustomerByEmail(decodedToken.sub);
                
                if (customerData) {
                    setCustomerInfo(customerData);
                    profileForm.setFieldsValue({
                        fullName: customerData.fullName,
                        email: customerData.email,
                        phone: customerData.phone,
                        address: customerData.address,
                        address2: customerData.address2 || '',
                        city: customerData.city,
                    });
                }
            } catch (error) {
                console.error('Error fetching customer info:', error);
                message.error('Không thể tải thông tin khách hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerInfo();
    }, [navigate, profileForm]);

    const onUpdateProfile = async (values) => {
        setProfileLoading(true);
        try {
            // TODO: Implement updateCustomerProfile API call
            // await updateCustomerProfile(customerInfo.customerId, values);
            
            // Mock success for demo
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success('Cập nhật thông tin cá nhân thành công!');
            
            // Update local state
            setCustomerInfo(prev => ({
                ...prev,
                ...values
            }));
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setProfileLoading(false);
        }
    };

    const onChangePassword = async (values) => {
        setPasswordLoading(true);
        try {
            // TODO: Implement changeCustomerPassword API call
            // await changeCustomerPassword(customerInfo.customerId, values);
            
            // Mock success for demo
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success('Đổi mật khẩu thành công!');
            setIsPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (error) {
            console.error('Error changing password:', error);
            message.error('Có lỗi xảy ra khi đổi mật khẩu');
        } finally {
            setPasswordLoading(false);
        }
    };

    const showPasswordModal = () => {
        setIsPasswordModalVisible(true);
    };

    const handlePasswordModalCancel = () => {
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div style={styles.spinner}>
                    <Spin size="large" />
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <div style={styles.contentWrapper}>
                    {/* Page Header */}
                    <div style={styles.pageHeader}>
                        <Title level={1} style={styles.pageTitle}>Thông Tin Cá Nhân</Title>
                        <div style={styles.pageTitleUnderline}></div>
                        <Text style={styles.subtitle}>
                            {customerInfo ? `Xin chào ${customerInfo.fullName}, ` : ''}quản lý thông tin tài khoản và bảo mật của bạn
                        </Text>
                    </div>

                    <Row gutter={[32, 32]}>
                        {/* Profile Form */}
                        <Col xs={24} lg={16}>
                            <div style={styles.card}>
                                <Title level={4} style={styles.cardTitle}>
                                    <UserOutlined />
                                    Thông Tin Cá Nhân
                                </Title>
                                
                                <Form
                                    form={profileForm}
                                    layout="vertical"
                                    onFinish={onUpdateProfile}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Họ và tên"
                                                name="fullName"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                                style={styles.formItem}
                                            >
                                                <Input 
                                                    prefix={<UserOutlined style={{ color: '#ff6b35' }} />}
                                                    style={styles.input}
                                                    placeholder="Nhập họ và tên"
                                                    onFocus={e => {
                                                        e.target.style.borderColor = '#ff6b35';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                                                    }}
                                                    onBlur={e => {
                                                        e.target.style.borderColor = '#eaeaea';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Email"
                                                name="email"
                                                style={styles.formItem}
                                            >
                                                <Input 
                                                    prefix={<MailOutlined style={{ color: '#ff6b35' }} />}
                                                    style={styles.input}
                                                    disabled
                                                    placeholder="Email"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Số điện thoại"
                                                name="phone"
                                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                                style={styles.formItem}
                                            >
                                                <Input 
                                                    prefix={<PhoneOutlined style={{ color: '#ff6b35' }} />}
                                                    style={styles.input}
                                                    placeholder="Nhập số điện thoại"
                                                    onFocus={e => {
                                                        e.target.style.borderColor = '#ff6b35';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                                                    }}
                                                    onBlur={e => {
                                                        e.target.style.borderColor = '#eaeaea';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Thành phố"
                                                name="city"
                                                rules={[{ required: true, message: 'Vui lòng chọn thành phố!' }]}
                                                style={styles.formItem}
                                            >
                                                <Select
                                                    placeholder="Chọn tỉnh/thành phố"
                                                    style={styles.select}
                                                    showSearch
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    options={[
                                                        { value: 'hanoi', label: 'Hà Nội' },
                                                        { value: 'hcm', label: 'TP. Hồ Chí Minh' },
                                                        { value: 'danang', label: 'Đà Nẵng' },
                                                        // Thêm tỉnh thành khác nếu cần
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        label="Địa chỉ"
                                        name="address"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                        style={styles.formItem}
                                    >
                                        <Input 
                                            prefix={<HomeOutlined style={{ color: '#ff6b35' }} />}
                                            style={styles.input}
                                            placeholder="Nhập địa chỉ"
                                            onFocus={e => {
                                                e.target.style.borderColor = '#ff6b35';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#eaeaea';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Địa chỉ bổ sung (tùy chọn)"
                                        name="address2"
                                        style={styles.formItem}
                                    >
                                        <Input 
                                            prefix={<HomeOutlined style={{ color: '#ff6b35' }} />}
                                            style={styles.input}
                                            placeholder="Nhập địa chỉ bổ sung"
                                            onFocus={e => {
                                                e.target.style.borderColor = '#ff6b35';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = '#eaeaea';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </Form.Item>

                                    <Text style={styles.infoText}>
                                        * Email không thể thay đổi. Nếu bạn muốn thay đổi email, vui lòng liên hệ bộ phận hỗ trợ.
                                    </Text>

                                    <Divider style={styles.divider} />

                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <button
                                            type="button"
                                            style={{
                                                ...styles.button,
                                                ...styles.primaryButton,
                                            }}
                                            onClick={() => profileForm.submit()}
                                            disabled={profileLoading}
                                            onMouseEnter={e => {
                                                e.target.style.opacity = 0.95;
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.25)';
                                            }}
                                            onMouseLeave={e => {
                                                e.target.style.opacity = 1;
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.15)';
                                            }}
                                        >
                                            <SaveOutlined style={{ marginRight: 8 }} />
                                            {profileLoading ? 'Đang cập nhật...' : 'Cập Nhật Thông Tin'}
                                        </button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>

                        {/* Security Section */}
                        <Col xs={24} lg={8}>
                            <div style={styles.card}>
                                <Title level={4} style={styles.cardTitle}>
                                    <LockOutlined />
                                    Bảo Mật
                                </Title>
                                
                                <div style={styles.securityBox}>
                                    <Text style={styles.securityText}>
                                        Đảm bảo tài khoản của bạn an toàn bằng cách sử dụng mật khẩu mạnh.
                                    </Text>
                                </div>

                                <button
                                    type="button"
                                    style={{
                                        ...styles.button,
                                        ...styles.dangerButton,
                                    }}
                                    onClick={showPasswordModal}
                                    onMouseEnter={e => {
                                        e.target.style.opacity = 0.95;
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(255, 77, 79, 0.25)';
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.opacity = 1;
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(255, 77, 79, 0.15)';
                                    }}
                                >
                                    <EditOutlined style={{ marginRight: 8 }} />
                                    Đổi Mật Khẩu
                                </button>

                                <Text style={styles.infoText}>
                                    Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
                                </Text>
                            </div>
                        </Col>
                    </Row>

                    {/* Change Password Modal */}
                    <Modal
                        title={<div style={{ fontSize: '18px', fontWeight: '800', textTransform: 'uppercase', color: '#222' }}>Đổi Mật Khẩu</div>}
                        open={isPasswordModalVisible}
                        onCancel={handlePasswordModalCancel}
                        footer={null}
                        destroyOnClose
                        bodyStyle={{ padding: '24px' }}
                    >
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={onChangePassword}
                        >
                            <Form.Item
                                label="Mật khẩu hiện tại"
                                name="currentPassword"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                                style={styles.formItem}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined style={{ color: '#ff6b35' }} />}
                                    style={styles.input}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    onFocus={e => {
                                        e.target.style.borderColor = '#ff6b35';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#eaeaea';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                                ]}
                                style={styles.formItem}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined style={{ color: '#ff6b35' }} />}
                                    style={styles.input}
                                    placeholder="Nhập mật khẩu mới"
                                    onFocus={e => {
                                        e.target.style.borderColor = '#ff6b35';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#eaeaea';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu mới"
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]}
                                style={styles.formItem}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined style={{ color: '#ff6b35' }} />}
                                    style={styles.input}
                                    placeholder="Xác nhận mật khẩu mới"
                                    onFocus={e => {
                                        e.target.style.borderColor = '#ff6b35';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#eaeaea';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <button
                                            type="button"
                                            style={{
                                                ...styles.button,
                                                ...styles.secondaryButton,
                                                width: '100%',
                                            }}
                                            onClick={handlePasswordModalCancel}
                                            onMouseEnter={e => {
                                                e.target.style.background = '#fff9f6';
                                            }}
                                            onMouseLeave={e => {
                                                e.target.style.background = '#fff';
                                            }}
                                        >
                                            Hủy
                                        </button>
                                    </Col>
                                    <Col span={12}>
                                        <button
                                            type="button"
                                            style={{
                                                ...styles.button,
                                                ...styles.primaryButton,
                                                width: '100%',
                                            }}
                                            onClick={() => passwordForm.submit()}
                                            disabled={passwordLoading}
                                            onMouseEnter={e => {
                                                e.target.style.opacity = 0.95;
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.25)';
                                            }}
                                            onMouseLeave={e => {
                                                e.target.style.opacity = 1;
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.15)';
                                            }}
                                        >
                                            {passwordLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                                        </button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default ProfilePage;
