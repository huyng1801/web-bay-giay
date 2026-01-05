import React from 'react';
import { Form, Button, Upload, Table, Image, Tag, Space } from 'antd';
import { UploadOutlined, DeleteOutlined, StarOutlined, StarFilled } from '@ant-design/icons';

const ProductImageManagement = ({
  form,
  dataSource,
  onAddImage,
  onDeleteImage,
  onSetMainImage,
  loading = false
}) => {
  
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 120,
      render: (imageUrl) => (
        <Image 
          src={imageUrl} 
          alt="Hình ảnh sản phẩm" 
          width={80}
          height={80}
          style={{ 
            objectFit: 'cover', 
            borderRadius: 8,
            border: '2px solid #f0f0f0'
          }}
          preview={{
            mask: 'Xem chi tiết'
          }}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isMainImage',
      key: 'isMainImage',
      width: 120,
      render: (isMainImage) => (
        isMainImage ? (
          <Tag color="gold" icon={<StarFilled />}>Hình chính</Tag>
        ) : (
          <Tag color="default">Hình phụ</Tag>
        )
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          {!record.isMainImage && (
            <Button 
              type="link" 
              size="small"
              icon={<StarOutlined />}
              onClick={() => onSetMainImage(record.productImageId)}
              title="Đặt làm hình chính"
              style={{ color: '#faad14' }}
            />
          )}
          <Button 
            type="link" 
            size="small"
            danger 
            icon={<DeleteOutlined />}
            onClick={() => onDeleteImage(record.productImageId)}
            title="Xóa hình ảnh"
            disabled={record.isMainImage && dataSource.length > 1}
          />
        </Space>
      ),
    },
  ];

  const uploadProps = {
    listType: 'picture',
    beforeUpload: () => false, // Prevent auto upload
    maxCount: 10,
    accept: 'image/*',
    multiple: true,
  };

  return (
    <div>
      <div style={{ 
        backgroundColor: '#f6ffed', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '16px' 
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#52c41a' }}>
          Thêm hình ảnh sản phẩm
        </h3>
        
        <Form form={form} layout="vertical" onFinish={onAddImage}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
            <Form.Item
              name="imageFiles"
              label="Chọn hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
              rules={[{ required: true, message: 'Vui lòng chọn ít nhất một hình ảnh!' }]}
              style={{ flex: 1 }}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>
                  Chọn hình ảnh (tối đa 10 ảnh)
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Thêm hình ảnh
              </Button>
            </Form.Item>
          </div>
        </Form>
        
        <div style={{ 
          fontSize: '13px', 
          color: '#666', 
          marginTop: '8px',
          lineHeight: '1.5'
        }}>
          <p style={{ margin: '0 0 4px 0' }}>
            💡 <strong>Hướng dẫn:</strong>
          </p>
          <p style={{ margin: '0 0 2px 0' }}>
            • Hình ảnh đầu tiên sẽ tự động được đặt làm hình chính
          </p>
          <p style={{ margin: '0 0 2px 0' }}>
            • Bạn có thể thay đổi hình chính bằng cách nhấn biểu tượng ⭐
          </p>
          <p style={{ margin: '0' }}>
            • Không thể xóa hình chính khi còn hình ảnh khác
          </p>
        </div>
      </div>

      <h4 style={{ marginBottom: '12px', color: '#262626' }}>
        Danh sách hình ảnh ({dataSource.length})
      </h4>
      
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="productImageId"
        pagination={false}
        size="small"
        bordered
        loading={loading}
        locale={{ emptyText: 'Chưa có hình ảnh nào' }}
        rowClassName={(record) => 
          record.isMainImage ? 'main-image-row' : ''
        }
      />

      <style jsx>{`
        .main-image-row {
          background-color: #fffbf0 !important;
          border: 2px solid #faad14;
        }
      `}</style>
    </div>
  );
};

export default ProductImageManagement;