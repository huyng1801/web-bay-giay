import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Rate, Typography, Spin } from 'antd';
import { 
    ShoppingCartOutlined, 
    CustomerServiceOutlined,
    SafetyOutlined,
    RocketOutlined,
    UserOutlined
} from '@ant-design/icons';
import ProductCard from './ProductCard';
const { Title } = Typography;

const styles = {
   

    // Best sellers section
    bestSellersSection: {
        padding: '60px 20px',
        backgroundColor: 'white',
        marginBottom: '60px',
    },

    sectionTitle: {
        textAlign: 'center',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '50px',
        color: '#2c3e50',
        position: 'relative',
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

    // Flash sale section
    flashSaleSection: {
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        marginBottom: '60px',
        borderRadius: '15px',
    },

    flashSaleTitle: {
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '30px',
        textAlign: 'center',
    },

    flashSaleProduct: {
        backgroundColor: 'white',
        borderRadius: '15px',
        overflow: 'hidden',
        textAlign: 'center',
        padding: '20px',
    },

    flashSaleImage: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        marginBottom: '15px',
        borderRadius: '10px',
    },

    flashSaleDiscount: {
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '25px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block',
        marginBottom: '10px',
    },

    flashSalePrice: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: '10px',
    },

    // Testimonials section
    testimonialsSection: {
        padding: '60px 20px',

    },

    testimonialCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        position: 'relative',
    },

    testimonialAvatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#667eea',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '30px',
        margin: '0 auto 15px',
    },

    testimonialText: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '15px',
        fontStyle: 'italic',
        lineHeight: '1.6',
        height: '80px',
    },

    testimonialAuthor: {
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '5px',
    },

  

};


// Flash Sale Section
export const FlashSaleSection = ({ products = [] }) => {
    const displayedProducts = products.slice(0, 4);

    return (
        <div style={styles.flashSaleSection}>
            <div style={styles.sectionContainer}>
                <div style={styles.flashSaleTitle}>⚡ Flash Sale - Giảm Giá Sốc Hôm Nay</div>
                <Row gutter={[20, 20]}>
                    {displayedProducts.map((product, idx) => (
                        <Col xs={24} sm={12} md={6} key={product.productId || idx}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

// Testimonials Section - Load from API
export const TestimonialsSection = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:8080/home/reviews/top?limit=4');
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                } else {
                    console.error('Failed to fetch reviews');
                    setReviews(getDefaultTestimonials());
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setReviews(getDefaultTestimonials());
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Default testimonials as fallback
    const getDefaultTestimonials = () => [
        {
            feedbackId: 1,
            customerName: 'Nguyễn Văn A',
            comment: 'Sản phẩm chất lượng tốt, giao hàng nhanh chóng. Tôi rất hài lòng!',
            rating: 5
        },
        {
            feedbackId: 2,
            customerName: 'Trần Thị B',
            comment: 'Giày fit vừa vặn, màu sắc đẹp mắt. Rất giải vị!',
            rating: 5
        },
        {
            feedbackId: 3,
            customerName: 'Lê Văn C',
            comment: 'Giá cả hợp lý, chất lượng đảm bảo. Sẽ quay lại mua thêm!',
            rating: 5
        },
        {
            feedbackId: 4,
            customerName: 'Phạm Thị D',
            comment: 'Customer service tuyệt vời, hỗ trợ nhanh gọn. Recommended!',
            rating: 5
        },
    ];

    const displayReviews = reviews.length > 0 ? reviews : getDefaultTestimonials();

    return (
        <div style={styles.testimonialsSection}>
            <div style={styles.sectionContainer}>
                <Title level={2} style={styles.sectionTitle}>
                    Đánh Giá Từ Khách Hàng
                    <div style={styles.sectionTitleAfter}></div>
                </Title>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin />
                    </div>
                ) : (
                    <Row gutter={[30, 30]}>
                        {displayReviews.map((review) => (
                            <Col xs={24} sm={12} md={6} key={review.feedbackId}>
                                <Card style={styles.testimonialCard} hoverable>
                                    <div style={styles.testimonialAvatar}>
                                        <UserOutlined />
                                    </div>
                                    <Rate 
                                        value={review.rating || 5} 
                                        disabled 
                                        style={{ marginBottom: '15px' }} 
                                    />
                                    <div style={styles.testimonialText}>
                                        "{review.comment || review.text}"
                                    </div>
                                    <div style={styles.testimonialAuthor}>
                                        {review.customerName || review.name}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    );
};
