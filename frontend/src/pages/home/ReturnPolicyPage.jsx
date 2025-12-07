import React from 'react';
import { Typography, Card } from 'antd';
import { UndoOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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

const ReturnPolicyPage = () => {
  return (
    <CustomerLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Chính Sách Đổi Trả</Title>
          <Paragraph style={{ fontSize: '18px', margin: 0, opacity: 0.9 }}>
            Quy định về việc đổi trả sản phẩm tại Poly Shoes
          </Paragraph>
        </div>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <UndoOutlined style={styles.icon} />
            Điều Kiện Đổi Trả
          </Title>
          <Paragraph>
            • Sản phẩm còn nguyên tem, mác, chưa qua sử dụng
          </Paragraph>
          <Paragraph>
            • Sản phẩm không bị dính bẩn, hỏng hóc do lỗi người dùng
          </Paragraph>
          <Paragraph>
            • Còn đầy đủ phụ kiện, bao bì khi mua
          </Paragraph>
          <Paragraph>
            • Có hóa đơn mua hàng hoặc thông tin đơn hàng
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <ClockCircleOutlined style={styles.icon} />
            Thời Gian Đổi Trả
          </Title>
          <Paragraph>
            • <strong>Đổi size/màu:</strong> Trong vòng 7 ngày kể từ ngày nhận hàng
          </Paragraph>
          <Paragraph>
            • <strong>Trả hàng (hoàn tiền):</strong> Trong vòng 7 ngày nếu sản phẩm lỗi từ nhà sản xuất
          </Paragraph>
          <Paragraph>
            • <strong>Trả hàng do không vừa ý:</strong> Trong vòng 3 ngày, khách hàng chịu phí vận chuyển
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <ExclamationCircleOutlined style={styles.icon} />
            Trường Hợp Không Được Đổi Trả
          </Title>
          <Paragraph>
            • Sản phẩm thuộc danh mục đồ lót, tất/vớ
          </Paragraph>
          <Paragraph>
            • Sản phẩm đã qua sử dụng, giặt tẩy
          </Paragraph>
          <Paragraph>
            • Sản phẩm bị hư hỏng do lỗi người dùng
          </Paragraph>
          <Paragraph>
            • Quá thời hạn đổi trả quy định
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px' }}>
            Quy Trình Đổi Trả
          </Title>
          <Paragraph>
            <strong>Bước 1:</strong> Liên hệ bộ phận chăm sóc khách hàng qua hotline: 0123 456 789
          </Paragraph>
          <Paragraph>
            <strong>Bước 2:</strong> Cung cấp thông tin đơn hàng và lý do đổi trả
          </Paragraph>
          <Paragraph>
            <strong>Bước 3:</strong> Đóng gói sản phẩm theo yêu cầu
          </Paragraph>
          <Paragraph>
            <strong>Bước 4:</strong> Gửi hàng về địa chỉ được hướng dẫn
          </Paragraph>
          <Paragraph>
            <strong>Bước 5:</strong> Nhận sản phẩm mới hoặc hoàn tiền trong 3-5 ngày làm việc
          </Paragraph>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default ReturnPolicyPage;