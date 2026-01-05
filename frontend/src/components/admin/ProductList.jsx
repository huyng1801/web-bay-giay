import React, { useState, useEffect, useCallback } from 'react';
import ProductService from '../../services/admin/ProductService';
import ProductDetailsService from '../../services/admin/ProductDetailsService';
import ProductImageService from '../../services/admin/ProductImageService';
import SubcategoryService from '../../services/admin/SubcategoryService';
import BrandService from '../../services/admin/BrandService';
import { Table, Button, message, Modal, Form, Input, Select, Row, Col, Card, InputNumber, Tag } from 'antd';
import ProductDetailsModal from './ProductDetailsModal';
import ProductStockModal from './ProductStockModal';
import ProductImageModal from './ProductImageModal';
import RichTextEditor from '../common/RichTextEditor';

import { EditOutlined, AppstoreAddOutlined, SearchOutlined, ClearOutlined, PoweroffOutlined, StockOutlined, FilterOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons';

// Helper function to count active product filters
const getActiveProductFilterCount = (filters) => {
  let count = 0;
  if (filters.productName?.trim()) count++;
  if (filters.subCategoryId !== null) count++;
  if (filters.brandId !== null) count++;
  if (filters.isActive !== null) count++;
  if (filters.minSellingPrice !== null) count++;
  if (filters.maxSellingPrice !== null) count++;
  return count;
};

const { Option } = Select;

const ProductList = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    productName: '',
    subCategoryId: null,
    brandId: null,
    isActive: null,
    minSellingPrice: null,
    maxSellingPrice: null
  });
  const [modalStates, setModalStates] = useState({
    productModal: false,
    detailsModal: false,
    stockModal: false,
    imageModal: false
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();

  // Initial data loading
  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          loadBrands(),
          loadProducts(),
          loadSubcategories()
        ]);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu ban đầu");
      }
    };
    
    initializeData();
  }, []);

   // Modal handling
   const toggleModal = (modalType, visible, product = null) => {
    setModalStates(prev => ({
      ...prev,
      [modalType]: visible
    }));
    
    if (modalType === 'productModal') {
      setEditingProduct(product);
      if (product) {
        form.setFieldsValue({
          productName: product.productName,
          description: product.description,
          subCategoryId: product.subCategoryId,
          brandId: product.brandId,
          sellingPrice: product.sellingPrice,
          discountPercentage: product.discountPercentage,
        });
      } else {
        form.resetFields();
      }
    } else if (modalType === 'detailsModal') {
      setSelectedProduct(product); // Set selected product for details modal
    } else if (modalType === 'imageModal') {
      setSelectedProduct(product); // Set selected product for image modal
    } else if (modalType === 'stockModal') {
      setSelectedProduct(product); // Set selected product for stock modal
    }
  };
  // Data loading functions
  const loadSubcategories = async () => {
    try {
      const response = await SubcategoryService.getAllSubcategories(null, null);
      setSubcategories(response);
    } catch (error) {
      message.error("Lỗi khi tải danh mục con");
    }
  };

  const loadBrands = async () => {
    try {
      const response = await BrandService.getAllBrands();
      setBrands(response);
    } catch (error) {
      message.error("Lỗi khi tải thương hiệu");
    }
  };

  const loadProducts = async () => {
    try {
      const response = await ProductService.getAllProducts();
      setProducts(response);
      setFilteredProducts(response);
    } catch (error) {
      message.error("Lỗi khi tải sản phẩm");
    }
  };

  // Tìm kiếm sản phẩm nâng cao sử dụng endpoint /products/search
  const performSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      const searchParams = {
        query: filters.productName?.trim() || undefined,
        subCategoryId: filters.subCategoryId !== null ? filters.subCategoryId : undefined,
        brandId: filters.brandId !== null ? filters.brandId : undefined,
        minPrice: filters.minSellingPrice !== null ? filters.minSellingPrice : undefined,
        maxPrice: filters.maxSellingPrice !== null ? filters.maxSellingPrice : undefined,
        isActive: filters.isActive !== null ? filters.isActive : undefined,
        aiEnhanced: false
      };
      
      // Remove null/undefined values
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === null || searchParams[key] === undefined || searchParams[key] === '') {
          delete searchParams[key];
        }
      });
      
      const results = await ProductService.searchProducts(searchParams);
      setFilteredProducts(results || []);
      setProducts(results || []); // Update products state as well
    } catch (error) {
      console.error('Search error:', error);
      message.error("Lỗi khi tìm kiếm sản phẩm");
      setFilteredProducts([]);
    } finally {
      setIsSearching(false);
    }
  }, [filters]);

  // Clear filters and reset to all products
  const clearFilters = async () => {
    setFilters({
      productName: '',
      subCategoryId: null,
      brandId: null,
      isActive: null,
      minSellingPrice: null,
      maxSellingPrice: null
    });
    // Load all products when clearing filters
    await loadProducts();
  };

  // Handle filter changes and trigger search
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Debounced search when filters change
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      performSearch();
    }, 800); // 800ms debounce for price filtering

    return () => clearTimeout(searchTimer);
  }, [performSearch]);

  // Product operations - Create hoặc Update sản phẩm
  const handleProductSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Chuẩn bị dữ liệu sản phẩm
      const productData = {
        ...values,
        sellingPrice: parseFloat(values.sellingPrice) || 0,
        discountPercentage: values.discountPercentage != null && values.discountPercentage !== "" 
          ? parseFloat(values.discountPercentage) 
          : 0
      };

      // Validate giá trị
      if (productData.sellingPrice <= 0) {
        message.error("Giá bán phải lớn hơn 0");
        return;
      }

      if (productData.discountPercentage < 0 || productData.discountPercentage > 100) {
        message.error("Giảm giá phải từ 0 đến 100%");
        return;
      }

      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.productId, productData);
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        await ProductService.createProduct(productData);
        message.success("Thêm sản phẩm thành công!");
      }

      toggleModal('productModal', false);
      await loadProducts();
      await performSearch();
    } catch (error) {
      console.error('Error submitting product:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data 
        || error.message 
        || "Vui lòng điền đầy đủ các trường bắt buộc";
      message.error(errorMessage);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await ProductService.toggleProductStatus(id);
      const newStatus = response?.isActive ? 'Hoạt động' : 'Ngừng hoạt động';
      message.success(`Đã chuyển trạng thái sản phẩm sang: ${newStatus}`);
      await loadProducts();
      await performSearch();
    } catch (error) {
      console.error('Error toggling product status:', error);
      if (error.response?.data) {
        message.error(error.response.data);
      } else {
        message.error("Lỗi khi cập nhật trạng thái sản phẩm");
      }
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productId',
      key: 'productId',
      width: 80,
      sorter: (a, b) => a.productId - b.productId,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      ellipsis: true,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 100,
      render: (imageUrl, record) => (
        imageUrl ? (
          <img 
            src={imageUrl} 
            alt={record.productName}
            style={{ 
              width: '60px', 
              height: '60px', 
              objectFit: 'cover', 
              borderRadius: '8px',
              border: '1px solid #f0f0f0',
              cursor: 'pointer'
            }}
            onClick={() => window.open(imageUrl, '_blank')}
          />
        ) : (
          <div style={{
            width: '60px', 
            height: '60px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            Chưa có ảnh
          </div>
        )
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
      render: (text) => text ? (
        <div 
          title={text.replace(/<[^>]*>/g, '')} // Remove HTML tags for tooltip
          style={{ maxWidth: '200px' }}
        >
          {text.replace(/<[^>]*>/g, '').substring(0, 50)}
          {text && text.length > 50 ? '...' : ''}
        </div>
      ) : (
        <span style={{ color: '#ccc', fontStyle: 'italic' }}>Chưa có mô tả</span>
      )
    },
    {
      title: 'Danh mục con',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
      sorter: (a, b) => a.subCategoryName.localeCompare(b.subCategoryName),
      ellipsis: true,
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandName',
      key: 'brandName',
      sorter: (a, b) => a.brandName.localeCompare(b.brandName),
      ellipsis: true,
    },
    {
      title: 'Giá gốc',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      render: (text) => <span>{text.toLocaleString()} VNĐ</span>,
      sorter: (a, b) => a.sellingPrice - b.sellingPrice,
      width: 120,
    },
    {
      title: 'Giá sau giảm',
      key: 'finalPrice',
      render: (_, record) => {
        const finalPrice = record.sellingPrice * (1 - record.discountPercentage / 100);
        return <span style={{ color: '#f5222d', fontWeight: 'bold' }}>{Math.round(finalPrice).toLocaleString()} VNĐ</span>;
      },
      sorter: (a, b) => {
        const finalPriceA = a.sellingPrice * (1 - a.discountPercentage / 100);
        const finalPriceB = b.sellingPrice * (1 - b.discountPercentage / 100);
        return finalPriceA - finalPriceB;
      },
      width: 140,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
      width: 130,
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <span>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => window.open(`/product/${record.productId}`, '_blank')}
            title="Xem chi tiết sản phẩm"
            style={{ color: '#52c41a' }}
          />
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => toggleModal('productModal', true, record)}
            title="Sửa sản phẩm"
          />
          <Button 
            type="link" 
            icon={<PoweroffOutlined />} 
            onClick={() => handleToggleStatus(record.productId)}
            title={record.isActive ? "Ngừng hoạt động" : "Kích hoạt"}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
          />
          <Button 
            type="link" 
            icon={<AppstoreAddOutlined />} 
            onClick={() => toggleModal('detailsModal', true, record)}
            title="Quản lý chi tiết sản phẩm"
          />
          <Button 
            type="link" 
            icon={<PictureOutlined />} 
            onClick={() => toggleModal('imageModal', true, record)}
            title="Quản lý hình ảnh"
            style={{ color: '#722ed1' }}
          />
          <Button 
            type="link" 
            icon={<StockOutlined />} 
            onClick={() => toggleModal('stockModal', true, record)}
            title="Quản lý tồn kho"
            style={{ color: '#1890ff' }}
          />
        </span>
      ),
      width: 250,
      fixed: 'right',
    },
  ];

  return (
    <div>
      {/* Filter Section in Card */}
      <Card
        style={{ marginBottom: 24, borderRadius: 12 }}

        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FilterOutlined style={{ color: '#1890ff' }} />
            <span>Tìm kiếm & Lọc sản phẩm</span>
            {getActiveProductFilterCount(filters) > 0 && (
              <Tag color="blue">{getActiveProductFilterCount(filters)} bộ lọc đang áp dụng</Tag>
            )}
          </div>
        }
        extra={
          <Button
            icon={<ClearOutlined />}
            onClick={clearFilters}
            disabled={getActiveProductFilterCount(filters) === 0}
          >
            Xóa bộ lọc
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Tìm kiếm:</div>
            <Input.Search
              placeholder="Tìm kiếm theo tên sản phẩm hoặc mô tả"
              value={filters.productName}
              onChange={(e) => handleFilterChange('productName', e.target.value)}
              onSearch={() => performSearch()}
              enterButton={<SearchOutlined />}
              loading={isSearching}
              allowClear
            />
          </Col>
          <Col span={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Danh mục con:</div>
            <Select
              value={filters.subCategoryId}
              onChange={(value) => handleFilterChange('subCategoryId', value)}
              allowClear={false}
              style={{ width: '100%' }}
            >
              <Option value={null}>Tất cả danh mục con</Option>
              {subcategories.map((subcategory) => (
                <Option key={subcategory.subCategoryId} value={subcategory.subCategoryId}>
                  {subcategory.subCategoryName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Thương hiệu:</div>
            <Select
              value={filters.brandId}
              onChange={(value) => handleFilterChange('brandId', value)}
              allowClear={false}
              style={{ width: '100%' }}
            >
              <Option value={null}>Tất cả thương hiệu</Option>
              {brands.map((brand) => (
                <Option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Trạng thái:</div>
            <Select
              value={filters.isActive}
              onChange={(value) => handleFilterChange('isActive', value)}
              allowClear={false}
              style={{ width: '100%' }}
            >
              <Option value={null}>Tất cả trạng thái</Option>
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Ngừng hoạt động</Option>
            </Select>
          </Col>
          <Col span={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Giá bán từ:</div>
            <InputNumber
              placeholder="Giá bán từ"
              value={filters.minSellingPrice}
              onChange={(value) => {
                if (value === undefined || value === null || value === "") {
                  handleFilterChange('minSellingPrice', null);
                  return;
                }
                if (!Number.isFinite(Number(value)) || Number(value) < 0) {
                  message.error('Giá bán từ phải là số dương!');
                  return;
                }
                handleFilterChange('minSellingPrice', value);
              }}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Col>
          <Col span={6}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Giá bán đến:</div>
            <InputNumber
              placeholder="Giá bán đến"
              value={filters.maxSellingPrice}
              onChange={(value) => {
                if (value === undefined || value === null || value === "") {
                  handleFilterChange('maxSellingPrice', null);
                  return;
                }
                if (!Number.isFinite(Number(value)) || Number(value) < 0) {
                  message.error('Giá bán đến phải là số dương!');
                  return;
                }
                handleFilterChange('maxSellingPrice', value);
              }}
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />  
          </Col>
        </Row>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Button 
          type="primary" 
          onClick={() => toggleModal('productModal', true)}
        >
          Thêm sản phẩm
        </Button>

  
      </div>
      <Table 
        columns={columns} 
        dataSource={filteredProducts} 
        rowKey="productId" 
        pagination={{ 
          pageSize: 10,
        }}
        scroll={{ x: 1200 }}
        size="middle"
        loading={isSearching}
      />

      {/* Product Modal */}
      <Modal
  okText="Lưu"
  cancelText="Hủy"
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={modalStates.productModal}
        onCancel={() => toggleModal('productModal', false)}
        onOk={handleProductSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
          >
            <RichTextEditor 
              placeholder="Nhập mô tả chi tiết về sản phẩm (không bắt buộc)..."
              height={150}
            />
          </Form.Item>
          <Form.Item
            name="subCategoryId"
            label="Danh mục con"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục con!' }]}
          >
            <Select>
              {subcategories.map((subcategory) => (
                <Option key={subcategory.subCategoryId} value={subcategory.subCategoryId}>
                  {subcategory.subCategoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="brandId"
            label="Thương hiệu"
            rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
          >
            <Select>
              {brands.map((brand) => (
                <Option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="sellingPrice"
            label="Giá bán"
            rules={[ 
              { required: true, message: 'Vui lòng nhập giá bán!' },
              {
                validator(_, value) {
                  if (value === undefined || value === null || value === "") {
                    return Promise.resolve();
                  }
                  if (Number(value) <= 0) {
                    return Promise.reject(new Error('Giá bán không được là số âm hoặc bằng 0!'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="discountPercentage"
            label="Giảm giá (%)"
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="Nhập phần trăm giảm giá"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Color Modal */}
      <ProductDetailsModal
        visible={modalStates.detailsModal}
        product={selectedProduct}
        onCancel={() => toggleModal('detailsModal', false)}
        onSuccess={loadProducts}
      />

      {/* Image Management Modal */}
      <ProductImageModal
        visible={modalStates.imageModal}
        product={selectedProduct}
        onCancel={() => toggleModal('imageModal', false)}
        onSuccess={loadProducts}
      />

      {/* Stock Management Modal */}
      <ProductStockModal
        visible={modalStates.stockModal}
        product={selectedProduct}
        onCancel={() => toggleModal('stockModal', false)}
        onSuccess={loadProducts}
      />
    </div>
  );
};

export default ProductList;