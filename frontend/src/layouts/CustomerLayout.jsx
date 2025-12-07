import React, { useState, useEffect } from 'react';
import { Layout, Button, Drawer } from 'antd';
import { message } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { MenuOutlined, ShoppingCartOutlined, UserOutlined, CloseOutlined, HeartOutlined } from '@ant-design/icons';
import { ShoppingOutlined } from '@ant-design/icons';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';

const { Content } = Layout;

const styles = {
    // Layout
    layout: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
    },

    // Main content wrapper
    mainContent: {
        flex: 1,
        width: '100%',
    },

    // Content area
    content: {
        paddingTop: '0',
        backgroundColor: '#f8f9fa',
        minHeight: 'calc(100vh - 200px)',
    },

    // Top bar (contact info)
    topBar: {
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '12px 0',
        fontSize: '13px',
        borderBottom: '1px solid #34495e',
        position: 'sticky',
        top: 0,
        zIndex: 999,
    },

    topBarContent: {
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
    },

    topBarLeft: {
        display: 'flex',
        gap: '30px',
        alignItems: 'center',
    },

    topBarRight: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
    },

    topBarLink: {
        color: 'white',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'color 0.3s ease',
    },

    topBarLinkHover: {
        color: '#ff6b35',
    },

    // Header main
    headerMain: {
        backgroundColor: 'white',
        padding: '15px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: '35px',
        zIndex: 998,
    },

    headerContent: {
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '30px',
    },

    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#667eea',
        textDecoration: 'none',
        minWidth: '150px',
    },

    searchBar: {
        flex: 1,
        display: 'flex',
        maxWidth: '400px',
    },

    searchInput: {
        width: '100%',
        padding: '10px 15px',
        border: '2px solid #e0e0e0',
        borderRadius: '25px',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.3s ease',
    },

    headerActions: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
    },

    headerIcon: {
        fontSize: '18px',
        cursor: 'pointer',
        color: '#2c3e50',
        transition: 'color 0.3s ease',
        position: 'relative',
    },

    cartBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        backgroundColor: '#e74c3c',
        color: 'white',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 'bold',
    },

    // Breadcrumb
    breadcrumb: {
        padding: '15px 0',
        marginBottom: '0',
    },

    breadcrumbContent: {
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 20px',
        fontSize: '13px',
    },

    breadcrumbItem: {
        color: '#667eea',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'color 0.3s ease',
    },

    breadcrumbSeparator: {
        margin: '0 10px',
        color: '#999',
    },

    // Page wrapper
    pageWrapper: {
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 20px',
        width: '100%',
    },

    // Child content area
    childContent: {
        backgroundColor: 'white',
        padding: '40px',
        minHeight: 'calc(100vh - 300px)',
        borderRadius: '0',
        boxShadow: 'none',
    },

    // Mobile menu button
    mobileMenuBtn: {
        display: 'none',
    },

    // Responsive adjustments
    '@media (max-width: 768px)': {
        headerContent: {
            flexWrap: 'wrap',
            gap: '10px',
        },
        searchBar: {
            maxWidth: '100%',
            order: 3,
            width: '100%',
        },
        headerActions: {
            gap: '10px',
        },
        topBarContent: {
            flexDirection: 'column',
            textAlign: 'center',
            gap: '8px',
        },
    },
};

