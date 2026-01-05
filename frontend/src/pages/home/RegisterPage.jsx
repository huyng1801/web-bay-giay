import React, { useState, useEffect } from 'react';
import { Form, Input, message, Row, Col, Typography, Select, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { register } from '../../services/home/HomeService';
import CustomerLayout from '../../layouts/CustomerLayout';
import OrderShippingService from '../../services/home/OrderShippingService';

const { Title } = Typography;
const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0',
  },
  card: {
    width: '100%',
    maxWidth: 800,
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    border: '1.5px solid #eaeaea',
    padding: '40px 32px',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#222',
    textTransform: 'uppercase',
    letterSpacing: '-0.5px',
    marginBottom: '8px',
  },
  underline: {
    height: '3px',
    width: '60px',
    background: '#ff6b35',
    margin: '0 auto 24px',
    borderRadius: '2px',
  },
  formItem: {
    marginBottom: '24px',
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
  button: {
    height: '48px',
    fontSize: '16px',
    fontWeight: '700',
    borderRadius: '999px',
    width: '100%',
    background: 'linear-gradient(90deg, #ff6b35 0%, #ff8a50 100%)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.15)',
    border: 'none',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    marginBottom: '8px',
  },
  buttonHover: {
    opacity: 0.95,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.25)',
  },
  loginText: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '15px',
    color: '#555',
  },
  loginLink: {
    color: '#ff6b35',
    fontWeight: '700',
    marginLeft: '4px',
    textDecoration: 'underline',
    transition: 'color 0.2s',
  },
};

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingGHN, setLoadingGHN] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Load provinces on component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      setLoadingGHN(true);
      const response = await OrderShippingService.getProvinces();
      if (response && response.data && Array.isArray(response.data)) {
        setProvinces(response.data.map(p => ({
          value: p.ProvinceID,
          label: p.ProvinceName
        })));
      }
    } catch (error) {
      console.error('Error loading provinces:', error);
      message.error('Lỗi khi tải danh sách tỉnh/thành phố');
    } finally {
      setLoadingGHN(false);
    }
  };

  const handleProvinceChange = async (provinceId) => {
    if (!provinceId) {
      setDistricts([]);
      setWards([]);
      form.setFieldsValue({ districtId: undefined, wardCode: undefined });
      return;
    }

    try {
      setLoadingGHN(true);
      const response = await OrderShippingService.getDistricts(provinceId);
      if (response && response.data && Array.isArray(response.data)) {
        setDistricts(response.data.map(d => ({
          value: d.DistrictID,
          label: d.DistrictName
        })));
      }
      setWards([]);
      form.setFieldsValue({ districtId: undefined, wardCode: undefined });
    } catch (error) {
      console.error('Error loading districts:', error);
      message.error('Lỗi khi tải danh sách quận/huyện');
    } finally {
      setLoadingGHN(false);
    }
  };

  const handleDistrictChange = async (districtId) => {
    if (!districtId) {
      setWards([]);
      form.setFieldsValue({ wardCode: undefined });
      return;
    }

    try {
      setLoadingGHN(true);
      const response = await OrderShippingService.getWards(districtId);
      if (response && response.data && Array.isArray(response.data)) {
        setWards(response.data.map(w => ({
          value: w.WardCode,
          label: w.WardName
        })));
      }
      form.setFieldsValue({ wardCode: undefined });
    } catch (error) {
      console.error('Error loading wards:', error);
      message.error('Lỗi khi tải danh sách phường/xã');
    } finally {
      setLoadingGHN(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await register(values);
      message.success('Đăng ký thành công!');
      console.log('Registration response:', response);
      // Chuyển hướng sang trang đăng nhập sau 1.5 giây
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      message.error('Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.title}>Đăng Ký</div>
            <div style={styles.underline}></div>
          </div>
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            form={form}
          >
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                  style={styles.formItem}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#ff6b35' }} />}
                    placeholder="Họ và tên"
                    size="large"
                    style={styles.input}
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
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                  style={styles.formItem}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: '#ff6b35' }} />}
                    placeholder="Email"
                    size="large"
                    style={styles.input}
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
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                  style={styles.formItem}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: '#ff6b35' }} />}
                    placeholder="Mật khẩu"
                    size="large"
                    style={styles.input}
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
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { 
                      pattern: /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
                      message: 'Số điện thoại không hợp lệ! Vui lòng nhập đúng định dạng Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)'
                    }
                  ]}
                  style={styles.formItem}
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: '#ff6b35' }} />}
                    placeholder="Số điện thoại (VD: 0987654321)"
                    size="large"
                    style={styles.input}
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
            </Row>

            <Form.Item
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              style={styles.formItem}
            >
              <Input
                prefix={<HomeOutlined style={{ color: '#ff6b35' }} />}
                placeholder="Địa chỉ (Số nhà, tên đường, ...)"
                size="large"
                style={styles.input}
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

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="provinceId"
                  rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                  style={styles.formItem}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    size="large"
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={provinces}
                    onChange={handleProvinceChange}
                    loading={loadingGHN}
                    style={styles.select}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="districtId"
                  rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
                  style={styles.formItem}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    size="large"
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={districts}
                    onChange={handleDistrictChange}
                    loading={loadingGHN}
                    disabled={!districts.length}
                    style={styles.select}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="wardCode"
                  rules={[{ required: true, message: 'Vui lòng chọn phường/xã!' }]}
                  style={styles.formItem}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    size="large"
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={wards}
                    loading={loadingGHN}
                    disabled={!wards.length}
                    style={styles.select}
                  />
                </Form.Item>
              </Col>

            </Row>

            <Form.Item style={{ marginBottom: 0 }}>
              <button
                type="submit"
                style={styles.button}
                disabled={loading}
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
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </Form.Item>

            <div style={styles.loginText}>
              Đã có tài khoản?
              <Link to="/login" style={styles.loginLink}>
                Đăng nhập ngay
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default RegisterPage;