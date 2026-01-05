import React, { useEffect, useState } from 'react';
import { Typography, Spin, Row, Col, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Banner from '../../components/home/Banner';
import { ShoppingCartOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';
import ProductCard from '../../components/home/ProductCard';
import CustomerLayout from '../../layouts/CustomerLayout';
import { 
    FlashSaleSection, 
    TestimonialsSection
} from '../../components/home/HomePageSections';
import { getSubCategories, getAllProducts } from '../../services/home/HomeService';
import { getPriceDisplayInfo } from '../../utils/priceUtils';

const { Title, Text } = Typography;

const styles = {
    // Main container
    container: {
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        paddingTop: '40px',
    },
    
    // Hero section
    heroSection: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        textAlign: 'center',
        color: 'white',
        marginBottom: '60px',
    },
    heroTitle: {
        fontSize: '3.5rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    heroSubtitle: {
        fontSize: '1.2rem',
        marginBottom: '30px',
        opacity: 0.9,
    },
    heroButton: {
        backgroundColor: '#ff6b35',
        borderColor: '#ff6b35',
        height: '50px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '25px',
        padding: '0 40px',
    },

    // Features section
    featuresSection: {
        padding: '60px 0',
        marginBottom: '60px',
    },
    featureCard: {
        textAlign: 'center',
        padding: '30px 20px',
        border: 'none',
        borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        height: '250px',
    },
    featureIcon: {
        fontSize: '3rem',
        color: '#ff6b35',
        marginBottom: '20px',
    },
    featureTitle: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '10px',
    },

    // Categories section
    categoriesSection: {
        padding: '60px 0',
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '50px',
        color: '#2c3e50',
        position: 'relative',
        texttransform: 'uppercase',
    },
    sectionTitleAfter: {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '4px',
        backgroundColor: '#ff6b35',
        borderRadius: '2px',
    },
    categoryCard: {
        overflow: 'hidden',
        borderRadius: '16px',
        border: '1px solid #eaeaea',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        position: 'relative',
    },
    categoryCardHover: {
        boxShadow: '0 8px 32px rgba(255,107,53,0.12)',
        borderColor: '#ff6b35',
    },
    categoryImageContainer: {
        overflow: 'hidden',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        height: '200px',
        position: 'relative',
    },
    categoryImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        transition: 'transform 0.3s cubic-bezier(.25,.8,.25,1)',
    },
    categoryContent: {
        padding: '20px',
        textAlign: 'center',
    },
    categoryTitle: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '10px',
    },
    categoryCount: {
        color: '#7f8c8d',
        fontSize: '0.9rem',
    },

    // Products section
    productsSection: {
        padding: '60px 0',
        backgroundColor: 'white',
    },
    productGrid: {
        marginTop: '40px',
    },


    error: {
        padding: '20px',
        textAlign: 'center',
        color: '#ff4d4f',
        background: '#fff2f0',
        borderRadius: '8px',
        marginTop: '20px',
    },
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
    }
};

