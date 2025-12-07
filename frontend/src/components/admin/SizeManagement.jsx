import React from 'react';
import { Form, Input, AutoComplete, Button, Table, Tag } from 'antd';
import { PoweroffOutlined, DeleteOutlined } from '@ant-design/icons';

const SizeManagement = ({
  form,
  dataSource,
  onAddSize,
  onToggleStatus,
  onDeleteSize,
  loading = false,
  availableSizes = []
}) => {
  const columns = [
    {
      title: 'Kích thước',
      dataIndex: 'sizeValue',
      key: 'sizeValue',
      width: 100,
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      width: 150,
      render: (stockQuantity) => (
        <span style={{ fontWeight: 500 }}>
          {stockQuantity?.toLocaleString() || 0}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
           render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="link" 
            size="small"
            icon={<PoweroffOutlined />}
            onClick={() => onToggleStatus(record.productSizeId)}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
          />
          <Button 
            type="link" 
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => onDeleteSize(record.productSizeId)}
            danger
            title="Xóa kích thước"
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '16px' 
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1890ff' }}>Quản lý kích thước</h3>
        <Form form={form} layout="vertical">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
            <Form.Item
              name="sizeValue"
              label="Kích thước"
              style={{ flex: 1 }}
              rules={[{ required: true, message: 'Vui lòng chọn kích thước!' }]}
            >
              <AutoComplete
                placeholder="Nhập hoặc chọn kích thước"
                options={availableSizes.map(size => ({
                  value: size.sizeValue,
                  label: size.sizeValue
                }))}
                filterOption={(inputValue, option) =>
                  option?.label?.toString().includes(inputValue)
                }
                allowClear
                showSearch
              />
            </Form.Item>
            
            <Form.Item
              name="stockQuantity"
              label="Số lượng tồn kho"
              style={{ flex: 1 }}
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng!' },
                { pattern: /^\d+$/, message: 'Số lượng phải là số nguyên dương!' }
              ]}
            >
              <Input type="number" min={0} placeholder="Nhập số lượng" />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                onClick={onAddSize} 
                loading={loading}
              >
                Thêm kích thước
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      <h4 style={{ marginBottom: '12px' }}>Danh sách kích thước</h4>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="productSizeId"
        pagination={false}
        size="small"
        bordered
        loading={loading}
        locale={{ emptyText: 'Chưa có kích thước nào' }}
      />
    </div>
  );
};

export default SizeManagement;