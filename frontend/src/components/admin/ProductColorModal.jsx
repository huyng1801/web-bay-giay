import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, message } from 'antd';
import ProductColorService from '../../services/admin/ProductColorService';
import ProductSizeService from '../../services/admin/ProductSizeService';
import ProductColorImageService from '../../services/admin/ProductColorImageService';
import ColorService from '../../services/admin/ColorService';
import SizeService from '../../services/admin/SizeService';
import ColorForm from './ColorForm';
import ColorTable from './ColorTable';
import SizeManagement from './SizeManagement';
import ImageManagement from './ImageManagement';
import EditColorModal from './EditColorModal';

const ProductColorModal = ({ visible, product, onCancel, onSuccess }) => {
  // Form instances
  const [colorForm] = Form.useForm();
  const [sizeForm] = Form.useForm();
  const [imageForm] = Form.useForm();
  const [editColorForm] = Form.useForm();

  // Component state
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [productColorImages, setProductColorImages] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [editingColor, setEditingColor] = useState(null);
  const [editColorModalVisible, setEditColorModalVisible] = useState(false);
  
  // Available colors and sizes from master data
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [loading, setLoading] = useState({
    colors: false,
    sizes: false,
    images: false,
    editColor: false
  });

  // Helper function to reset all state
  const resetModalState = useCallback(() => {
    setSelectedColorId(null);
    setProductSizes([]);
    setProductColorImages([]);
    setEditingColor(null);
    setEditColorModalVisible(false);
    colorForm.resetFields();
    sizeForm.resetFields();
    imageForm.resetFields();
    editColorForm.resetFields();
    setLoading({
      colors: false,
      sizes: false,
      images: false,
      editColor: false
    });
  }, [colorForm, sizeForm, imageForm, editColorForm]);

  // Load initial data when product changes
  useEffect(() => {
    if (product?.productId && visible) {
      loadProductColors(product.productId);
      loadAvailableColors();
      loadAvailableSizes();
    }
  }, [product?.productId, visible]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      resetModalState();
    }
  }, [visible, resetModalState]);

  // Data loading functions
  const loadProductColors = async (productId) => {
    try {
      setLoading(prev => ({ ...prev, colors: true }));
      const data = await ProductColorService.getColorsByProductId(productId);
      setProductColors(data || []);
    } catch (error) {
      console.error('Error loading product colors:', error);
      message.error("Lỗi khi tải màu sắc sản phẩm");
      setProductColors([]);
    } finally {
      setLoading(prev => ({ ...prev, colors: false }));
    }
  };

  const loadProductSizes = async (colorId) => {
    try {
      setLoading(prev => ({ ...prev, sizes: true }));
      const data = await ProductSizeService.findByProductColorId(colorId);
      setProductSizes(data || []);
    } catch (error) {
      console.error('Error loading product sizes:', error);
      message.error("Lỗi khi tải kích thước sản phẩm");
      setProductSizes([]);
    } finally {
      setLoading(prev => ({ ...prev, sizes: false }));
    }
  };

  const loadProductColorImages = async (colorId) => {
    try {
      setLoading(prev => ({ ...prev, images: true }));
      const data = await ProductColorImageService.getImagesByColorId(colorId);
      setProductColorImages(data || []);
    } catch (error) {
      console.error('Error loading product images:', error);
      message.error("Lỗi khi tải hình ảnh sản phẩm");
      setProductColorImages([]);
    } finally {
      setLoading(prev => ({ ...prev, images: false }));
    }
  };

  // Load available colors from master data
  const loadAvailableColors = async () => {
    try {
      const data = await ColorService.getAllColors();
      // Only get active colors
      const activeColors = data.filter(color => color.isActive);
      setAvailableColors(activeColors);
    } catch (error) {
      console.error('Error loading available colors:', error);
      message.error("Lỗi khi tải danh sách màu sắc");
      setAvailableColors([]);
    }
  };

  // Load available sizes from master data  
  const loadAvailableSizes = async () => {
    try {
      const data = await SizeService.getAllSizes();
      // Only get active sizes
      const activeSizes = data.filter(size => size.isActive);
      setAvailableSizes(activeSizes);
    } catch (error) {
      console.error('Error loading available sizes:', error);
      message.error("Lỗi khi tải danh sách kích thước");
      setAvailableSizes([]);
    }
  };

  // Color operations
  const handleColorSelect = (colorId) => {
    setSelectedColorId(colorId);
    loadProductSizes(colorId);
    loadProductColorImages(colorId);
  };

  const handleAddColor = async () => {
    try {
      const values = await colorForm.validateFields();
      const { colorName, imageFile } = values;
      
      if (!imageFile || imageFile.length === 0) {
        message.error("Vui lòng chọn hình ảnh cho màu sắc");
        return;
      }

      setLoading(prev => ({ ...prev, colors: true }));
      const formData = new FormData();
      formData.append('imageFile', imageFile[0].originFileObj);
      formData.append('colorName', colorName); // This will now be the selected color name from dropdown
      formData.append('productId', product.productId);

      await ProductColorService.addColorToProduct(formData);
      message.success("Thêm màu sắc thành công");
      await loadProductColors(product.productId);
      colorForm.resetFields();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding color:', error);
      const errorMessage = error.response?.data?.message || "Lỗi khi thêm màu sắc";
      message.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, colors: false }));
    }
  };

  const handleToggleColorStatus = async (colorId) => {
    try {
      setLoading(prev => ({ ...prev, colors: true }));
      await ProductColorService.toggleColorStatus(colorId);
      message.success("Thay đổi trạng thái màu sắc thành công");
      await loadProductColors(product.productId);
      onSuccess?.();
    } catch (error) {
      console.error('Error toggling color status:', error);
      const errorMessage = error.response?.data?.message || "Lỗi khi thay đổi trạng thái màu sắc";
      message.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, colors: false }));
    }
  };

  const handleDeleteColor = (colorId) => {
    Modal.confirm({
      title: 'Xác nhận xóa màu',
      content: 'Bạn có chắc chắn muốn xóa màu này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(prev => ({ ...prev, colors: true }));
          await ProductColorService.deleteColorFromProduct(colorId);
          message.success("Xóa màu sắc thành công");
          await loadProductColors(product.productId);
          
          // Reset selected color if it was deleted
          if (selectedColorId === colorId) {
            setSelectedColorId(null);
            setProductSizes([]);
            setProductColorImages([]);
          }
          onSuccess?.();
        } catch (error) {
          console.error('Error deleting color:', error);
          const errorMessage = error.response?.data?.message || "Lỗi khi xóa màu sắc";
          message.error(errorMessage);
        } finally {
          setLoading(prev => ({ ...prev, colors: false }));
        }
      }
    });
  };

  const handleEditColor = (color) => {
    setEditingColor(color);
    editColorForm.setFieldsValue({
      colorName: color.colorName,
      imageFile: []
    });
    setEditColorModalVisible(true);
  };

  const handleUpdateColor = async () => {
    try {
      const values = await editColorForm.validateFields();
      const { colorName, imageFile } = values;
      
      setLoading(prev => ({ ...prev, editColor: true }));
      const formData = new FormData();
      formData.append('colorName', colorName);
      
      // Only append image if a new one is selected
      if (imageFile && imageFile.length > 0) {
        formData.append('imageFile', imageFile[0].originFileObj);
      }

      await ProductColorService.updateColor(editingColor.productColorId, formData);
      message.success("Cập nhật màu sắc thành công");
      await loadProductColors(product.productId);
      
      // Close modal and reset state
      setEditColorModalVisible(false);
      setEditingColor(null);
      editColorForm.resetFields();
      onSuccess?.();
    } catch (error) {
      console.error('Error updating color:', error);
      const errorMessage = error.response?.data?.message || "Lỗi khi cập nhật màu sắc";
      message.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, editColor: false }));
    }
  };

  const handleEditColorCancel = () => {
    setEditColorModalVisible(false);
    setEditingColor(null);
    editColorForm.resetFields();
  };

  // Size operations
  const handleAddSize = async () => {
    if (!selectedColorId) {
      message.warning("Vui lòng chọn màu sắc trước khi thêm kích thước");
      return;
    }

    try {
      const values = await sizeForm.validateFields();
      const newSize = {
        ...values,
        productColorId: selectedColorId,
        stockQuantity: parseInt(values.stockQuantity, 10)
        // sizeValue will now come from the selected size dropdown
      };

      setLoading(prev => ({ ...prev, sizes: true }));
      await ProductSizeService.createProductSize(newSize);
      message.success("Thêm kích thước thành công");
      await loadProductSizes(selectedColorId);
      sizeForm.resetFields();
    } catch (error) {
      console.error('Error adding size:', error);
      const errorMessage = error.response?.data?.message || "Lỗi khi thêm kích thước";
      message.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, sizes: false }));
    }
  };

  const handleToggleSizeStatus = async (sizeId) => {
    try {
      setLoading(prev => ({ ...prev, sizes: true }));
      await ProductSizeService.toggleSizeStatus(sizeId);
      message.success("Thay đổi trạng thái kích thước thành công");
      await loadProductSizes(selectedColorId);
    } catch (error) {
      console.error('Error toggling size status:', error);
      const errorMessage = error.response?.data?.message || "Lỗi khi thay đổi trạng thái kích thước";
      message.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, sizes: false }));
    }
  };

  const handleDeleteSize = (sizeId) => {
    Modal.confirm({
      title: 'Xác nhận xóa kích thước',
      content: 'Bạn có chắc chắn muốn xóa kích thước này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(prev => ({ ...prev, sizes: true }));
          await ProductSizeService.deleteProductSize(sizeId);
          message.success("Xóa kích thước thành công");
          await loadProductSizes(selectedColorId);
        } catch (error) {
          console.error('Error deleting size:', error);
          const errorMessage = error.response?.data?.message || "Lỗi khi xóa kích thước";
          message.error(errorMessage);
        } finally {
          setLoading(prev => ({ ...prev, sizes: false }));
        }
      }
    });
  };

  // Image operations
  const handleAddImage = async () => {
    if (!selectedColorId) {
      message.warning("Vui lòng chọn màu sắc trước khi thêm hình ảnh");
      return;
    }

    try {
      const values = await imageForm.validateFields();
      const { imageFile } = values;
      
      if (!imageFile || imageFile.length === 0) {
        message.error("Vui lòng chọn ít nhất một hình ảnh");
        return;
      }

      setLoading(prev => ({ ...prev, images: true }));
      const formData = new FormData();
      imageFile.forEach(file => {
        formData.append('imageFiles', file.originFileObj);
      });
      formData.append('productColorId', selectedColorId);

      await ProductColorImageService.addImageToColor(formData);
      message.success("Thêm hình ảnh thành công");
      await loadProductColorImages(selectedColorId);
      imageForm.resetFields();
    } catch (error) {
      console.error('Error adding image:', error);
      const errorMessage = error.response?.data?.message || "Lỗi khi thêm hình ảnh";
      message.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, images: false }));
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      setLoading(prev => ({ ...prev, images: true }));
      await ProductColorImageService.deleteImageFromColor(imageId);
      message.success("Xóa hình ảnh thành công");
      await loadProductColorImages(selectedColorId);
    } catch (error) {
      console.error('Error deleting image:', error);
      const errorMessage = error.response?.data?.message || "Lỗi khi xóa hình ảnh";
      message.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, images: false }));
    }
  };

  return (
    <>
      <Modal
  okText="Lưu"
  cancelText="Hủy"
        title={`Quản lý màu và kích thước cho ${product?.productName || ''}`}
        open={visible}
        onCancel={onCancel}
        width={900}
        footer={null}
        style={{ top: 20 }}
      >
        {/* Color Management Section */}
        <div style={{ marginBottom: 32 }}>
          <ColorForm
            form={colorForm}
            onSubmit={handleAddColor}
            loading={loading.colors}
            availableColors={availableColors}
          />
          
          <ColorTable
            dataSource={productColors}
            selectedColorId={selectedColorId}
            onColorSelect={handleColorSelect}
            onEditColor={handleEditColor}
            onToggleStatus={handleToggleColorStatus}
            onDeleteColor={handleDeleteColor}
            loading={loading.colors}
          />
        </div>

        {/* Size and Image Management - Only show when color is selected */}
        {selectedColorId && (
          <>
            <SizeManagement
              form={sizeForm}
              dataSource={productSizes}
              onAddSize={handleAddSize}
              onToggleStatus={handleToggleSizeStatus}
              onDeleteSize={handleDeleteSize}
              loading={loading.sizes}
              availableSizes={availableSizes}
            />

            <ImageManagement
              form={imageForm}
              dataSource={productColorImages}
              onAddImage={handleAddImage}
              onDeleteImage={handleDeleteImage}
              loading={loading.images}
            />
          </>
        )}
        
        {/* Helper message when no color is selected */}
        {!selectedColorId && productColors.length > 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            color: '#666'
          }}>
            <p style={{ fontSize: '16px', margin: 0 }}>
              👆 Vui lòng chọn một màu sắc để quản lý kích thước và hình ảnh
            </p>
          </div>
        )}
      </Modal>
      
      {/* Edit Color Modal */}
      <EditColorModal
        visible={editColorModalVisible}
        form={editColorForm}
        editingColor={editingColor}
        onOk={handleUpdateColor}
        onCancel={handleEditColorCancel}
        loading={loading.editColor}
        availableColors={availableColors}
      />
    </>
  );
};

export default ProductColorModal;