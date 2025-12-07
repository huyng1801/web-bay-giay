import React from 'react';
import { Modal, Row, Col, Form, Select } from 'antd';

const { Option } = Select;

const ProductSelectionModal = ({
  visible,
  selectedProduct,
  productColors,
  productSizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  onCancel,
  onOk
}) => {
  // Inline styles
  const styles = {
    modal: {
      width: 600
    },
    formItem: {
      marginBottom: '16px'
    },
    imageContainer: {
      marginTop: '16px',
      textAlign: 'center'
    },
    productImage: {
      width: '100%', 
      maxWidth: 200, 
      height: 'auto',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    colorSelect: {
      width: '100%'
    },
    sizeSelect: {
      width: '100%'
    }
  };

  // Get selected color image
  const getSelectedColorImage = () => {
    if (!selectedColor || !productColors.length) return null;
    const color = productColors.find(c => c.productColorId === selectedColor);
    return color?.imageUrl;
  };

  return (
    <Modal
      title={
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          {selectedProduct?.productName}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText="Thêm vào giỏ"
      cancelText="Hủy"
      style={styles.modal}
      destroyOnClose
    >


      <Row gutter={24} style={{ marginBottom: 8 }}>
        <Col span={12}>
          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 8 }}>Chọn màu sắc</div>
          <Select
            placeholder="Chọn màu sắc"
            value={selectedColor}
            onChange={onColorChange}
            style={styles.colorSelect}
          >
            {productColors.map((color) => (
              <Option key={color.productColorId} value={color.productColorId}>
                {color.colorName}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 8 }}>Chọn size</div>
          <Select
            placeholder="Chọn size"
            value={selectedSize}
            onChange={onSizeChange}
            style={styles.sizeSelect}
            disabled={!selectedColor}
          >
            {productSizes.map((size) => (
              <Option 
                key={size.productSizeId} 
                value={size.productSizeId}
                disabled={size.stockQuantity <= 0}
              >
                {size.sizeValue} (Còn: {size.stockQuantity})
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {/* Product Image Preview */}
      {selectedColor && getSelectedColorImage() && (
        <div style={{ ...styles.imageContainer, marginTop: 24 }}>
          <img 
            src={getSelectedColorImage()} 
            alt="Product Preview"
            style={{ ...styles.productImage, maxWidth: 240 }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Selection Summary */}
      {(selectedColor || selectedSize) && (
        <div style={{ marginTop: 24, background: '#fffbe6', borderRadius: 8, padding: 12, textAlign: 'center', fontSize: 14 }}>
          <span>Đã chọn: </span>
          {selectedColor && <span>Màu {productColors.find(c => c.productColorId === selectedColor)?.colorName}</span>}
          {selectedColor && selectedSize && <span> | </span>}
          {selectedSize && <span>Size {productSizes.find(s => s.productSizeId === selectedSize)?.sizeValue}</span>}
        </div>
      )}
    </Modal>
  );
};

export default ProductSelectionModal;