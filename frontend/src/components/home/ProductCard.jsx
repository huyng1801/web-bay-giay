
import React from 'react';
import PlaceholderImageIcon from '../common/PlaceholderImageIcon';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Tag } from 'antd';
import PriceDisplay from '../common/PriceDisplay';
import { getPriceDisplayInfo } from '../../utils/priceUtils';

const { Title } = Typography;

const styles = {
    card: {
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
    cardHover: {
        boxShadow: '0 8px 32px rgba(255,107,53,0.12)',
        borderColor: '#ff6b35',
    },
    imageContainer: {
        overflow: 'hidden',
        position: 'relative',
        paddingTop: '100%',
        background: '#f7f7f7',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s cubic-bezier(.25,.8,.25,1)',
        borderRadius: '12px',
    },
    imageHover: {
        transform: 'scale(1.08)',
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 2,
        fontSize: '13px',
        fontWeight: 'bold',
        background: 'rgb(255, 77, 79)',
        color: '#fff',
        borderRadius: 999,
        padding: '4px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },

    quickViewBtn: {
        background: '#ff6b35',
        color: '#fff',
        border: 'none',
    },
    content: {
        padding: '18px 16px 12px 16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    name: {
        fontSize: '17px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#222',
        lineHeight: '1.4',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
    price: {
        fontSize: '20px',
        color: '#ff4d4f',
        fontWeight: 'bold',
        marginTop: '4px',
        marginBottom: '2px',
    },
    priceTag: {
        background: '#fff3f0',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 10px',
        fontWeight: 'bold',
        fontSize: '15px',
    },
    buttonContainer: {
        display: 'flex',

        marginTop: '14px',
    },
    viewDetailBtn: {
        flex: 1,
        fontSize: '13px',
        height: '36px',
        borderRadius: '18px',
        fontWeight: 'bold',
        background: '#ff6b35',
        borderColor: '#ff6b35',
        color: '#fff',
    },
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Get main product image - prioritize mainImageUrl, then fall back to imageUrl
    const getProductImage = () => {
        if (product.mainImageUrl && typeof product.mainImageUrl === 'string' && product.mainImageUrl.trim() !== '') {
            return product.mainImageUrl;
        }
        if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '') {
            return product.imageUrl;
        }
        return null;
    };

    const [imgError, setImgError] = React.useState(false);

    // Flatsome-style badges
    const renderBadge = () => {
        const priceInfo = getPriceDisplayInfo(product);
        if (priceInfo.hasDiscount) {
            return (
                <span style={styles.badge}>-{priceInfo.discountPercentage}%</span>
            );
        }
        if (product.isNew) {
            return <span style={{ ...styles.badge, background: 'rgb(255, 77, 79)' }}>Mới</span>;
        }
        return null;
    };

    // Check if product is in stock (has available colors and sizes)
    const isInStock = product.isActive !== false;

    return (
        <Card
            style={{
                ...styles.card,
                ...(isHovered ? styles.cardHover : {}),
                ...(product.isActive === false ? { opacity: 0.6 } : {})
            }}
            bodyStyle={{ padding: 0 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate(`/product/${product.productId}`)}
            cover={
                <div style={styles.imageContainer}>
                    {renderBadge()}
                    {!isInStock && (
                        <span style={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            zIndex: 2,
                            background: 'rgba(0,0,0,0.7)',
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            Hết hàng
                        </span>
                    )}
                    {getProductImage() && !imgError ? (
                        <img
                            src={getProductImage()}
                            alt={product.productName}
                            style={{
                                ...styles.image,
                                ...(isHovered ? styles.imageHover : {})
                            }}
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div style={{
                            ...styles.image,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f7f7f7',
                        }}>
                            <PlaceholderImageIcon size={48} />
                        </div>
                    )}
                </div>
            }
        >
            <div style={styles.content}>
                <Title level={5} style={styles.name}>{product.productName}</Title>
                
                {/* Brand info if available */}
                {product.brand && (
                    <div style={{
                        fontSize: '12px',
                        color: '#999',
                        marginBottom: '6px',
                        fontWeight: '500'
                    }}>
                        {product.brand.brandName || product.brandName}
                    </div>
                )}
                
                <Tag style={styles.priceTag}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {(() => {
                            const priceInfo = getPriceDisplayInfo(product);
                            return (
                                <PriceDisplay
                                    originalPrice={priceInfo.originalPrice}
                                    salePrice={priceInfo.finalPrice}
                                    originalStyle={{ fontSize: '13px' }}
                                    saleStyle={{ fontSize: '18px', color: '#ff4d4f' }}
                                />
                            );
                        })()}
                    </div>
                </Tag>
            </div>
        </Card>
    );
};

export default ProductCard;
