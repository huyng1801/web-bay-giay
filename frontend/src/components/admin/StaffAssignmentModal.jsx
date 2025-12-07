import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Tag, Typography, Space, message, Card, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AdminUserService from '../../services/admin/AdminUserService';

const { Title, Text } = Typography;
const { Option } = Select;

const StaffAssignmentModal = ({
  visible,
  onCancel,
  selectedOrder,
  onAssignStaff
}) => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadStaffList();
      // Set current assigned staff as selected
      setSelectedStaffId(selectedOrder?.assignedStaffId || null);
    }
  }, [visible, selectedOrder]);

  const loadStaffList = async () => {
    try {
      setLoading(true);
      // AdminUserService is exported as an instance, not a class
      const users = await AdminUserService.getAllUsers();
      setStaffList(users || []);
    } catch (error) {
      console.error('Error loading staff list:', error);
      message.error('Lỗi khi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    try {
      setSubmitting(true);
      await onAssignStaff(selectedOrder.orderId, selectedStaffId);
      
      const staffName = selectedStaffId 
        ? staffList.find(s => s.adminUserId === selectedStaffId)?.fullName || 'Unknown'
        : null;
      
      if (selectedStaffId) {
        message.success(`Đã gán nhân viên: ${staffName}`);
      } else {
        message.success('Đã bỏ gán nhân viên');
      }
      
      onCancel();
    } catch (error) {
      console.error('Error assigning staff:', error);
      message.error('Lỗi khi gán nhân viên');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedStaffId(selectedOrder?.assignedStaffId || null);
    onCancel();
  };

  return (
    <Modal
  okText="Lưu"
  cancelText="Hủy"
      title="Gán nhân viên phụ trách"
      visible={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={submitting}
          onClick={handleAssign}
        >
          {selectedStaffId ? 'Gán nhân viên' : 'Bỏ gán nhân viên'}
        </Button>
      ]}
    >
      {selectedOrder && (
        <div style={{ padding: 8 }}>
          <Card bordered={false} style={{ marginBottom: 16, boxShadow: '0 2px 8px #f0f1f2' }}>
            <Row gutter={[16, 8]} align="middle">
              <Col span={12}>
                <Title level={5} style={{ marginBottom: 8 }}>Thông tin đơn hàng</Title>
                <Text strong>Mã đơn hàng: </Text>
                <Text code>{selectedOrder.orderId}</Text>
                <br />
                <Text strong>Khách hàng: </Text>
                <Text>{selectedOrder.customerName || selectedOrder.guestName || 'N/A'}</Text>
                <br />
                <Text strong>Loại đơn hàng: </Text>
                {selectedOrder.guestName ? (
                  <Tag color="blue" icon={<UserOutlined />}>🏪 Bán tại quầy</Tag>
                ) : (
                  <Tag color="green">🌐 Bán online</Tag>
                )}
              </Col>
              <Col span={12}>
                <Title level={5} style={{ marginBottom: 8 }}>Nhân viên hiện tại</Title>
                {selectedOrder.assignedStaffName ? (
                  <Card size="small" style={{ background: '#f0f9ff', borderRadius: 8, border: '1px solid #d1ecf1', marginBottom: 0 }}>
                    <Space align="center">
                      <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                      <Text strong>{selectedOrder.assignedStaffName}</Text>
                    </Space>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                      📧 {selectedOrder.assignedStaffEmail}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      🆔 {selectedOrder.assignedStaffId}
                    </div>
                  </Card>
                ) : (
                  <Card size="small" style={{ background: '#fff7e6', borderRadius: 8, border: '1px solid #ffd591', marginBottom: 0 }}>
                    <Text type="secondary">⚠️ Chưa có nhân viên được gán</Text>
                  </Card>
                )}
              </Col>
            </Row>
          </Card>

          <Card bordered={false} style={{ boxShadow: '0 2px 8px #f0f1f2' }}>
            <Title level={5} style={{ marginBottom: 8 }}>Chọn nhân viên mới</Title>
            <Select
              placeholder="Tìm kiếm và chọn nhân viên..."
              style={{ width: '100%' }}
              loading={loading}
              value={selectedStaffId}
              onChange={setSelectedStaffId}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {staffList.map(staff => (
                <Option key={staff.adminUserId} value={staff.adminUserId}>
                  <Space>
                    <Avatar size={20} style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                    <span style={{ fontWeight: 500 }}>{staff.fullName}</span>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      ({staff.email})
                    </Text>
                  </Space>
                </Option>
              ))}
            </Select>
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              💡 Tip: Bỏ trống để không gán nhân viên nào
            </div>
          </Card>
        </div>
      )}
    </Modal>
  );
};

export default StaffAssignmentModal;