import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, message } from 'antd';
import ProductImageService from '../../services/admin/ProductImageService';
import ProductImageManagement from './ProductImageManagement';

const ProductImageModal = ({ visible, product, onCancel, onSuccess }) => {
  // State management
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form instance
  const [imageForm] = Form.useForm();

  // Helper function to reset all state
  const resetModalState = useCallback(() => {
    setProductImages([]);
    imageForm.resetFields();
    setLoading(false);
  }, [imageForm]);

  // Load initial data when product changes
  useEffect(() => {
    if (product?.productId && visible) {
      loadProductImages();
    }
  }, [product?.productId, visible]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      resetModalState();
    }
  }, [visible, resetModalState]);

  // Data loading functions
  const loadProductImages = async () => {
    if (!product?.productId) return;
    
    setLoading(true);
    try {
      const response = await ProductImageService.getImagesByProductId(product.productId);
      // Response từ BaseService đã extract data, nên response là array trực tiếp
      const imagesData = Array.isArray(response) ? response : (response?.data || []);
      setProductImages(imagesData);
    } catch (error) {
      console.error('Error loading product images:', error);
      message.error('Không thể tải hình ảnh sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Product images operations
  const handleAddProductImage = async () => {
    try {
      if (!product?.productId) {
        message.error('Không có sản phẩm được chọn');
        return;
      }
      
      const values = await imageForm.validateFields();
      setLoading(true);
      
      const formData = new FormData();
      formData.append('productId', product.productId);
      values.imageFiles.forEach(file => {
        formData.append('imageFiles', file.originFileObj);
      });
      
      await ProductImageService.uploadImages(formData);
      message.success('Thêm hình ảnh thành công');
      imageForm.resetFields();
      await loadProductImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      message.error('Lỗi khi thêm hình ảnh');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      setLoading(true);
      await ProductImageService.deleteImage(imageId);
      message.success('Xóa hình ảnh thành công');
      await loadProductImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      message.error('Lỗi khi xóa hình ảnh');
    } finally {
      setLoading(false);
    }
  };

  const handleSetMainImage = async (imageId) => {
    try {
      setLoading(true);
      await ProductImageService.setMainImage(imageId);
      message.success('Đặt làm hình ảnh chính thành công');
      await loadProductImages();
      if (onSuccess) onSuccess(); // Refresh product list to show updated main image
    } catch (error) {
      console.error('Error setting main image:', error);
      message.error('Lỗi khi đặt hình ảnh chính');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Quản lý hình ảnh sản phẩm - ${product?.productName || ''}`}
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={null}
      style={{ top: 20 }}
    >
      <ProductImageManagement
        form={imageForm}
        dataSource={productImages}
        onAddImage={handleAddProductImage}
        onDeleteImage={handleDeleteImage}
        onSetMainImage={handleSetMainImage}
        loading={loading}
      />
    </Modal>
  );
};

export default ProductImageModal;
