import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Row,
  Col,
  Tag
} from 'antd';
import { 
  EditOutlined, 
  PoweroffOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import AdminUserService from '../../services/admin/AdminUserService';

const { Option } = Select;
const { Search } = Input;

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [form] = Form.useForm();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await AdminUserService.getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      message.error('Không thể tải danh sách nhân viên!');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search text and filters
  useEffect(() => {
    let filtered = users;

    // Search by name, email, phone
    if (searchText) {
      filtered = filtered.filter(user =>
        user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== '') {
      filtered = filtered.filter(user => user.isActive === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchText, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle create/update user
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingUser) {
        await AdminUserService.updateUser(editingUser.adminUserId, values);
        message.success('Cập nhật nhân viên thành công!');
      } else {
        await AdminUserService.createUser(values);
        message.success('Thêm nhân viên thành công!');
      }
      
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(editingUser ? 'Cập nhật thất bại!' : 'Thêm nhân viên thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle user status
  const handleToggleStatus = async (userId) => {
    setLoading(true);
    try {
      await AdminUserService.toggleUserStatus(userId);
      message.success('Cập nhật trạng thái thành công!');
      fetchUsers();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive
    });
    setModalVisible(true);
  };

  // Table columns
  const columns = [
        {
      title: 'Mã nhân viên',
      dataIndex: 'adminUserId',
      key: 'adminUserId',
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
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleConfig = {
          'ADMIN': 'Quản trị viên',
          'EMPLOYEE': 'Nhân viên'
        };
        return roleConfig[role] || role;
      },
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
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Button
            type="link"
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleStatus(record.adminUserId)}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            title={record.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          />
        </span>
      ),
    },
  ];

  const openAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  return (
    <>
      {/* Search and Filter Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Button 
            type="primary" 
            onClick={openAddModal}
          >
            Thêm Nhân Viên
          </Button>
        </Col>
        <Col xs={24} sm={12} md={16} style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Search
            placeholder="Tìm kiếm nhân viên (tên, email, SĐT)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 280 }}
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 160 }}
          >
            <Option value="">Tất cả vai trò</Option>
            <Option value="ADMIN">Quản trị viên</Option>
            <Option value="EMPLOYEE">Nhân viên</Option>
          </Select>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
          >
            <Option value="">Tất cả trạng thái</Option>
            <Option value={true}>Hoạt động</Option>
            <Option value={false}>Vô hiệu hóa</Option>
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="adminUserId"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* Modal thêm/sửa nhân viên */}
      <Modal
  okText="Lưu"
  cancelText="Hủy"
        title={editingUser ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
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
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { 
                pattern: /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
                message: 'Số điện thoại không hợp lệ! Vui lòng nhập đúng định dạng Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)'
              }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />}
              placeholder="Nhập số điện thoại (VD: 0987654321)" 
            />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="ADMIN">Quản trị viên</Option>
              <Option value="EMPLOYEE">Nhân viên</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Vô hiệu hóa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminUserList;
