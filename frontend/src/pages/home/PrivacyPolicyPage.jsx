import React from 'react';
import { Typography, Card } from 'antd';
import { SafetyCertificateOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
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

const PrivacyPolicyPage = () => {
  return (
    <CustomerLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Chính Sách Bảo Mật</Title>
          <Paragraph style={{ fontSize: '18px', margin: 0, opacity: 0.9 }}>
            Cam kết bảo vệ thông tin cá nhân của khách hàng
          </Paragraph>
        </div>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <UserOutlined style={styles.icon} />
            Thu Thập Thông Tin
          </Title>
          <Paragraph>
            Chúng tôi thu thập thông tin khi bạn:
          </Paragraph>
          <Paragraph>
            • Đăng ký tài khoản trên website
          </Paragraph>
          <Paragraph>
            • Đặt hàng hoặc thanh toán
          </Paragraph>
          <Paragraph>
            • Đăng ký nhận bản tin
          </Paragraph>
          <Paragraph>
            • Liên hệ với chúng tôi qua email hoặc điện thoại
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <LockOutlined style={styles.icon} />
            Sử Dụng Thông Tin
          </Title>
          <Paragraph>
            Thông tin cá nhân được sử dụng để:
          </Paragraph>
          <Paragraph>
            • Xử lý đơn hàng và giao hàng
          </Paragraph>
          <Paragraph>
            • Gửi thông báo về đơn hàng
          </Paragraph>
          <Paragraph>
            • Cải thiện dịch vụ khách hàng
          </Paragraph>
          <Paragraph>
            • Gửi thông tin khuyến mãi (nếu được đồng ý)
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <SafetyCertificateOutlined style={styles.icon} />
            Bảo Mật Thông Tin
          </Title>
          <Paragraph>
            • Thông tin được mã hóa bằng công nghệ SSL
          </Paragraph>
          <Paragraph>
            • Không chia sẻ thông tin với bên thứ ba không được ủy quyền
          </Paragraph>
          <Paragraph>
            • Hệ thống được bảo vệ bởi tường lửa và phần mềm chống virus
          </Paragraph>
          <Paragraph>
            • Nhân viên được đào tạo về bảo mật thông tin khách hàng
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px' }}>
            Quyền Của Khách Hàng
          </Title>
          <Paragraph>
            • Yêu cầu xem thông tin cá nhân đã lưu trữ
          </Paragraph>
          <Paragraph>
            • Yêu cầu chỉnh sửa thông tin không chính xác
          </Paragraph>
          <Paragraph>
            • Yêu cầu xóa tài khoản và thông tin cá nhân
          </Paragraph>
          <Paragraph>
            • Từ chối nhận email marketing
          </Paragraph>
          <Paragraph>
            Để thực hiện các quyền trên, vui lòng liên hệ: <strong>support@polyshoes.com</strong>
          </Paragraph>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default PrivacyPolicyPage;