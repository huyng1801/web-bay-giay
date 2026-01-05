import React from 'react';
import { Modal, Select, Empty } from 'antd';

const { Option } = Select;

const ProductSelectionModal = ({
  visible,
  selectedProduct,
  productDetails,
  selectedDetail,
  onDetailChange,
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
      maxWidth: 240, 
      height: 'auto',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    selectContainer: {
      marginTop: '16px'
    },
    selectLabel: {
      fontWeight: 500, 
      fontSize: 15, 
      marginBottom: 8
    },
    detailSelect: {
      width: '100%'
    },
    summaryBox: {
      marginTop: 24, 
      background: '#fffbe6', 
      borderRadius: 8, 
      padding: 12, 
      textAlign: 'center', 
      fontSize: 14
    }
  };

  // Group details by color for better UX
  const groupedDetails = productDetails.reduce((acc, detail) => {
    const colorName = detail.color?.colorName || 'Không xác định';
    if (!acc[colorName]) {
      acc[colorName] = [];
    }
    acc[colorName].push(detail);
    return acc;
  }, {});

  // Get selected detail object
  const getSelectedDetailObj = () => {
    if (!selectedDetail || !productDetails.length) return null;
    return productDetails.find(d => d.productDetailsId === selectedDetail);
  };

  const selectedDetailObj = getSelectedDetailObj();

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
      width={600}
      destroyOnClose
    >
      <div style={styles.selectContainer}>
        <div style={styles.selectLabel}>Chọn màu sắc và kích thước</div>
        <Select
          placeholder="Chọn màu sắc và kích thước"
          value={selectedDetail}
          onChange={onDetailChange}
          style={styles.detailSelect}
          showSearch
          optionFilterProp="children"
          notFoundContent={<Empty description="Không có sản phẩm nào" />}
        >
          {Object.entries(groupedDetails).map(([colorName, details]) => (
            <Select.OptGroup key={colorName} label={`Màu: ${colorName}`}>
              {details.map((detail) => (
                <Option 
                  key={detail.productDetailsId} 
                  value={detail.productDetailsId}
                  disabled={!detail.isActive || detail.stockQuantity <= 0}
                >
                  <span style={{ fontWeight: 500 }}>
                    {detail.color?.colorName} - Size {detail.size?.sizeValue}
                  </span>
                  <span style={{ 
                    marginLeft: 8, 
                    color: detail.stockQuantity > 10 ? '#52c41a' : detail.stockQuantity > 0 ? '#faad14' : '#ff4d4f',
                    fontSize: 12
                  }}>
                    {detail.stockQuantity > 0 ? `(Còn: ${detail.stockQuantity})` : '(Hết hàng)'}
                  </span>
                </Option>
              ))}
            </Select.OptGroup>
          ))}
        </Select>
      </div>

      {/* Product Image Preview */}
      {selectedProduct?.imageUrl && (
        <div style={styles.imageContainer}>
          <img 
            src={selectedProduct.imageUrl} 
            alt="Product Preview"
            style={styles.productImage}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Selection Summary */}
      {selectedDetailObj && (
        <div style={styles.summaryBox}>
          <span>Đã chọn: </span>
          <span style={{ fontWeight: 600 }}>
            Màu {selectedDetailObj.color?.colorName} | Size {selectedDetailObj.size?.sizeValue}
          </span>
          <span style={{ 
            marginLeft: 8,
            color: selectedDetailObj.stockQuantity > 10 ? '#52c41a' : '#faad14'
          }}>
            (Còn {selectedDetailObj.stockQuantity} sản phẩm)
          </span>
        </div>
      )}
    </Modal>
  );
};

export default ProductSelectionModal;