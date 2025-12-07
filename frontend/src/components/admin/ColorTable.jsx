import React from 'react';
import { Table, Button, Tag } from 'antd';
import { EditOutlined, PoweroffOutlined, DeleteOutlined } from '@ant-design/icons';

const ColorTable = ({
  dataSource,
  selectedColorId,
  onColorSelect,
  onEditColor,
  onToggleStatus,
  onDeleteColor,
  loading = false
}) => {
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (imageUrl) => 
        imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Màu sắc" 
            style={{ 
              width: 50, 
              height: 50, 
              objectFit: 'cover', 
              borderRadius: 4,
              border: '1px solid #f0f0f0'
            }} 
          />
        ) : (
          <div style={{ 
            width: 50, 
            height: 50, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#f5f5f5', 
            borderRadius: 4,
            fontSize: '12px',
            color: '#999'
          }}>
            Không có ảnh
          </div>
        )
    },
    {
      title: 'Màu sắc',
      dataIndex: 'colorName',
      key: 'colorName',
      render: (colorName, record) => (
        <Button 
          type="link" 
          onClick={() => onColorSelect(record.productColorId)}
          style={{ 
            color: selectedColorId === record.productColorId ? '#1890ff' : '#595959',
            fontWeight: selectedColorId === record.productColorId ? 'bold' : 'normal',
            padding: 0
          }}
        >
          {colorName}
        </Button>
      ),
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
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditColor(record)}
            title="Chỉnh sửa màu"
          />
          <Button 
            type="link" 
            size="small"
            icon={<PoweroffOutlined />}
            onClick={() => onToggleStatus(record.productColorId)}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
          />
          <Button 
            type="link" 
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => onDeleteColor(record.productColorId)}
            danger
            title="Xóa màu"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <h4 style={{ marginBottom: '12px' }}>Danh sách màu sắc</h4>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="productColorId"
        pagination={false}
        size="small"
        bordered
        loading={loading}
        locale={{ emptyText: 'Chưa có màu sắc nào' }}
      />
    </>
  );
};

export default ColorTable;