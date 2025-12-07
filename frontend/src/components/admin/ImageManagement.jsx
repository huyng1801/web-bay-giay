import React from 'react';
import { Form, Button, Upload, Table } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const ImageManagement = ({
  form,
  dataSource,
  onAddImage,
  onDeleteImage,
  loading = false
}) => {
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (imageUrl) => (
        <img 
          src={imageUrl} 
          alt="Hình ảnh sản phẩm" 
          style={{ 
            width: 60, 
            height: 60, 
            objectFit: 'cover', 
            borderRadius: 4,
            border: '1px solid #f0f0f0'
          }} 
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          danger 
          icon={<DeleteOutlined />}
          onClick={() => onDeleteImage(record.productColorImageId)}
          title="Xóa hình ảnh"
        >
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ 
        backgroundColor: '#f6ffed', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '16px' 
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#52c41a' }}>Quản lý hình ảnh</h3>
        <Form form={form} layout="vertical">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
            <Form.Item
              name="imageFile"
              label="Hình ảnh sản phẩm"
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
              style={{ flex: 1 }}
            >
              <Upload
                listType="picture"
                beforeUpload={() => false}
                maxCount={10}
                accept="image/*"
                multiple
              >
                <Button icon={<UploadOutlined />}>Chọn hình ảnh (tối đa 10 ảnh)</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                onClick={onAddImage} 
                loading={loading}
              >
                Thêm hình ảnh
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>

      <h4 style={{ marginBottom: '12px' }}>Danh sách hình ảnh</h4>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="productColorImageId"
        pagination={false}
        size="small"
        bordered
        loading={loading}
        locale={{ emptyText: 'Chưa có hình ảnh nào' }}
      />
    </div>
  );
};

export default ImageManagement;