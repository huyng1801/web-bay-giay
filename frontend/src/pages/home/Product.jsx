import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Drawer, Select, Pagination, Button } from 'antd';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ClearOutlined } from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';
import SearchBar from '../../components/product/SearchBar';
import PriceFilter from '../../components/product/PriceFilter';
import SubCategoryFilter from '../../components/product/SubCategoryFilter';
import BrandFilter from '../../components/product/BrandFilter';
import ProductCard from '../../components/home/ProductCard';
import { getSubCategories, getAllProducts } from '../../services/home/HomeService';
import { calculateDiscountedPrice } from '../../utils/priceUtils';

const styles = {
  // Main container
  container: {
    padding: '0',
    background: 'linear-gradient(180deg,#f8fafc 0%,#f5f5f5 100%)',
    minHeight: '100vh',
  },

  // Page header - Flatsome style
  pageHeader: {
    background: 'linear-gradient(90deg,#fff 60%,#f8fafc 100%)',
    padding: '12px 24px',
    borderBottom: '2px solid #eaeaea',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    borderRadius: '0 0 18px 18px',
  },

  pageHeaderContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },

  pageTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#222',
    margin: '0 0 8px 0',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    borderBottom: '3px solid rgb(255, 107, 53)',
    display: 'inline-block',
    paddingBottom: '6px',
  },

  pageBreadcrumb: {
    fontSize: '16px',
    color: '#666',
    margin: '0',
    fontWeight: '400',
  },

  // Content wrapper
  contentWrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 0 32px',
  },

  // Filter section
  filterBar: {
    background: 'linear-gradient(90deg,#fff 60%,#f8fafc 100%)',
    padding: '12px 18px',
    borderRadius: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    flexWrap: 'wrap',
    gap: '10px',
    border: '1.5px solid #eaeaea',
  },

  filterBarLeft: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },

  resultCount: {
    color: '#666',
    fontSize: '15px',
    fontWeight: '600',
    background: '#f8fafc',
    borderRadius: '999px',
    padding: '4px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
  },

  viewToggleBtn: {
    border: '1.5px solid #eaeaea',
    background: '#fff',
    padding: '6px 18px',
    borderRadius: '999px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
  },

  // Sidebar
  sidebar: {
    position: 'sticky',
    top: '120px',
    height: 'fit-content',
  },

  sidebarSection: {
    background: 'linear-gradient(90deg,#fff 60%,#f8fafc 100%)',
    padding: '16px',
    borderRadius: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    marginBottom: '14px',
    border: '1.5px solid #eaeaea',
  },

  sidebarTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid rgb(255, 107, 53)',
    paddingBottom: '4px',
    display: 'inline-block',
  },

  // Products container - Flatsome grid
  productsContainer: {
    display: 'grid',
    gap: '18px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    background: 'none',
  },

  productsContainerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  spinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px 8px',
    minHeight: '300px',
  },

  // No products message
  noProducts: {
    textAlign: 'center',
    padding: '32px 8px',
    background: 'linear-gradient(90deg,#fff 60%,#f8fafc 100%)',
    borderRadius: '14px',
    color: '#999',
    border: '1.5px solid #eaeaea',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },

  noProductsTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '6px',
    color: '#666',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #ff4d4f',
    display: 'inline-block',
    paddingBottom: '2px',
  },
};

