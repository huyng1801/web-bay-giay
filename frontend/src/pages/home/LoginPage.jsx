import React, { useState } from 'react';
import { Form, Input, message, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../services/home/HomeService';
import CustomerLayout from '../../layouts/CustomerLayout';

const authStyles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0',
  },
  card: {
    width: 420,
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
  registerText: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '15px',
    color: '#555',
  },
  registerLink: {
    color: '#ff6b35',
    fontWeight: '700',
    marginLeft: '4px',
    textDecoration: 'underline',
    transition: 'color 0.2s',
  },
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await login(values.email, values.password);

      localStorage.setItem('jwt', response);

      message.success('Đăng nhập thành công!');
      
      // Redirect to the home page
      navigate('/');
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div style={authStyles.container}>
        <div style={authStyles.card}>
          <div style={authStyles.header}>
            <div style={authStyles.title}>Đăng Nhập</div>
            <div style={authStyles.underline}></div>
          </div>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
              style={authStyles.formItem}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#ff6b35' }} />}
                placeholder="Email"
                size="large"
                style={authStyles.input}
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
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              style={authStyles.formItem}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#ff6b35' }} />}
                placeholder="Mật khẩu"
                size="large"
                style={authStyles.input}
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

            <Form.Item style={{ marginBottom: 0 }}>
              <button
                type="submit"
                style={authStyles.button}
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
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </Form.Item>

            <div style={authStyles.registerText}>
              Chưa có tài khoản?
              <Link to="/register" style={authStyles.registerLink}>
                Đăng ký ngay
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default LoginPage;
