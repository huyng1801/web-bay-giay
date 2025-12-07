import React, { useState, useEffect } from 'react';
import { Modal, Table, InputNumber, Button, message, Tag, Typography, Row, Col, Card, Statistic } from 'antd';
import { SaveOutlined, ReloadOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ProductSizeService from '../../services/admin/ProductSizeService';
import ProductColorService from '../../services/admin/ProductColorService';

const { Text } = Typography;

const ProductStockModal = ({ visible, product, onCancel, onSuccess }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [totalStock, setTotalStock] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  // Load data when modal opens
  useEffect(() => {
    if (product && visible) {
      loadStockData(product.productId);
    }
  }, [product, visible]);

  // Calculate statistics when stock data changes
  useEffect(() => {
    const total = stockData.reduce((sum, item) => sum + (item.stockQuantity || 0), 0);
    const lowStock = stockData.filter(item => (item.stockQuantity || 0) < 10).length;
    setTotalStock(total);
    setLowStockCount(lowStock);
  }, [stockData]);

  const loadStockData = async (productId) => {
    setLoading(true);
    try {
      // Load product colors
      const colorsData = await ProductColorService.getColorsByProductId(productId);

      // Load stock data for each color
      const allStockData = [];
      
      for (const color of colorsData) {
        try {
          const sizesData = await ProductSizeService.findByProductColorId(color.productColorId);
          sizesData.forEach(size => {
            allStockData.push({
              key: `${color.productColorId}-${size.productSizeId}`,
              productColorId: color.productColorId,
              productSizeId: size.productSizeId,
              colorName: color.colorName,
              sizeValue: size.sizeValue,
              stockQuantity: size.stockQuantity || 0,
              originalStock: size.stockQuantity || 0,
              isActive: size.isActive
            });
          });
        } catch (error) {
          console.error(`Error loading sizes for color ${color.productColorId}:`, error);
        }
      }

      setStockData(allStockData);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu tồn kho");
      console.error('Error loading stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (key, newQuantity) => {
    setStockData(prev => 
      prev.map(item => 
        item.key === key 
          ? { ...item, stockQuantity: newQuantity }
          : item
      )
    );
  };

  const handleSaveStock = async () => {
    setSaving(true);
    try {
      const updates = stockData.filter(item => 
        item.stockQuantity !== item.originalStock
      );

      if (updates.length === 0) {
        message.info("Không có thay đổi nào để lưu");
        return;
      }

      // Update each changed stock item
      for (const item of updates) {
        await ProductSizeService.updateStock(item.productSizeId, item.stockQuantity);
      }

      message.success(`Đã cập nhật ${updates.length} mục tồn kho thành công!`);
      
      // Reload data to get fresh state
      await loadStockData(product.productId);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật tồn kho");
      console.error('Error updating stock:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetStock = () => {
    setStockData(prev => 
      prev.map(item => ({
        ...item,
        stockQuantity: item.originalStock
      }))
    );
    message.info("Đã khôi phục về số lượng ban đầu");
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return <Tag color="red">Hết hàng</Tag>;
    } else if (quantity < 10) {
      return <Tag color="orange">Sắp hết</Tag>;
    } else if (quantity < 50) {
      return <Tag color="blue">Bình thường</Tag>;
    } else {
      return <Tag color="green">Còn nhiều</Tag>;
    }
  };

  const columns = [
    {
      title: 'Màu sắc',
      dataIndex: 'colorName',
      key: 'colorName',
      width: 120,
      render: (text, record) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: 'Kích thước',
      dataIndex: 'sizeValue',
      key: 'sizeValue',
      width: 100,
      render: (text) => (
        <Tag color="purple">{text}</Tag>
      ),
    },
    {
      title: 'Số lượng hiện tại',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      width: 150,
      render: (quantity, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <InputNumber
            min={0}
            max={9999}
            value={quantity}
            onChange={(value) => handleStockChange(record.key, value || 0)}
            style={{ width: '80px' }}
            disabled={!record.isActive}
          />
          {getStockStatus(quantity)}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng'}
        </Tag>
      ),
    },
  ];

  const hasChanges = stockData.some(item => item.stockQuantity !== item.originalStock);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  
          Quản lý tồn kho - {product?.productName}
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button 
          key="reset" 
    
          onClick={handleResetStock}
          disabled={!hasChanges}
        >
          Khôi phục
        </Button>,
        <Button
          key="save"
          type="primary"
    
          loading={saving}
          onClick={handleSaveStock}
          disabled={!hasChanges}
        >
          Lưu thay đổi
        </Button>,
      ]}
    >
      {/* Statistics Cards */}
      <Row gutter={12} style={{ marginBottom: '16px' }}>
        <Col span={8}>
          <Card bodyStyle={{ padding: '12px 12px' }} style={{ minHeight: 80 }}>
            <Statistic
              title={<span style={{ fontSize: 13 }}>Tổng tồn kho</span>}
              value={totalStock}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />}
              valueStyle={{ color: '#52c41a', fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bodyStyle={{ padding: '12px 12px' }} style={{ minHeight: 80 }}>
            <Statistic
              title={<span style={{ fontSize: 13 }}>Sắp hết hàng</span>}
              value={lowStockCount}
              prefix={<WarningOutlined style={{ color: '#faad14', fontSize: 16 }} />}
              valueStyle={{ color: lowStockCount > 0 ? '#faad14' : '#52c41a', fontSize: 18 }}
              suffix="mục"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bodyStyle={{ padding: '12px 12px' }} style={{ minHeight: 80 }}>
            <Statistic
              title={<span style={{ fontSize: 13 }}>Tổng biến thể</span>}
              value={stockData.length}
              prefix={<CheckCircleOutlined style={{ color: '#1890ff', fontSize: 16 }} />}
              valueStyle={{ color: '#1890ff', fontSize: 18 }}
              suffix="mục"
            />
          </Card>
        </Col>
      </Row>

      {/* Stock Table */}
      <Table
        columns={columns}
        dataSource={stockData}
        loading={loading}
        pagination={{
          pageSize: 10,

        }}
    
        size="small"
        rowClassName={(record) => 
          record.stockQuantity < 10 ? 'low-stock-row' : ''
        }
      />

      <style jsx global>{`
        .low-stock-row {
          background-color: #fff2e8 !important;
        }
        .low-stock-row:hover {
          background-color: #ffe7ba !important;
        }
      `}</style>
    </Modal>
  );
};

export default ProductStockModal;
