import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Tag, Select } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import CustomerService from '../../services/admin/CustomerService';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await CustomerService.getAllCustomers();
      setCustomers(response);
    } catch {
      message.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await CustomerService.deleteCustomer(customerId);
      message.success('Xóa khách hàng thành công');
      loadCustomers();
    } catch {
      message.error('Không thể xóa khách hàng');
    }
  };

  const handleToggleStatus = async (customerId, currentStatus) => {
    try {
      await CustomerService.toggleCustomerStatus(customerId);
      message.success(`${currentStatus ? 'Vô hiệu hóa' : 'Kích hoạt'} khách hàng thành công`);
      loadCustomers();
    } catch {
      message.error('Không thể thay đổi trạng thái khách hàng');
    }
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setIsModalVisible(true);
    form.resetFields();
    // Set default password for new customer
    form.setFieldsValue({
      hashPassword: '12345678'
    });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...customer,
      createdAt: customer.createdAt ? moment(customer.createdAt) : null,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCustomer(null);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoadingButton(true);
      

      
      const customerData = {
        ...values,
        // Set default password for new customers if not provided
        hashPassword: values.hashPassword || '12345678'
      };
      
      if (editingCustomer) {
        await CustomerService.updateCustomer(editingCustomer.customerId, customerData);
        message.success('Cập nhật khách hàng thành công');
      } else {
        await CustomerService.createCustomer(customerData);
        message.success('Thêm khách hàng thành công');
      }
      setIsModalVisible(false);
      setEditingCustomer(null);
      form.resetFields();
      loadCustomers();
    } catch (error) {
      console.log("Error:", error);
      const errorMessage = error?.errorFields?.[0]?.errors?.[0] ||
        (editingCustomer ? "Lỗi khi cập nhật khách hàng" : "Lỗi khi tạo khách hàng");
      message.error(errorMessage);
    } finally {
      setLoadingButton(false);
    }
  };

  const columns = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 80,
      sorter: (a, b) => a.customerId - b.customerId,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Tag color="blue">{email}</Tag>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || 'Chưa có',
    },
    {
      title: 'Địa chỉ chính',
      dataIndex: 'address',
      key: 'address',
      render: (address) => address || 'Chưa có',
      ellipsis: true,
    },
    {
      title: 'Địa chỉ phụ',
      dataIndex: 'address2',
      key: 'address2',
      render: (address2) => address2 || 'Chưa có',
      ellipsis: true,
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
      render: (city) => city || 'Chưa có',
    },
    {
      title: 'Xác thực email',
      dataIndex: 'emailConfirmed',
      key: 'emailConfirmed',
      render: (confirmed) => (
        <Tag color={confirmed ? 'green' : 'orange'}>
          {confirmed ? 'Đã xác thực' : 'Chưa xác thực'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : 'N/A',
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
      width: 130,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="link"
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleStatus(record.customerId, record.isActive)}
            title={record.isActive ? "Ngừng hoạt động" : "Kích hoạt"}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khách hàng này?"
            onConfirm={() => handleDelete(record.customerId)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu
  const filteredCustomers = customers.filter(customer => {
    const matchName = customer.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
                     customer.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                     customer.phone?.includes(searchText);
    const matchStatus = statusFilter === "all" || 
                       (statusFilter === "active" && customer.isActive) || 
                       (statusFilter === "inactive" && !customer.isActive);
    return matchName && matchStatus;
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Thêm Khách Hàng
        </Button>
        <div style={{ display: 'flex', gap: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm tên, email, số điện thoại..."
            allowClear
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 280 }}
          />
          <Select
            value={statusFilter}
            onChange={value => setStatusFilter(value)}
            style={{ width: 160 }}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Ngừng hoạt động</Option>
          </Select>
        </div>
      </div>

      <Table
        dataSource={filteredCustomers}
        columns={columns}
        rowKey="customerId"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        okText="Lưu"
        cancelText="Hủy"
        title={editingCustomer ? "Chỉnh sửa Khách Hàng" : "Thêm Khách Hàng"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loadingButton}
        width={600}
        bodyStyle={{ padding: '16px' }}
      >
        <Form
          form={form}
          layout="vertical"
          name="customerForm"
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 số!' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ chính"
          >
            <TextArea 
              rows={2} 
              placeholder="Nhập địa chỉ chính" 
            />
          </Form.Item>

          <Form.Item
            name="address2"
            label="Địa chỉ phụ (tùy chọn)"
          >
            <Input placeholder="Nhập địa chỉ phụ (nếu có)" />
          </Form.Item>

          <Form.Item
            name="city"
            label="Thành phố"
          >
            <Input placeholder="Nhập thành phố" />
          </Form.Item>

          {!editingCustomer && (
            <Form.Item
              name="hashPassword"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
              ]}
              help="Mật khẩu mặc định: 12345678"
            >
              <Input.Password placeholder="Mật khẩu mặc định: 12345678" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default CustomerList;
