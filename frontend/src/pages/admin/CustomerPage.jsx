import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Row,
  Col,
  Tooltip,
  Space,
  Select,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import CustomerService from '../../services/admin/CustomerService';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      message.error('Không thể tải danh sách khách hàng');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search text and status
  const filteredCustomers = customers.filter(customer => {
    const matchText = customer.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.phone?.includes(searchText) ||
      customer.city?.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && customer.isActive) ||
      (statusFilter === 'inactive' && !customer.isActive);
    return matchText && matchStatus;
  });

  // Handle create/update customer
  const handleSubmit = async (values) => {
    try {
      if (editingCustomer) {
        await CustomerService.updateCustomer(editingCustomer.customerId, values);
        message.success('Cập nhật khách hàng thành công!');
      } else {
        await CustomerService.createCustomer(values);
        message.success('Thêm khách hàng thành công!');
      }
      
      setIsModalVisible(false);
      setEditingCustomer(null);
      form.resetFields();
      await fetchCustomers();
    } catch (error) {
      message.error(error);
      console.error('Error saving customer:', error);
    }
  };

  // Open modal for create/edit
  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
    
    if (customer) {
      form.setFieldsValue({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city
        // Don't set hashPassword - leave it empty for optional update
      });
    } else {
      form.resetFields();
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingCustomer(null);
    form.resetFields();
  };

  // Toggle customer status
  const handleToggleStatus = async (customerId, currentStatus) => {
    try {
      await CustomerService.toggleCustomerStatus(customerId);
      message.success(`Đã ${currentStatus ? 'ngừng hoạt động' : 'kích hoạt'} khách hàng thành công`);
      await fetchCustomers();
    } catch (error) {
      console.error('Error toggling customer status:', error);
      
      // Handle specific error responses
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data;
        if (typeof errorMessage === 'string') {
          message.warning(errorMessage);
        } else {
          message.error('Không thể thay đổi trạng thái khách hàng');
        }
      } else {
        message.error('Lỗi kết nối. Vui lòng thử lại sau!');
      }
    }
  };



  // Table columns
  const columns = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 150,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} style={{ minWidth: 90, textAlign: 'center' }}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            style={{ fontSize: 18 }}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            shape="circle"
            icon={<PoweroffOutlined style={{ color: record.isActive ? '#ff4d4f' : '#52c41a', fontSize: 16 }} />}
            onClick={() => handleToggleStatus(record.customerId, record.isActive)}
            style={{
              background: 'transparent',
              boxShadow: 'none',
              border: 'none',
              marginLeft: 4,
              outline: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
          />
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>


          {/* Search and Add Button */}
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col xs={24} sm={12} md={8}>
              <Button
                type="primary"
                onClick={() => openModal()}
                style={{ borderRadius: 8, fontWeight: 500 }}
              >
                Thêm khách hàng
              </Button>
            </Col>
            <Col xs={24} sm={12} md={16} style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
              <Input.Search
                placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc thành phố"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ borderRadius: 8, border: '1px solid #d9d9d9', boxShadow: 'none', width: 280 }}
              />
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                style={{ borderRadius: 8, width: 160 }}
              >
                <Select.Option value="all">Tất cả trạng thái</Select.Option>
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
              </Select>
            </Col>
          </Row>

          {/* Customers Table */}
          <Table
            columns={columns}
            dataSource={filteredCustomers}
            loading={loading}
            rowKey="customerId"
            pagination={{ pageSize: 8 }}
           
          />
 

        {/* Create/Edit Modal */}
        <Modal
  okText="Lưu"
  cancelText="Hủy"
          title={editingCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
          open={isModalVisible}
          onCancel={closeModal}
          footer={null}
          width={600}
          style={{ borderRadius: 12 }}
          bodyStyle={{ borderRadius: 12, padding: 24 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: 'Vui lòng nhập họ và tên!' },
                    { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" style={{ borderRadius: 8 }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        
                        // Check if email already exists
                        const existingCustomer = await CustomerService.getCustomerByEmail(value);
                        
                        // If editing, allow same email as current customer
                        if (editingCustomer && existingCustomer && existingCustomer.customerId === editingCustomer.customerId) {
                          return Promise.resolve();
                        }
                        
                        if (existingCustomer) {
                          return Promise.reject(new Error('Email này đã được sử dụng!'));
                        }
                        
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input placeholder="Nhập email" style={{ borderRadius: 8 }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
                    {
                      validator: async (_, value) => {
                        if (!value) return Promise.resolve();
                        
                        // Check if phone already exists
                        const existingCustomer = await CustomerService.getCustomerByPhone(value);
                        
                        // If editing, allow same phone as current customer
                        if (editingCustomer && existingCustomer && existingCustomer.customerId === editingCustomer.customerId) {
                          return Promise.resolve();
                        }
                        
                        if (existingCustomer) {
                          return Promise.reject(new Error('Số điện thoại này đã được sử dụng!'));
                        }
                        
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" style={{ borderRadius: 8 }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Thành phố"
                  name="city"
                  rules={[
                    { required: true, message: 'Vui lòng chọn thành phố!' }
                  ]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    style={{ borderRadius: 8 }}
                    showSearch
                    filterOption={(input, option) =>
                      option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {[
                      { value: 'hanoi', label: 'Hà Nội' },
                      { value: 'hcm', label: 'TP. Hồ Chí Minh' },
                      { value: 'danang', label: 'Đà Nẵng' },
                    ].map(province => (
                      <Select.Option key={province.value} value={province.value}>
                        {province.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ!' }
                  ]}
                >
                  <Input placeholder="Nhập địa chỉ chi tiết" style={{ borderRadius: 8 }} />
                </Form.Item>
              </Col>
            </Row>

            {editingCustomer && (
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Mật khẩu mới (để trống nếu không thay đổi)"
                    name="hashPassword"
                    rules={[
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu mới (không bắt buộc)" style={{ borderRadius: 8 }} />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Form.Item style={{ marginTop: '24px', marginBottom: 0, textAlign: 'right' }}>
              <Button onClick={closeModal} style={{ marginRight: 8, borderRadius: 8 }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" style={{ borderRadius: 8 }}>
                {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

    </AdminLayout>
  );
};

export default CustomerPage;
