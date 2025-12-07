import React from 'react';
import { Typography, Card } from 'antd';
import { FileTextOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';

const { Title, Paragraph } = Typography;

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 20px',
    borderRadius: '16px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  card: {
    marginBottom: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    fontSize: '24px',
    color: '#ff6b35',
  }
};

const TermsOfServicePage = () => {
  return (
    <CustomerLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Điều Khoản Sử Dụng</Title>
          <Paragraph style={{ fontSize: '18px', margin: 0, opacity: 0.9 }}>
            Quy định sử dụng dịch vụ tại Poly Shoes
          </Paragraph>
        </div>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <FileTextOutlined style={styles.icon} />
            Chấp Nhận Điều Khoản
          </Title>
          <Paragraph>
            Bằng việc truy cập và sử dụng website Poly Shoes, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây.
          </Paragraph>
          <Paragraph>
            Nếu không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <CheckCircleOutlined style={styles.icon} />
            Quyền Và Nghĩa Vụ Của Người Dùng
          </Title>
          <Paragraph>
            <strong>Quyền của người dùng:</strong>
          </Paragraph>
          <Paragraph>
            • Truy cập và sử dụng các dịch vụ của website
          </Paragraph>
          <Paragraph>
            • Được bảo mật thông tin cá nhân
          </Paragraph>
          <Paragraph>
            • Được hỗ trợ khi gặp vấn đề
          </Paragraph>
          
          <Paragraph style={{ marginTop: '20px' }}>
            <strong>Nghĩa vụ của người dùng:</strong>
          </Paragraph>
          <Paragraph>
            • Cung cấp thông tin chính xác khi đăng ký
          </Paragraph>
          <Paragraph>
            • Không sử dụng website cho mục đích bất hợp pháp
          </Paragraph>
          <Paragraph>
            • Thanh toán đầy đủ cho các đơn hàng
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <ExclamationCircleOutlined style={styles.icon} />
            Hành Vi Bị Cấm
          </Title>
          <Paragraph>
            • Sử dụng website để tung tin sai sự thật
          </Paragraph>
          <Paragraph>
            • Can thiệp vào hoạt động của hệ thống
          </Paragraph>
          <Paragraph>
            • Sao chép nội dung mà không có sự cho phép
          </Paragraph>
          <Paragraph>
            • Sử dụng tài khoản của người khác
          </Paragraph>
          <Paragraph>
            • Spam hoặc gửi email rác
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px' }}>
            Giới Hạn Trách Nhiệm
          </Title>
          <Paragraph>
            • Poly Shoes không chịu trách nhiệm cho các thiệt hại gián tiếp
          </Paragraph>
          <Paragraph>
            • Không đảm bảo website hoạt động 100% không lỗi
          </Paragraph>
          <Paragraph>
            • Có quyền thay đổi điều khoản mà không cần thông báo trước
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px' }}>
            Liên Hệ
          </Title>
          <Paragraph>
            Nếu có bất kỳ thắc mắc nào về điều khoản sử dụng, vui lòng liên hệ:
          </Paragraph>
          <Paragraph>
            • Email: <strong>support@polyshoes.com</strong>
          </Paragraph>
          <Paragraph>
            • Hotline: <strong>0123 456 789</strong>
          </Paragraph>
          <Paragraph>
            • Địa chỉ: <strong>Hà Nội, Việt Nam</strong>
          </Paragraph>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default TermsOfServicePage;