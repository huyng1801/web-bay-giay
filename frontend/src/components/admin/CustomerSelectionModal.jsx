import React, { useState, useEffect } from 'react';
import { Modal, Table, Input, Space, Button } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const CustomerSelectionModal = ({
  visible,
  customers,
  onSelect,
  onCancel,
  loading,
  onOpen
}) => {
  const [searchText, setSearchText] = useState('');

  // Load data when modal opens and reset search when modal closes
  useEffect(() => {
    if (visible && onOpen) {
      onOpen();
    } else if (!visible) {
      // Reset search text when modal closes
      setSearchText('');
    }
  }, [visible, onOpen]);

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => 
    customer.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone?.includes(searchText) ||
    customer.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => (
        <Space>
          <UserOutlined />
          <span style={{ fontWeight: 'bold' }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <span style={{ color: '#1890ff' }}>{text}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'Chưa có',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => text || 'Chưa có',
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => onSelect(record)}
        >
          Chọn
        </Button>
      ),
    },
  ];

  return (
    <Modal
  okText="Lưu"
  cancelText="Hủy"
      title="Chọn khách hàng"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey="customerId"
        loading={loading}
        pagination={{
          pageSize: 10,

        }}
        scroll={{ y: 400 }}
        size="small"
      />
    </Modal>
  );
};

export default CustomerSelectionModal;