const CustomerLayout = ({ children }) => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [cartCount, setCartCount] = useState(0);
    // Update cart count from localStorage
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(total);
        };
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    // Get breadcrumb items
    const getPageName = (path) => {
        const pathMap = {
            '/': 'Trang Chủ',
            '/product': 'Sản Phẩm',
            '/cart': 'Giỏ Hàng',
            '/checkout': 'Thanh Toán',
            '/orders': 'Lịch Sử Đơn Hàng',
            '/profile': 'Hồ Sơ',
            '/about': 'Về Chúng Tôi',
            '/contact': 'Liên Hệ',
            '/login': 'Đăng Nhập',
            '/register': 'Đăng Ký',
        };
        return pathMap[path] || 'Trang';
    };

    const currentPageName = getPageName(location.pathname);
    const isHomepage = location.pathname === '/';

    // User info for top bar
    const [customerInfo, setCustomerInfo] = useState(null);
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const { getCustomerByEmail } = await import('../services/home/HomeService');
                    const customer = await getCustomerByEmail(decodedToken.sub);
                    setCustomerInfo(customer);
                } catch (err) {
                    setCustomerInfo(null);
                }
            } else {
                setCustomerInfo(null);
            }
        };
        fetchUserInfo();
        const handleStorageChange = () => fetchUserInfo();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        setCustomerInfo(null);
        message.success('Đã đăng xuất!');
        window.location.reload();
    };

    return (
        <Layout style={styles.layout}>
            {/* Top Bar */}
            <div style={styles.topBar}>
                <div style={styles.topBarContent}>
                    <div style={styles.topBarLeft}>
                        <span>📞 Hotline: 1800-xxx-xxx</span>
                        <span>✉️ Email: support@polyshoes.com</span>
                    </div>
                    <div style={styles.topBarRight}>
                        {customerInfo ? (
                            <>
                                <span style={{ color: '#ff6b35', fontWeight: 600 }}>
                                    👋 Xin chào, {customerInfo.fullName || customerInfo.email}
                                </span>
                                <span> | </span>
                                <button onClick={handleLogout} style={{...styles.topBarLink, background: 'none', border: 'none', padding: 0, font: 'inherit'}}>Đăng Xuất</button>
                            </>
                        ) : (
                            <>
                                <a href="/login" style={styles.topBarLink}>Đăng Nhập</a>
                                <span> | </span>
                                <a href="/register" style={styles.topBarLink}>Đăng Ký</a>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Header Main */}
            <div style={styles.headerMain}>
                <div style={styles.headerContent}>
                    {/* Logo */}
                    <Link to="/" style={styles.logo}>
                        <img src="/logo.png" alt="Poly Shoes Logo" style={{ height: '40px', objectFit: 'contain', display: 'block' }} />
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div style={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={styles.searchInput}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Header Actions */}
                    <div style={styles.headerActions}>

                        {customerInfo && (
                            <>
                                <div 
                                    style={styles.headerIcon}
                                    onClick={() => window.location.href = '/orders'}
                                    title="Lịch Sử Đơn Hàng"
                                >
                                    <HeartOutlined />
                                </div>
                                <div 
                                    style={styles.headerIcon}
                                    onClick={() => window.location.href = '/profile'}
                                    title="Tài Khoản"
                                >
                                    <UserOutlined />
                                </div>
                            </>
                        )}
                        <div 
                            style={styles.headerIcon}
                            onClick={() => window.location.href = '/cart'}
                            title="Giỏ Hàng"
                        >
                            <ShoppingCartOutlined />
                            {cartCount > 0 && (
                                <span style={styles.cartBadge}>{cartCount}</span>
                            )}
                        </div>
                        <Button 
                            type="text" 
                            icon={<MenuOutlined />}
                            style={styles.mobileMenuBtn}
                            onClick={() => setMobileMenuOpen(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <Navigation />

            {/* Breadcrumb */}
            {!isHomepage && (
                <div style={styles.breadcrumb}>
                    <div style={styles.breadcrumbContent}>
                        <Link to="/" style={styles.breadcrumbItem}>Trang Chủ</Link>
                        <span style={styles.breadcrumbSeparator}> / </span>
                        <span style={{ color: '#666' }}>{currentPageName}</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <Content style={styles.mainContent}>
                <div style={styles.content}>
                    <div style={styles.pageWrapper}>
                        <div style={styles.childContent}>
                            {children}
                        </div>
                    </div>
                </div>
            </Content>

            {/* Footer */}
            <Footer />

            {/* Mobile Menu Drawer */}
            <Drawer
                title="Menu"
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                closeIcon={<CloseOutlined />}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang Chủ</Link>
                    <Link to="/product" onClick={() => setMobileMenuOpen(false)}>Sản Phẩm</Link>
                    <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Về Chúng Tôi</Link>
                    <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Liên Hệ</Link>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>Đơn Hàng</Link>
                </div>
            </Drawer>
        </Layout>
    );
};

export default CustomerLayout;
