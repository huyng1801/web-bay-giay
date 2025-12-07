import React from 'react';
import { Typography, Card } from 'antd';
import { DeliveredProcedureOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
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

const ShippingPolicyPage = () => {
  return (
    <CustomerLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Chính Sách Vận Chuyển</Title>
          <Paragraph style={{ fontSize: '18px', margin: 0, opacity: 0.9 }}>
            Thông tin chi tiết về dịch vụ vận chuyển của Poly Shoes
          </Paragraph>
        </div>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <DeliveredProcedureOutlined style={styles.icon} />
            Phí Vận Chuyển
          </Title>
          <Paragraph>
            • <strong>Miễn phí vận chuyển</strong> cho đơn hàng trên 500.000 VNĐ
          </Paragraph>
          <Paragraph>
            • Phí vận chuyển: 30.000 VNĐ cho đơn hàng dưới 500.000 VNĐ
          </Paragraph>
          <Paragraph>
            • Vận chuyển nhanh (trong ngày): phụ thu 20.000 VNĐ (chỉ áp dụng tại TP.HCM và Hà Nội)
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <ClockCircleOutlined style={styles.icon} />
            Thời Gian Giao Hàng
          </Title>
          <Paragraph>
            • <strong>Nội thành TP.HCM và Hà Nội:</strong> 1-2 ngày làm việc
          </Paragraph>
          <Paragraph>
            • <strong>Các tỉnh thành khác:</strong> 2-5 ngày làm việc
          </Paragraph>
          <Paragraph>
            • <strong>Vùng sâu, vùng xa:</strong> 5-7 ngày làm việc
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={styles.sectionTitle}>
            <DollarOutlined style={styles.icon} />
            Hình Thức Thanh Toán
          </Title>
          <Paragraph>
            • <strong>Thanh toán khi nhận hàng (COD):</strong> Miễn phí
          </Paragraph>
          <Paragraph>
            • <strong>Chuyển khoản ngân hàng:</strong> Giảm 10.000 VNĐ phí vận chuyển
          </Paragraph>
          <Paragraph>
            • <strong>Ví điện tử (VNPay, MoMo):</strong> Giảm 10.000 VNĐ phí vận chuyển
          </Paragraph>
        </Card>

        <Card style={styles.card}>
          <Title level={3} style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '16px' }}>
            Lưu Ý Quan Trọng
          </Title>
          <Paragraph>
            • Thời gian giao hàng có thể bị ảnh hưởng bởi điều kiện thời tiết và các yếu tố khách quan khác.
          </Paragraph>
          <Paragraph>
            • Khách hàng vui lòng kiểm tra kỹ sản phẩm trước khi nhận hàng.
          </Paragraph>
          <Paragraph>
            • Trong trường hợp không nhận được hàng sau thời gian quy định, vui lòng liên hệ hotline: <strong>0123 456 789</strong>
          </Paragraph>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default ShippingPolicyPage;