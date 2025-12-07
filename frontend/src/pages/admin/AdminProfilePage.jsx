import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Alert,
  Row,
  Col,
  Avatar,
  Typography,
  Space
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import AdminUserService from '../../services/admin/AdminUserService';

const { Title, Text } = Typography;

const AdminProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await AdminUserService.getCurrentAdminProfile();
      setProfile(profileData);
      profileForm.setFieldsValue({
        fullName: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
        address2: profileData.address2
      });
    } catch (err) {
      setError('Không thể tải thông tin tài khoản');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, [profileForm]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdateProfile = async (values) => {
    setUpdating(true);
    try {
      await AdminUserService.updateCurrentAdminProfile({
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        address2: values.address2
      });
      
      message.success('Cập nhật thông tin thành công!');
      await fetchProfile(); // Refresh data
    } catch (err) {
      message.error('Cập nhật thông tin thất bại!');
      console.error('Error updating profile:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (values) => {
    setChangingPassword(true);
    try {
      await AdminUserService.changeCurrentPassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      
      message.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields();
    } catch (err) {
      message.error('Đổi mật khẩu thất bại! Vui lòng kiểm tra mật khẩu hiện tại.');
      console.error('Error changing password:', err);
    } finally {
      setChangingPassword(false);
    }
  };

  const validatePassword = (_, value) => {
    if (!value || value.length < 8) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 ký tự'));
    }
    if (value.length > 16) {
      return Promise.reject(new Error('Mật khẩu không được vượt quá 16 ký tự'));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    const newPassword = passwordForm.getFieldValue('newPassword');
    if (value && value !== newPassword) {
      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
    }
    return Promise.resolve();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
            closable
          />
        )}

        {profile && (
          <Row gutter={[24, 24]}>
            {/* Profile Info Card */}
            <Col xs={24} md={8}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={100} 
                    icon={<UserOutlined />} 
                    style={{ backgroundColor: '#1890ff', marginBottom: '16px' }}
                  />
                  <Title level={4} style={{ margin: '0 0 8px 0' }}>
                    {profile.fullName}
                  </Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    {profile.email}
                  </Text>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    <strong>{profile.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}</strong>
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Tham gia: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </div>
              </Card>
            </Col>

            {/* Profile Form */}
            <Col xs={24} md={16}>
              <Card 
                title={activeTab === 'profile' ? 'Thông tin cá nhân' : 'Đổi mật khẩu'}
                extra={
                  <div>
                    <Button 
                      type={activeTab === 'profile' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('profile')}
                      style={{ marginRight: '8px' }}
                    >
                      Thông tin
                    </Button>
                    <Button 
                      type={activeTab === 'password' ? 'primary' : 'default'}
                      onClick={() => setActiveTab('password')}
                    >
                      Mật khẩu
                    </Button>
                  </div>
                }
              >
                {activeTab === 'profile' ? (
                  <Form
                    form={profileForm}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                  >
                    <Row gutter={[16, 0]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Họ và tên"
                          name="fullName"
                          rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên' },
                            { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
                          ]}
                        >
                          <Input 
                            prefix={<UserOutlined />} 
                            placeholder="Nhập họ và tên"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Số điện thoại"
                          name="phone"
                        >
                          <Input 
                            placeholder="Nhập số điện thoại"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          label="Địa chỉ chính"
                          name="address"
                        >
                          <Input 
                            placeholder="Nhập địa chỉ chính"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          label="Địa chỉ phụ (tùy chọn)"
                          name="address2"
                        >
                          <Input 
                            placeholder="Nhập địa chỉ phụ (nếu có)"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="Email">
                          <Input 
                            value={profile.email}
                            disabled
                            style={{ backgroundColor: '#f5f5f5' }}
                          />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Email không thể thay đổi
                          </Text>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item style={{ marginTop: '24px' }}>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={updating}
                        icon={<SaveOutlined />}
                      >
                        Cập nhật thông tin
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                  >
                    <Form.Item
                      label="Mật khẩu hiện tại"
                      name="currentPassword"
                      rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu hiện tại"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Mật khẩu mới"
                      name="newPassword"
                      rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                        { validator: validatePassword }
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu mới (8-16 ký tự)"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Xác nhận mật khẩu mới"
                      name="confirmPassword"
                      rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                        { validator: validateConfirmPassword }
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập lại mật khẩu mới"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '24px' }}>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={changingPassword}
                        icon={<LockOutlined />}
                      >
                        Đổi mật khẩu
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
