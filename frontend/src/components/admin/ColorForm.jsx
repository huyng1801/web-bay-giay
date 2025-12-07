import React from 'react';
import { Form, AutoComplete, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ColorForm = ({ 
  form, 
  onSubmit, 
  loading = false,
  submitButtonText = "Thêm màu",
  availableColors = []
}) => {
  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '16px', 
      borderRadius: '8px', 
      marginBottom: '16px' 
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#1890ff' }}>Thêm màu cho sản phẩm</h3>
      <Form form={form} layout="vertical">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
          <Form.Item
            name="colorName"
            label="Tên màu"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Vui lòng chọn màu!' }]}
          >
            <AutoComplete
              placeholder="Nhập hoặc chọn màu sắc"
              options={availableColors.map(color => ({
                value: color.colorName,
                label: color.colorName
              }))}
              filterOption={(inputValue, option) =>
                option?.label?.toLowerCase().includes(inputValue.toLowerCase())
              }
              allowClear
              showSearch
            />
          </Form.Item>

          <Form.Item
            name="imageFile"
            label="Hình ảnh màu"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              onClick={onSubmit} 
              loading={loading}
            >
              {submitButtonText}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ColorForm;