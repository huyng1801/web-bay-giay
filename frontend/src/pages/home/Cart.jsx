import React, { useEffect, useState } from 'react';
import { 
    Typography, 
    Row, 
    Col, 
    Divider, 
    message, 
    Modal, 
    InputNumber,
    Spin
} from 'antd';
import { 
    DeleteOutlined, 
    ShoppingCartOutlined, 
    ShoppingOutlined 
} from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';
import { useNavigate } from 'react-router-dom';
import { 
    getProductById,
    getProductDetailsByProductId,
    getAvailableColorsByProductId,
    getAvailableSizesByProductAndColor,
    getProductImages
} from '../../services/home/HomeService';

const { Title, Text } = Typography;

const styles = {
    // Main wrapper
    container: {
        padding: '48px 0',
        background: '#f8fafc',
        minHeight: '100vh',
    },

    contentWrapper: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
    },

    // Page Header
    pageHeader: {
        marginBottom: '48px',
        textAlign: 'center',
    },

    pageTitle: {
        fontSize: '42px',
        fontWeight: '800',
        color: '#222',
        marginBottom: '12px',
        letterSpacing: '-0.5px',
        textTransform: 'uppercase',
    },

    pageTitleUnderline: {
        height: '3px',
        width: '80px',
        background: '#ff6b35',
        margin: '0 auto 24px',
        borderRadius: '2px',
    },

    // Cart items section
    cartItemsSection: {
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        border: '1px solid #eaeaea',
        padding: '32px 24px',
    },

    cartEmpty: {
        textAlign: 'center',
        padding: '80px 40px',
        background: '#f8fafc',
    },

    cartEmptyIcon: {
        fontSize: '80px',
        color: '#ddd',
        marginBottom: '24px',
    },

    emptyTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#222',
        marginBottom: '12px',
    },

    emptyText: {
        color: '#666',
        fontSize: '15px',
        marginBottom: '32px',
        lineHeight: '1.6',
    },

    shopNowButton: {
        height: '44px',
        fontSize: '15px',
        fontWeight: '700',
        background: 'linear-gradient(90deg, #ff6b35 0%, #ff8a50 100%)',
        border: 'none',
        borderRadius: '999px',
        padding: '0 40px',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.15)',
        color: '#fff',
    },

    // Cart header
    header: {
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '2px solid #ff6b35',
    },

    headerTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#666',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '-0.5px',
    },

    // Cart items
    cartItem: {
        marginBottom: '20px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1.5px solid #eaeaea',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        background: '#fff',
    },

    cartItemHover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        borderColor: '#ff6b35',
    },

    itemImage: {
        width: '140px',
        height: '140px',
        objectFit: 'cover',
        borderRadius: '8px',
        background: '#f4f6fb',
    },

    itemDetails: {
        padding: '20px',
        flex: 1,
    },

    itemName: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#222',
        marginBottom: '12px',
        lineHeight: '1.3',
    },

    itemInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#666',
        marginBottom: '8px',
        fontSize: '14px',
    },

    itemLabel: {
        fontWeight: '600',
        color: '#222',
    },

    itemValue: {
        color: '#999',
    },

    itemPrice: {
        fontSize: '20px',
        color: '#ff6b35',
        fontWeight: '700',
        marginTop: '12px',
        letterSpacing: '-0.5px',
    },

    itemOriginalPrice: {
        fontSize: '14px',
        color: '#999',
        textDecoration: 'line-through',
        marginLeft: '8px',
        fontWeight: '500',
    },

    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #eaeaea',
    },

    quantityLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#222',
        minWidth: '80px',
    },

    quantityInput: {
        width: '80px',
        height: '36px',
        borderRadius: '6px',
        border: '1.5px solid #eaeaea',
        fontSize: '14px',
    },

    deleteButton: {
        color: '#ff6b35',
        border: '1.5px solid #ff6b35',
        borderRadius: '999px',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        height: '36px',
        padding: '0 16px',
        fontSize: '13px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        cursor: 'pointer',
        background: '#fff',
    },

    deleteButtonHover: {
        background: '#ff6b35',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)',
        transform: 'translateY(-2px)',
    },

    // Summary section
    summaryWrapper: {
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        border: '1px solid #eaeaea',
        padding: '28px 24px',
        position: 'sticky',
        top: '100px',
    },

    summaryTitle: {
        fontSize: '20px',
        fontWeight: '800',
        marginBottom: '24px',
        color: '#222',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '2px solid #ff6b35',
        paddingBottom: '12px',
        display: 'inline-block',
    },

    summaryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
        fontSize: '15px',
        color: '#666',
    },

    summaryLabel: {
        fontWeight: '500',
        color: '#222',
    },

    summaryValue: {
        fontWeight: '600',
        color: '#222',
    },

    summaryDivider: {
        borderColor: '#eaeaea',
        margin: '20px 0',
    },

    summaryTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '18px',
        fontWeight: '700',
    },

    summaryTotalLabel: {
        color: '#222',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },

    summaryTotalValue: {
        color: '#ff6b35',
        fontSize: '24px',
        letterSpacing: '-0.5px',
    },

    checkoutButton: {
        width: '100%',
        height: '48px',
        fontSize: '15px',
        fontWeight: '700',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '999px',
        marginTop: '24px',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.20)',
        letterSpacing: '0.3px',
    },

    checkoutButtonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.30)',
        opacity: 0.95,
    },

    continueShoppingButton: {
        width: '100%',
        height: '44px',
        fontSize: '14px',
        fontWeight: '600',
        background: '#fff',
        border: '1.5px solid #eaeaea',
        borderRadius: '999px',
        marginTop: '12px',
        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
        color: '#222',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },

    continueShoppingButtonHover: {
        borderColor: '#ff6b35',
        background: '#fff9f6',
        color: '#ff6b35',
    },

    inputNumber: {
        width: '80px',
    },
};

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState({});
    const [imageErrors, setImageErrors] = useState({});
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price).replace('₫', 'VNĐ');
    };

    const handleImageError = (productId) => {
        setImageErrors(prev => ({
            ...prev,
            [productId]: true
        }));
    };

    useEffect(() => {
        const fetchCartDetails = async () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const details = {};

            try {
                await Promise.all(cart.map(async (item) => {
                    const [product, productDetails, productImages] = await Promise.all([
                        getProductById(item.productId),
                        getProductDetailsByProductId(item.productId),
                        getProductImages(item.productId)
                    ]);

                    // Find the specific product detail that matches this cart item
                    const selectedDetail = productDetails.find(detail => 
                        detail.color.colorId === item.colorId && detail.size.sizeId === item.sizeId
                    );

                    // Get main image or first image from product images
                    let imageUrl = product.mainImageUrl || '/placeholder-image.jpg';
                    if (productImages && productImages.length > 0) {
                        const mainImage = productImages.find(img => img.isMainImage);
                        imageUrl = mainImage?.imageUrl || productImages[0]?.imageUrl || '/placeholder-image.jpg';
                    }

                    details[item.productId] = {
                        ...product,
                        colorName: selectedDetail?.color?.colorName || selectedDetail?.color?.tenMau || 'N/A',
                        sizeValue: selectedDetail?.size?.sizeValue || selectedDetail?.size?.giaTri || 'N/A',
                        imageUrl: imageUrl
                    };
                }));

                setProductDetails(details);
                setCartItems(cart);
                calculateTotalPrice(cart);
            } catch (error) {
                console.error('Error fetching cart details:', error);
                message.error('Không thể tải thông tin giỏ hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchCartDetails();
    }, []);

    const calculateTotalPrice = (cart) => {
        const total = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = (index, value) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity = value;
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const handleRemoveItem = (index) => {
        const itemToRemove = cartItems[index];
        const details = productDetails[itemToRemove.productId];

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa "${details.productName}" khỏi giỏ hàng?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                const updatedCart = cartItems.filter((_, i) => i !== index);
                setCartItems(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                calculateTotalPrice(updatedCart);
                message.success(`Đã xóa ${details.productName} khỏi giỏ hàng`);
            }
        });
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <Spin size="large" />
                </div>
            </CustomerLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <CustomerLayout>
                <div style={styles.container}>
                    <div style={styles.contentWrapper}>
                        <div style={styles.cartEmpty}>
                            <ShoppingCartOutlined style={styles.cartEmptyIcon} />
                            <Title level={2} style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Title>
                            <Text style={styles.emptyText}>
                                Hãy thêm một số sản phẩm vào giỏ hàng của bạn và quay lại đây nhé!
                            </Text>
                            <div>
                                <button 
                                    style={styles.shopNowButton}
                                    onClick={() => navigate('/')}
                                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                                >
                                    Mua Sắm Ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <div style={styles.contentWrapper}>
                    {/* Page Header */}
                    <div style={styles.pageHeader}>
                        <Title level={1} style={styles.pageTitle}>Giỏ Hàng</Title>
                        <div style={styles.pageTitleUnderline}></div>
                    </div>

                    <Row gutter={[32, 32]}>
                        <Col xs={24} lg={16}>
                            <div style={styles.cartItemsSection}>
                                <div style={styles.header}>
                                    <Title level={3} style={styles.headerTitle}>Sản phẩm của bạn</Title>
                                </div>

                                {cartItems.map((item, index) => {
                                    const details = productDetails[item.productId] || {};
                                    return (
                                        <div 
                                            key={index} 
                                            style={{
                                                ...styles.cartItem,
                                                ...(hoveredItem === index ? styles.cartItemHover : {})
                                            }}
                                            onMouseEnter={() => setHoveredItem(index)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <Row gutter={16} align="middle" style={{ padding: '20px' }}>
                                                <Col xs={24} sm={6}>
                                                    {imageErrors[item.productId] ? (
                                                        <div style={{
                                                            ...styles.itemImage,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: '#f4f6fb'
                                                        }}>
                                                            <ShoppingCartOutlined style={{ fontSize: '48px', color: '#ccc' }} />
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={details.imageUrl || 'placeholder.jpg'}
                                                            alt={details.productName}
                                                            style={styles.itemImage}
                                                            onError={() => handleImageError(item.productId)}
                                                        />
                                                    )}
                                                </Col>
                                                <Col xs={24} sm={18}>
                                                    <div style={styles.itemDetails}>
                                                        <Text style={styles.itemName}>{details.productName}</Text>
                                                        
                                                        <div style={styles.itemInfo}>
                                                            <span style={styles.itemLabel}>Màu sắc:</span>
                                                            <span style={styles.itemValue}>{details.colorName}</span>
                                                        </div>

                                                        <div style={styles.itemInfo}>
                                                            <span style={styles.itemLabel}>Kích cỡ:</span>
                                                            <span style={styles.itemValue}>{details.sizeValue}</span>
                                                        </div>

                                                        <div style={{ marginTop: '8px' }}>
                                                            <Text style={styles.itemPrice}>
                                                                {formatPrice(item.unitPrice)}
                                                            </Text>
                                                        </div>
                                                        
                                                        <div style={styles.quantityControl}>
                                                            <span style={styles.quantityLabel}>Số lượng:</span>
                                                            <InputNumber
                                                                min={1}
                                                                max={details.stockQuantity || 1}
                                                                value={item.quantity}
                                                                onChange={(value) => handleQuantityChange(index, value)}
                                                                style={styles.quantityInput}
                                                            />
                                                            <button
                                                                onClick={() => handleRemoveItem(index)}
                                                                style={{
                                                                    ...styles.deleteButton,
                                                                    ...(hoveredButton === `delete-${index}` ? styles.deleteButtonHover : {})
                                                                }}
                                                                onMouseEnter={() => setHoveredButton(`delete-${index}`)}
                                                                onMouseLeave={() => setHoveredButton(null)}
                                                            >
                                                                <DeleteOutlined />
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    );
                                })}
                            </div>
                        </Col>

                        <Col xs={24} lg={8}>
                            <div style={styles.summaryWrapper}>
                                <Title level={4} style={styles.summaryTitle}>Tổng Đơn Hàng</Title>
                                
                                <div style={styles.summaryItem}>
                                    <span style={styles.summaryLabel}>Tạm tính:</span>
                                    <span style={styles.summaryValue}>{formatPrice(totalPrice)}</span>
                                </div>

                                <div style={styles.summaryItem}>
                                    <span style={styles.summaryLabel}>Phí vận chuyển:</span>
                                    <span style={styles.summaryValue}>Miễn phí</span>
                                </div>

                                <Divider style={styles.summaryDivider} />

                                <div style={styles.summaryTotal}>
                                    <span style={styles.summaryTotalLabel}>Tổng cộng</span>
                                    <span style={styles.summaryTotalValue}>
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>

                                <button
                                    style={{
                                        ...styles.checkoutButton,
                                        ...(hoveredButton === 'checkout' ? styles.checkoutButtonHover : {})
                                    }}
                                    onMouseEnter={() => setHoveredButton('checkout')}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={handleCheckout}
                                >
                                    Tiến Hành Thanh Toán
                                </button>

                                <button
                                    style={{
                                        ...styles.continueShoppingButton,
                                        ...(hoveredButton === 'continue' ? styles.continueShoppingButtonHover : {})
                                    }}
                                    onMouseEnter={() => setHoveredButton('continue')}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={() => navigate('/product')}
                                >
                                    Tiếp Tục Mua Sắm
                                </button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Cart;