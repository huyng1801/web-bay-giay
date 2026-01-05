import React from 'react';
import { Form, Select, InputNumber, Button, Space, message } from 'antd';

const { Option } = Select;

const ProductDetailsForm = ({
  form,
  onSubmit,
  loading = false,
  availableColors = [],
  availableSizes = [],
  existingDetails = []
}) => {
  
  // Filter out colors and sizes that already exist
  const getFilteredColors = () => {
    const existingColorIds = existingDetails.map(detail => detail.color?.colorId);
    return availableColors.filter(color => !existingColorIds.includes(color.colorId));
  };

  const getFilteredSizes = (selectedColorId) => {
    if (!selectedColorId) return availableSizes;
    
    const existingWithSameColor = existingDetails.filter(
      detail => detail.color?.colorId === selectedColorId
    );
    const existingSizeIds = existingWithSameColor.map(detail => detail.size?.sizeId);
    return availableSizes.filter(size => !existingSizeIds.includes(size.sizeId));
  };
  
  // Check if combination already exists
  const isExistingCombination = (colorId, sizeId) => {
    return existingDetails.some(
      detail => detail.color?.colorId === colorId && detail.size?.sizeId === sizeId
    );
  };

  const selectedColorId = Form.useWatch('colorId', form);
  const selectedSizeId = Form.useWatch('sizeId', form);

  const handleFormSubmit = (values) => {
    // Final validation before submit
    if (isExistingCombination(values.colorId, values.sizeId)) {
      message.error('Tổ hợp màu sắc và kích thước này đã tồn tại!');
      return;
    }
    onSubmit(values);
  };

  return (
    <div style={{ 
      backgroundColor: '#f0f9ff', 
      padding: '16px', 
      borderRadius: '8px' 
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#1890ff' }}>
        Thêm chi tiết sản phẩm mới
      </h3>
      
      <Form 
        form={form} 
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <Form.Item
            name="colorId"
            label="Màu sắc"
            rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
          >
            <Select 
              placeholder="Chọn màu sắc"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {getFilteredColors().map(color => (
                <Option key={color.colorId} value={color.colorId}>
                  {color.colorName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="sizeId"
            label="Kích cỡ"
            rules={[{ required: true, message: 'Vui lòng chọn kích cỡ!' }]}
            validateStatus={selectedSizeId && isExistingCombination(selectedColorId, selectedSizeId) ? 'error' : ''}
            help={selectedSizeId && isExistingCombination(selectedColorId, selectedSizeId) ? 'Tổ hợp này đã tồn tại!' : ''}
          >
            <Select 
              placeholder="Chọn kích cỡ"
              allowClear
              disabled={!selectedColorId}
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {getFilteredSizes(selectedColorId).map(size => (
                <Option key={size.sizeId} value={size.sizeId}>
                  {size.sizeValue}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="stockQuantity"
            label="Số lượng tồn kho"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng!' },
              { type: 'number', min: 0, message: 'Số lượng phải >= 0!' }
            ]}
          >
            <InputNumber 
              min={0}
              placeholder="Nhập số lượng"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={getFilteredColors().length === 0}
            >
              Thêm chi tiết
            </Button>
          </Form.Item>
        </div>
      </Form>

      {getFilteredColors().length === 0 && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px 12px', 
          backgroundColor: '#fff7e6', 
          border: '1px solid #ffd591',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#d48806'
        }}>
          💡 Tất cả màu sắc đã được thêm cho sản phẩm này
        </div>
      )}
      
      {selectedColorId && getFilteredSizes(selectedColorId).length === 0 && (
        <div style={{ 
          marginTop: '8px', 
          padding: '8px 12px', 
          backgroundColor: '#fff2e8', 
          border: '1px solid #ffbb96',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#d4380d'
        }}>
          ⚠️ Tất cả kích cỡ đã được thêm cho màu này
        </div>
      )}
    </div>
  );
};

export default ProductDetailsForm;