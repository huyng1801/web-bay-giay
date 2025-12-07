import React from 'react';
import { Modal, Form, AutoComplete, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const EditColorModal = ({
  visible,
  form,
  editingColor,
  onOk,
  onCancel,
  loading = false,
  availableColors = []
}) => {
  return (
    <Modal
      title="Chỉnh sửa màu sắc"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Cập nhật"
      cancelText="Hủy"
      width={500}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="colorName"
          label="Tên màu"
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

        {editingColor?.imageUrl && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ marginBottom: 8, fontWeight: 500 }}>Hình ảnh hiện tại:</p>
            <img 
              src={editingColor.imageUrl} 
              alt="Hình ảnh hiện tại" 
              style={{ 
                width: 120, 
                height: 120, 
                objectFit: 'cover', 
                borderRadius: 8,
                border: '1px solid #f0f0f0'
              }} 
            />
          </div>
        )}

        <Form.Item
          name="imageFile"
          label="Hình ảnh màu mới (để trống nếu không muốn thay đổi)"
          valuePropName="fileList"
          getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh mới</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditColorModal;