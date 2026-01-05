import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Button, Table, Tag, Space, message, Card } from 'antd';
import { DeleteOutlined, PoweroffOutlined } from '@ant-design/icons';
import ProductDetailsService from '../../services/admin/ProductDetailsService';
import ColorService from '../../services/admin/ColorService';
import SizeService from '../../services/admin/SizeService';
import ProductDetailsForm from './ProductDetailsForm';

const ProductDetailsModal = ({ visible, product, onCancel, onSuccess }) => {
  // State management
  const [productDetails, setProductDetails] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form instance
  const [detailsForm] = Form.useForm();

  // Helper function to reset all state
  const resetModalState = useCallback(() => {
    setProductDetails([]);
    detailsForm.resetFields();
    setLoading(false);
  }, [detailsForm]);

  // Data loading functions wrapped in useCallback to ensure they don't change
  const loadProductDetails = useCallback(async () => {
    if (!product?.productId) return;
    
    setLoading(true);
    try {
      const response = await ProductDetailsService.getDetailsByProductId(product.productId);
      // Response từ BaseService đã extract data, nên response là array trực tiếp
      const detailsData = Array.isArray(response) ? response : (response?.data || []);
      setProductDetails(detailsData);
    } catch (error) {
      console.error('Error loading product details:', error);
      message.error('Không thể tải chi tiết sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [product?.productId]);

  const loadAvailableColors = useCallback(async () => {
    try {
      const response = await ColorService.getActiveColors();
      // response từ BaseService đã là array (ColorResponse[])
      const colorsData = Array.isArray(response) ? response : (response?.data || []);
      setAvailableColors(colorsData);
    } catch (error) {
      console.error('Error loading colors:', error);
      message.error('Không thể tải danh sách màu sắc');
    }
  }, []);

  const loadAvailableSizes = useCallback(async () => {
    try {
      const response = await SizeService.getActiveSizes();
      // response từ BaseService đã là array (SizeResponse[])
      const sizesData = Array.isArray(response) ? response : (response?.data || []);
      setAvailableSizes(sizesData);
    } catch (error) {
      console.error('Error loading sizes:', error);
      message.error('Không thể tải danh sách kích cỡ');
    }
  }, []);

  // Load initial data when product changes
  useEffect(() => {
    if (product?.productId && visible) {
      // Load all data in parallel
      const loadAllData = async () => {
        await Promise.all([
          loadProductDetails(),
          loadAvailableColors(),
          loadAvailableSizes()
        ]);
      };
      loadAllData();
    }
  }, [product?.productId, visible, loadProductDetails, loadAvailableColors, loadAvailableSizes]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      resetModalState();
    }
  }, [visible, resetModalState]);

  // Product details operations
  const handleAddProductDetails = async () => {
    try {
      const values = await detailsForm.validateFields();
      setLoading(true);
      
      await ProductDetailsService.createProductDetails({
        productId: product.productId,
        colorId: values.colorId,
        sizeId: values.sizeId,
        stockQuantity: values.stockQuantity
      });
      
      message.success('Thêm chi tiết sản phẩm thành công');
      detailsForm.resetFields();
      await loadProductDetails();
    } catch (error) {
      console.error('Error creating product details:', error);
      // Hiển thị error message cụ thể từ backend hoặc fallback message
      const errorMsg = error?.message || error || 'Lỗi khi thêm chi tiết sản phẩm';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDetailsStatus = async (id) => {
    try {
      setLoading(true);
      await ProductDetailsService.toggleStatus(id);
      message.success('Cập nhật trạng thái thành công');
      await loadProductDetails();
    } catch (error) {
      console.error('Error toggling status:', error);
      message.error('Lỗi khi cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDetails = async (id) => {
    try {
      setLoading(true);
      await ProductDetailsService.deleteProductDetails(id);
      message.success('Xóa chi tiết sản phẩm thành công');
      await loadProductDetails();
    } catch (error) {
      console.error('Error deleting product details:', error);
      message.error('Lỗi khi xóa chi tiết sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Table columns for product details
  const detailsColumns = [
    {
      title: 'Màu sắc',
      dataIndex: ['color', 'colorName'],
      key: 'colorName',
      render: (colorName) => (
        <Tag color="blue">{colorName}</Tag>
      )
    },
    {
      title: 'Kích cỡ',
      dataIndex: ['size', 'sizeValue'],
      key: 'sizeValue',
      render: (sizeValue) => (
        <Tag color="green">{sizeValue}</Tag>
      )
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (quantity, record) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: quantity <= 5 ? '#ff4d4f' : quantity <= 20 ? '#faad14' : '#52c41a' 
        }}>
          {quantity}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleDetailsStatus(record.productDetailsId)}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
          />
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteDetails(record.productDetailsId)}
            title="Xóa"
          />
        </Space>
      )
    }
  ];

  return (
    <Modal
      title={`Quản lý chi tiết sản phẩm - ${product?.productName || ''}`}
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={null}
      style={{ top: 20 }}
    >
      <Card style={{ marginBottom: 16 }}>
        <ProductDetailsForm
          form={detailsForm}
          onSubmit={handleAddProductDetails}
          loading={loading}
          availableColors={availableColors}
          availableSizes={availableSizes}
          existingDetails={productDetails}
        />
      </Card>
      <Table
        columns={detailsColumns}
        dataSource={productDetails}
        rowKey="productDetailsId"
        loading={loading}
        pagination={false}
        size="small"
        bordered
        locale={{ emptyText: 'Chưa có chi tiết sản phẩm nào' }}
      />
    </Modal>
  );
};

export default ProductDetailsModal;