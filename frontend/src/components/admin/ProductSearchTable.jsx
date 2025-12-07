import React from 'react';
import { Card, Input, Table, Button, Tag, Space, Tooltip } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const ProductSearchTable = ({ 
  products, 
  search, 
  setSearch, 
  handleSearch, 
  onProductSelect, 
  loading 
}) => {
  // Inline styles
  const styles = {
    searchContainer: {
      marginBottom: '16px'
    },
    stockCell: (stock) => ({
      color: stock > 0 ? (stock < 10 ? '#ff7a00' : '#52c41a') : '#ff4d4f',
      fontWeight: 'bold'
    })
  };

  // Product columns configuration
  const productColumns = [
    { 
      title: 'Thông tin sản phẩm', 
      dataIndex: 'productName', 
      key: 'productName',
      width: '35%',
      render: (productName, record) => (
        <Space direction="vertical" size="small">
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{productName}</div>
          <Space size="small">
            <Tag color="blue">{record.brandName}</Tag>
            {record.subCategoryName && <Tag color="green">{record.subCategoryName}</Tag>}
          </Space>
        </Space>
      )
    },
    { 
      title: 'Giá bán', 
      dataIndex: 'sellingPrice', 
      key: 'sellingPrice',
      width: '15%',
      render: (price, record) => (
        <Space direction="vertical" size="small">
          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#f5222d' }}>
            {price ? price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 ₫'}
          </span>
          {record.discountPercentage > 0 && (
            <Tag color="red">-{record.discountPercentage}%</Tag>
          )}
        </Space>
      )
    },
    { 
      title: 'Tồn kho', 
      dataIndex: 'totalStock', 
      key: 'totalStock',
      width: '12%',
      render: (stock) => (
        <div style={{ textAlign: 'center' }}>
          <span style={styles.stockCell(stock)}>
            {stock || 0}
          </span>
        </div>
      ),
      sorter: (a, b) => (a.totalStock || 0) - (b.totalStock || 0)
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Tooltip title="Chọn màu sắc và kích thước">
          <Button 
            type="link" 
            icon={<ShoppingOutlined />}
            onClick={() => onProductSelect(record)}
            disabled={!record.totalStock || record.totalStock <= 0}
            style={{ 
              color: !record.totalStock || record.totalStock <= 0 ? '#d9d9d9' : '#1890ff'
            }}
          >
          </Button>
        </Tooltip>
      )
    }
  ];

  return (
    <Card title="Tìm kiếm & Thêm sản phẩm" bordered={false}>
      <Input.Search
        placeholder="Tìm kiếm sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSearch={handleSearch}
        style={styles.searchContainer}
        loading={loading}
        allowClear
      />
      <Table
        dataSource={products}
        columns={productColumns}
        rowKey="productId"
        pagination={{ pageSize: 8 }}
        loading={loading}
        size="middle"
      />
    </Card>
  );
};

export default ProductSearchTable;