const PAGE_SIZE = 6;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  
  // Get URL parameters
  const urlSubCategoryId = searchParams.get('subCategoryId');
  const urlSubCategoryName = searchParams.get('subCategoryName');
  const urlBrand = searchParams.get('brand');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [fetchedCategories, fetchedProducts] = await Promise.all([
          getSubCategories(null, null),
          // Load all products first, then filter
          getAllProducts(null, null, null)
        ]);
        
        // Get unique brands from products
        const uniqueBrands = [...new Set(fetchedProducts.map(p => p.brandName))]
          .filter(Boolean)
          .map((name, index) => ({ id: index + 1, name }));
        
        const activeCategories = fetchedCategories.filter(category => category.isActive === true);
        const activeProducts = fetchedProducts.filter(product =>
          product.imageUrl && product.isActive === true
        );
        
        setSubCategories(activeCategories);
        setBrands(uniqueBrands);
        setProducts(activeProducts);
        
        // Handle URL parameters
        if (urlSubCategoryId) {
          setSelectedSubCategories([parseInt(urlSubCategoryId)]);
        }
        if (urlBrand) {
          const brand = uniqueBrands.find(b => b.name.toLowerCase() === urlBrand.toLowerCase());
          if (brand) setSelectedBrands([brand.id]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [urlSubCategoryId, urlBrand]);

  const filteredProducts = products.filter(product => {
    const productName = product.productName || '';
    const brandName = product.brandName || '';
    
    const matchesSearch = productName.toLowerCase()
      .includes(searchQuery.toLowerCase()) || 
      brandName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedSubCategories.length === 0 ||
      selectedSubCategories.includes(product.subCategoryId);
      
    const matchesBrand = selectedBrands.length === 0 ||
      selectedBrands.some(brandId => {
        const brand = brands.find(b => b.id === brandId);
        return brand && brandName.toLowerCase() === brand.name.toLowerCase();
      });
      
    const finalPrice = calculateDiscountedPrice(product.sellingPrice, product.discountPercentage);
    const matchesPrice = finalPrice >= priceRange[0] && finalPrice <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'newest') return b.productId - a.productId;
    if (sortBy === 'price-low') {
      const priceA = calculateDiscountedPrice(a.sellingPrice, a.discountPercentage);
      const priceB = calculateDiscountedPrice(b.sellingPrice, b.discountPercentage);
      return priceA - priceB;
    }
    if (sortBy === 'price-high') {
      const priceA = calculateDiscountedPrice(a.sellingPrice, a.discountPercentage);
      const priceB = calculateDiscountedPrice(b.sellingPrice, b.discountPercentage);
      return priceB - priceA;
    }
    if (sortBy === 'popular') return (b.ratingCount || 0) - (a.ratingCount || 0);
    return 0;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSubCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 10000000]);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || 
    selectedSubCategories.length > 0 || 
    selectedBrands.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 10000000;

  if (loading) {
    return (
      <CustomerLayout>
        <div style={styles.spinner}>
          <Spin size="large" />
          <p style={{ marginTop: '16px', color: '#666' }}>Đang tải sản phẩm...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div style={styles.spinner}>
          <div style={{ textAlign: 'center', color: '#ff4d4f' }}>
            <h3>⚠️ Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Tải lại trang
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      {/* Page Header - Flatsome Style */}
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderContent}>
          <h1 style={styles.pageTitle}>
            {urlSubCategoryName ? decodeURIComponent(urlSubCategoryName) : 'Tất Cả Sản Phẩm'}
          </h1>
          <p style={styles.pageBreadcrumb}>
            {urlSubCategoryName ? `Khám phá bộ sưu tập ${decodeURIComponent(urlSubCategoryName)}` : 'Khám phá bộ sưu tập sản phẩm đầy đủ'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.contentWrapper}>
        {/* Filter Bar - Flatsome Style */}
        <div style={styles.filterBar}>
          <div style={styles.filterBarLeft}>
            <span style={styles.resultCount}>
              Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
            </span>
          </div>
          <div style={styles.filterBarRight}>
            {/* Ant Design Select for sorting */}
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{
                ...styles.sortSelect,

                minWidth: '160px',
              }}
              dropdownStyle={{
                borderRadius: '14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
                fontSize: '15px',
              }}
              options={[
                { value: 'newest', label: 'Mới nhất' },
                { value: 'price-low', label: 'Giá: Thấp đến Cao' },
                { value: 'price-high', label: 'Giá: Cao đến Thấp' },
                { value: 'popular', label: 'Phổ biến' },
              ]}
            />
          </div>
        </div>

        {/* Products Section */}
        <Row gutter={[28, 28]}>
          <Col xs={24} sm={24} md={6}>
            <div style={styles.sidebar}>
              {/* Clear All Filters Button */}
              {hasActiveFilters && (
                <div style={styles.sidebarSection}>
                  <Button 
                    type="primary" 
                    danger 
                    icon={<ClearOutlined />}
                    onClick={clearAllFilters}
                    style={{ width: '100%', marginBottom: '8px' }}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              )}
              
              {/* Search */}
              <div style={styles.sidebarSection}>
                <div style={styles.sidebarTitle}>Tìm Kiếm</div>
                <SearchBar onSearch={setSearchQuery} />
              </div>

              {/* Category Filter */}
              <div style={styles.sidebarSection}>
                <div style={styles.sidebarTitle}>Danh Mục</div>
                <SubCategoryFilter
                  subCategories={subCategories}
                  selectedSubCategories={selectedSubCategories}
                  onSubCategoryChange={setSelectedSubCategories}
                />
              </div>

              {/* Brand Filter */}
              <div style={styles.sidebarSection}>
                <div style={styles.sidebarTitle}>Thương Hiệu</div>
                <BrandFilter
                  brands={brands}
                  selectedBrands={selectedBrands}
                  onBrandChange={setSelectedBrands}
                />
              </div>

              {/* Price Filter */}
              <div style={styles.sidebarSection}>
                <div style={styles.sidebarTitle}>Giá</div>
                <PriceFilter onPriceChange={setPriceRange} />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={18}>
            {filteredProducts.length > 0 ? (
              <>
                <div style={styles.productsContainer}>
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.productId} product={product} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={filteredProducts.length}
                    onChange={page => setCurrentPage(page)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            ) : (
              <div style={styles.noProducts}>
                <div style={styles.noProductsTitle}>Không tìm thấy sản phẩm</div>
                <p>Vui lòng thử lại với các bộ lọc khác</p>
              </div>
            )}
          </Col>
        </Row>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Bộ Lọc"
        placement="left"
        onClose={() => setMobileFilterOpen(false)}
        open={mobileFilterOpen}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={styles.sidebarTitle}>Tìm Kiếm</h3>
            <SearchBar onSearch={setSearchQuery} />
          </div>
          <div>
            <h3 style={styles.sidebarTitle}>Danh Mục</h3>
            <SubCategoryFilter
              subCategories={subCategories}
              selectedSubCategories={selectedSubCategories}
              onSubCategoryChange={setSelectedSubCategories}
            />
          </div>
          <div>
            <h3 style={styles.sidebarTitle}>Thương Hiệu</h3>
            <BrandFilter
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandChange={setSelectedBrands}
            />
          </div>
          <div>
            <h3 style={styles.sidebarTitle}>Giá</h3>
            <PriceFilter onPriceChange={setPriceRange} />
          </div>
        </div>
      </Drawer>
    </CustomerLayout>
  );
};

export default Product;