const HomePage = () => {
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productsMap, setProductsMap] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const allSubCategories = await getSubCategories(null, null);
                
                // Fetch products for each subcategory
                const productsData = {};
                await Promise.all(
                    allSubCategories.map(async (subCategory) => {
                        const products = await getAllProducts(subCategory.subCategoryId, null, null);
                        // Filter for active products with images
                        const validProducts = products.filter(product => 
                            product.imageUrl && product.isActive === true
                        );
                        if (validProducts.length > 0) {
                            productsData[subCategory.subCategoryId] = validProducts;
                        }
                    })
                );
                
                setProductsMap(productsData);
                setSubCategories(allSubCategories);
            } catch (err) {
                setError("Không thể tải dữ liệu.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <CustomerLayout>
                <div style={styles.spinner}>
                    <Spin size="large" />
                </div>
            </CustomerLayout>
        );
    }

    if (error) {
        return (
            <CustomerLayout>
                <div style={styles.error}>{error}</div>
            </CustomerLayout>
        );
    }

    const subCategoriesWithProducts = subCategories.filter(
        subCategory => productsMap[subCategory.subCategoryId]
    );

    // Get featured products (first 8 products from all categories)
    const featuredProducts = [];
    Object.values(productsMap).forEach(products => {
        featuredProducts.push(...products.slice(0, 2));
    });
    const displayedProducts = featuredProducts.slice(0, 8);

    // Get products with highest discounts for flash sale
    const allProducts = Object.values(productsMap).flat();
    const flashSaleProducts = allProducts
        .filter(p => getPriceDisplayInfo(p).hasDiscount)
        .sort((a, b) => getPriceDisplayInfo(b).discountPercentage - getPriceDisplayInfo(a).discountPercentage)
        .slice(0, 4);

    return (
        <CustomerLayout>
    
                {/* Flatsome-style Banner */}
                <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '40px' }}>
                    <Banner />
                </div>
             



                {/* Categories Section */}
                <div style={styles.categoriesSection}>
                   
                        <Title level={2} style={styles.sectionTitle}>
                            Danh Mục Sản Phẩm
                            <div style={styles.sectionTitleAfter}></div>
                        </Title>
                        <Row gutter={[30, 30]}>
                            {subCategoriesWithProducts.slice(0, 4).map((subCategory) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={subCategory.subCategoryId}>
                                    <Card 
                                        style={styles.categoryCard} 
                                        hoverable
                                        cover={
                                            <div style={styles.categoryImageContainer}>
                                                <img 
                                                    src={productsMap[subCategory.subCategoryId][0]?.imageUrl || '/api/placeholder/300/200'} 
                                                    alt={subCategory.subCategoryName}
                                                    style={styles.categoryImage}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.transform = 'scale(1.08)';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                />
                                            </div>
                                        }
                                        onClick={() => navigate(`/product?subCategoryId=${subCategory.subCategoryId}&subCategoryName=${encodeURIComponent(subCategory.subCategoryName)}`)}
                                        onMouseEnter={e => {
                                            Object.assign(e.currentTarget.style, styles.categoryCardHover);
                                        }}
                                        onMouseLeave={e => {
                                            Object.assign(e.currentTarget.style, styles.categoryCard);
                                        }}
                                    >
                                        <div style={styles.categoryContent}>
                                            <Title level={4} style={styles.categoryTitle}>
                                                {subCategory.subCategoryName}
                                            </Title>
                                            <Text style={styles.categoryCount}>
                                                {productsMap[subCategory.subCategoryId]?.length || 0} sản phẩm
                                            </Text>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                 
                </div>

                {/* Featured Products Section */}
                <div style={styles.productsSection}>
                        <Title level={2} style={styles.sectionTitle}>
                            Sản Phẩm Nổi Bật
                            <div style={styles.sectionTitleAfter}></div>
                        </Title>
                        <Row gutter={[30, 30]} style={styles.productGrid}>
                            {displayedProducts.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                        
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <Button 
                                size="large" 
                                style={{ 
                                    backgroundColor: 'rgb(255, 107, 53)', 
                                    borderColor: 'rgb(255, 107, 53)',
                                    color: 'white',
                                    borderRadius: '25px',
                                    padding: '0 40px',
                                    height: '45px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => navigate('/product')}
                            >
                                Xem Tất Cả Sản Phẩm
                            </Button>
                        </div>
                </div>


                {/* Flash Sale Section */}
                {flashSaleProducts.length > 0 && <FlashSaleSection products={flashSaleProducts} />}
                
                {/* Features Section */}
                <div style={styles.featuresSection}>
                        <Title level={2} style={styles.sectionTitle}>
                            Tại Sao Chọn Poly Shoes?
                            <div style={styles.sectionTitleAfter}></div>
                        </Title>
                        <Row gutter={[30, 30]}>
                            <Col xs={24} sm={12} md={8}>
                                <Card style={styles.featureCard} hoverable>
                                    <ShoppingCartOutlined style={styles.featureIcon} />
                                    <Title level={4} style={styles.featureTitle}>Miễn Phí Vận Chuyển</Title>
                                    <Text>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</Text>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card style={styles.featureCard} hoverable>
                                    <HeartOutlined style={styles.featureIcon} />
                                    <Title level={4} style={styles.featureTitle}>Chất Lượng Đảm Bảo</Title>
                                    <Text>Sản phẩm chính hãng, chất lượng cao</Text>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card style={styles.featureCard} hoverable>
                                    <EyeOutlined style={styles.featureIcon} />
                                    <Title level={4} style={styles.featureTitle}>Hỗ Trợ 24/7</Title>
                                    <Text>Đội ngũ hỗ trợ khách hàng chuyên nghiệp</Text>
                                </Card>
                            </Col>
                        </Row>
                </div>

            
   
        </CustomerLayout>
    );
};

export default HomePage;