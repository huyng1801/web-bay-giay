import React, { useEffect, useState } from 'react';
import { Typography, Spin, message, Row, Col, Form } from 'antd';
import CustomerLayout from '../../layouts/CustomerLayout';
import OrderCard from '../../components/order/OrderCard';
import FeedbackModal from '../../components/order/FeedbackModal';
import EmptyOrderState from '../../components/order/EmptyOrderState';
import OrderStatusHistory from '../../components/order/OrderStatusHistory';
import { 
    getOrdersByCustomerId, 
    cancelOrder, 
    getOrderStatusHistory, 
    getCustomerByEmail,
    getProductById,
    getProductDetailsByProductId 
} from '../../services/home/HomeService';
import { formatDate } from '../../utils/formatters';

import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const styles = {
    // Main wrapper
    container: {
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '48px 0',
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

    subtitle: {
        color: '#666',
        fontSize: '15px',
        lineHeight: '1.6',
    },

    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
    },
};

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetails, setProductDetails] = useState({}); // Store product details

    const [statusHistoryVisible, setStatusHistoryVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderStatusHistories, setOrderStatusHistories] = useState({}); // Store status histories for all orders
    const [customerFeedbacks, setCustomerFeedbacks] = useState({}); // Store customer feedbacks {orderId_productId: feedback}
    const navigate = useNavigate();
    
    // Form instance for feedback modal
    const [feedbackForm] = Form.useForm();
    
    // Load product details for order items
    const loadProductDetailsForOrders = async (orders) => {
        const details = {};
        
        for (const order of orders) {
            if (order.orderItems) {
                for (const item of order.orderItems) {
                    try {
                        // Get product details using productDetailsId
                        if (item.productDetailsId && !details[item.productDetailsId]) {
                            const [productData, allProductDetails] = await Promise.allSettled([
                                getProductById(item.productDetailsId), // This might need adjustment based on your API
                                getProductDetailsByProductId(item.productDetailsId)
                            ]);
                            
                            const product = productData.status === 'fulfilled' ? productData.value : null;
                            const productDetailsArray = allProductDetails.status === 'fulfilled' ? allProductDetails.value : [];
                            
                            // Find the specific product detail that matches this item
                            const specificDetail = productDetailsArray.find(detail => 
                                detail.productDetailsId === item.productDetailsId
                            ) || productDetailsArray[0]; // Fallback to first if exact match not found
                            
                            if (product && specificDetail) {
                                details[item.productDetailsId] = {
                                    ...product,
                                    ...specificDetail,
                                    productName: product.productName || specificDetail.productName || 'Sản phẩm không xác định',
                                    colorName: specificDetail.color?.colorName || specificDetail.color?.tenMau || 'Không xác định',
                                    sizeValue: specificDetail.size?.sizeValue || specificDetail.size?.giaTri || 'Không xác định',
                                    imageUrl: product.mainImageUrl || specificDetail.imageUrl || '/placeholder-image.jpg',
                                };
                            } else {
                                // Fallback if API calls fail
                                details[item.productDetailsId] = {
                                    productName: 'Sản phẩm không xác định',
                                    colorName: 'Không xác định',
                                    sizeValue: 'Không xác định',
                                    imageUrl: '/placeholder-image.jpg',
                                };
                            }
                        }
                    } catch (error) {
                        console.error(`Error loading product details for ${item.productDetailsId}:`, error);
                        // Provide fallback data
                        details[item.productDetailsId] = {
                            productName: 'Sản phẩm không xác định',
                            colorName: 'Không xác định', 
                            sizeValue: 'Không xác định',
                            imageUrl: '/placeholder-image.jpg',
                        };
                    }
                }
            }
        }
        
        setProductDetails(details);
    };

    useEffect(() => {
        const fetchOrderHistory = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwt');
                console.log('JWT Token:', token);
                
                if (!token) {
                    message.error('Vui lòng đăng nhập để xem lịch sử đơn hàng');
                    navigate('/login');
                    return;
                }

                const decodedToken = jwtDecode(token);
                console.log('Decoded token:', decodedToken);
                
                if (!decodedToken.sub) {
                    message.error('Token không hợp lệ, vui lòng đăng nhập lại');
                    navigate('/login');
                    return;
                }
                
                const customerData = await getCustomerByEmail(decodedToken.sub);
                console.log('Customer data:', customerData);
                
                if (customerData) {
                    setCustomerInfo(customerData);
                    console.log('Fetching orders for customer ID:', customerData.customerId);
                    
                    const orderHistory = await getOrdersByCustomerId(customerData.customerId);
                    console.log('Fetched order history:', orderHistory);
                    setOrders(orderHistory || []);
                    
                    // Load product details for all order items
                    if (orderHistory && orderHistory.length > 0) {
                        await loadProductDetailsForOrders(orderHistory);
                    }
                    
                    // Load status history for all orders
                    if (orderHistory && orderHistory.length > 0) {
                        const historyPromises = orderHistory.map(async (order) => {
                            try {
                                const history = await getOrderStatusHistory(order.orderId);
                                return { orderId: order.orderId, history };
                            } catch (error) {
                                console.error(`Error loading history for order ${order.orderId}:`, error);
                                return { orderId: order.orderId, history: [] };
                            }
                        });
                        
                        const allHistories = await Promise.all(historyPromises);
                        const historiesMap = {};
                        allHistories.forEach(({ orderId, history }) => {
                            historiesMap[orderId] = history;
                        });
                        setOrderStatusHistories(historiesMap);
                        
                  
                        const feedbacksMap = {};
                        
                        console.log('All customer feedbacks map:', feedbacksMap);
                        setCustomerFeedbacks(feedbacksMap);
                    }
                } else {
                    console.log('No customer data found');
                    message.error('Không tìm thấy thông tin khách hàng');
                }
            } catch (error) {
                console.error('Error fetching order history:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error.response,
                    stack: error.stack
                });
                message.error('Không thể tải lịch sử đơn hàng');
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [navigate]);





    const handleCancelOrder = async (orderId) => {
        // Kiểm tra có đang loading hay customerInfo chưa
        if (loading || !customerInfo?.customerId) {
            message.warning('Vui lòng đợi...');
            return;
        }

        try {
            setLoading(true);
            await cancelOrder(orderId, customerInfo.customerId, 'Khách hàng yêu cầu hủy đơn hàng');
            message.success('Đã hủy đơn hàng thành công!');
            
            // Cập nhật trực tiếp trạng thái đơn hàng trong state để UI phản hồi nhanh
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.orderId === orderId 
                        ? { ...order, orderStatus: 'CANCELED' }
                        : order
                )
            );
            
            // Reload lại toàn bộ orders để đảm bảo dữ liệu đồng bộ
            if (customerInfo && customerInfo.customerId) {
                try {
                    const orderData = await getOrdersByCustomerId(customerInfo.customerId);
                    setOrders(orderData);
                } catch (reloadError) {
                    console.error('Error reloading orders:', reloadError);
                    // Nếu reload fail thì vẫn giữ state đã update trước đó
                }
            }
        } catch (error) {
            console.error('Error canceling order:', error);
            message.error('Không thể hủy đơn hàng. Vui lòng thử lại sau!');
        } finally {
            setLoading(false);
        }
    };

    const handleFeedback = (product, orderId) => {
        const productId = product.productId || product.product_id || product.id;
        
        if (!productId || !orderId || !customerInfo?.customerId) {
            message.error('Không tìm thấy thông tin cần thiết');
            return;
        }
        
        setSelectedProduct({ 
            ...product, 
            orderId: orderId,
            productId: productId 
        });
        setFeedbackModalVisible(true);
    };

    const handleViewStatusHistory = (orderId) => {
        setSelectedOrderId(orderId);
        setStatusHistoryVisible(true);
    };

    const handleSubmitFeedback = async (values) => {
        try {
            // Product feedback feature has been removed for simplicity
            message.info('Tính năng đánh giá sản phẩm đã được gỡ bỏ để tinh gọn ứng dụng');
            
            // Reset form and close modal
            feedbackForm.resetFields();
            setFeedbackModalVisible(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error:', error);
            message.error('Có lỗi xảy ra khi gửi đánh giá');
        }
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div style={styles.spinner}>
                    <Spin size="large" />
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
                        <Title level={1} style={styles.pageTitle}>Lịch Sử Đơn Hàng</Title>
                        <div style={styles.pageTitleUnderline}></div>
                        <Text style={styles.subtitle}>
                            {customerInfo ? `Xin chào ${customerInfo.fullName}, ` : ''}xem lại tất cả các đơn hàng bạn đã đặt
                        </Text>
                    </div>

                    {orders.length === 0 ? (
                        <EmptyOrderState />
                    ) : (
                        <Row gutter={[0, 16]}>
                            {orders.map((order) => (
                                <Col span={24} key={order.orderId}>
                                    <OrderCard 
                                        order={order}
                                        onViewStatusHistory={handleViewStatusHistory}
                                        onCancelOrder={handleCancelOrder}
                                        onFeedback={handleFeedback}
                                        statusHistories={orderStatusHistories[order.orderId]}
                                        customerFeedbacks={customerFeedbacks}
                                        productDetails={productDetails}
                                        formatDate={formatDate}
                                        loading={loading}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>
            </div>

            <FeedbackModal
                open={feedbackModalVisible}
                selectedProduct={selectedProduct}
                form={feedbackForm}
                onSubmit={handleSubmitFeedback}
                onCancel={() => {
                    feedbackForm.resetFields();
                    setFeedbackModalVisible(false);
                    setSelectedProduct(null);
                }}
            />

            <OrderStatusHistory
                orderId={selectedOrderId}
                isAdmin={false}
                open={statusHistoryVisible}
                onClose={() => setStatusHistoryVisible(false)}
            />
        </CustomerLayout>
    );
};

export default OrderHistoryPage;
