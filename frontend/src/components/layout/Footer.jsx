import React from 'react';
import { Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
    FacebookOutlined, 
    InstagramOutlined, 
    ShopOutlined,
    LinkedinOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';
import ChatbotWidget from '../chatbot/ChatbotWidget';

const { Text } = Typography;

const styles = {
    // Main footer container
    footerMain: {
        backgroundColor: '#2c3e50',
        color: '#fff',
    },

    // Top footer section (content)
    footerContent: {
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '60px 20px 30px',
    },

    // Column
    footerColumn: {
        marginBottom: '30px',
    },

    // Section title
    sectionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '2px solid #ff6b35',
        paddingBottom: '10px',
    },

    // Text styles
    columnText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '14px',
        lineHeight: '1.8',
        marginBottom: '12px',
    },

    // Link style
    footerLink: {
        color: 'rgba(255, 255, 255, 0.8)',
        textDecoration: 'none',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        display: 'block',
        marginBottom: '8px',
        cursor: 'pointer',
    },

    footerLinkHover: {
        color: '#ff6b35',
        paddingLeft: '8px',
    },

    // Contact item
    contactItem: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '15px',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '14px',
    },

    contactIcon: {
        marginRight: '12px',
        color: '#fff',
        fontSize: '16px',
        minWidth: '20px',
        marginTop: '2px',
    },

    // Social icons
    socialIcons: {
        display: 'flex',
        gap: '15px',
        marginTop: '15px',
    },

    socialIcon: {
        fontSize: '20px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: '#667eea',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
    },

    socialIconHover: {
        backgroundColor: '#ff6b35',
        transform: 'translateY(-3px)',
    },

    // Divider
    divider: {
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        margin: '30px 0',
    },

    // Bottom footer
    footerBottom: {
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        textAlign: 'center',
    },

    copyright: {
        color: 'rgba(255, 255, 255, 0.65)',
        fontSize: '13px',
        marginBottom: '10px',
    },

    footerLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
    },

    footerBottomLink: {
        color: 'rgba(255, 255, 255, 0.65)',
        textDecoration: 'none',
        fontSize: '13px',
        transition: 'color 0.3s ease',
        cursor: 'pointer',
    },
};

const Footer = () => {
    const [hoveredIcon, setHoveredIcon] = React.useState(null);
    const [hoveredLink, setHoveredLink] = React.useState(null);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleSocialClick = (platform) => {
        switch(platform) {
            case 'facebook':
                window.open('https://www.facebook.com/share/16JXfMK6XM/?mibextid=wwXIfr', '_blank');
                break;
            case 'instagram':
                window.open('https://www.instagram.com/studio_polyshoes', '_blank');
                break;
            case 'shopee':
                window.open('https://shopee.vn/polyshoes.vn', '_blank');
                break;
            default:
                break;
        }
    };

    return (
        <>
            <footer style={styles.footerMain}>
                {/* Main content */}
                <div style={styles.footerContent}>
                <Row gutter={[40, 30]}>
                    {/* About section with logo */}
                    <Col xs={24} sm={12} md={6}>
                        <div style={styles.footerColumn}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                <img src="/logo.jpg" alt="Poly Shoes Logo" style={{ height: 80, marginRight: 12, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                            </div>
                            <Text style={styles.columnText}>
                                Poly Shoes là điểm đến lý tưởng cho những ai yêu thích thời trang chất lượng cao. Chúng tôi cam kết mang đến những sản phẩm tuyệt vời với giá cả hợp lý.
                            </Text>
                        </div>
                    </Col>

                    {/* Quick Links */}
                    <Col xs={24} sm={12} md={6}>
                        <div style={styles.footerColumn}>
                            <div style={styles.sectionTitle}>Liên Kết Nhanh</div>
                            {[
                                { name: 'Trang Chủ', path: '/' },
                                { name: 'Sản Phẩm', path: '/product' },
                                { name: 'Giới Thiệu', path: '/about' },
                                { name: 'Liên Hệ', path: '/contact' }
                            ].map((link, idx) => (
                                <a
                                    key={idx}
                                    onClick={() => handleNavigation(link.path)}
                                    style={styles.footerLink}
                                    onMouseEnter={(e) => {
                                        setHoveredLink(idx);
                                        Object.assign(e.currentTarget.style, styles.footerLinkHover);
                                    }}
                                    onMouseLeave={(e) => {
                                        setHoveredLink(null);
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                        e.currentTarget.style.paddingLeft = '0';
                                    }}
                                >
                                    → {link.name}
                                </a>
                            ))}
                        </div>
                    </Col>

                    {/* Policies */}
                    <Col xs={24} sm={12} md={6}>
                        <div style={styles.footerColumn}>
                            <div style={styles.sectionTitle}>Chính Sách</div>
                            {[
                                { name: 'Chính sách vận chuyển', path: '/shipping-policy' },
                                { name: 'Chính sách đổi trả', path: '/return-policy' },
                                { name: 'Chính sách bảo mật', path: '/privacy-policy' },
                                { name: 'Điều khoản sử dụng', path: '/terms-of-service' }
                            ].map((policy, idx) => (
                                <a
                                    key={idx}
                                    onClick={() => handleNavigation(policy.path)}
                                    style={styles.footerLink}
                                    onMouseEnter={(e) => {
                                        setHoveredLink(`policy-${idx}`);
                                        Object.assign(e.currentTarget.style, styles.footerLinkHover);
                                    }}
                                    onMouseLeave={(e) => {
                                        setHoveredLink(null);
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                        e.currentTarget.style.paddingLeft = '0';
                                    }}
                                >
                                    → {policy.name}
                                </a>
                            ))}
                        </div>
                    </Col>

                    {/* Contact & Social */}
                    <Col xs={24} sm={12} md={6}>
                        <div style={styles.footerColumn}>
                            <div style={styles.sectionTitle}>Liên Hệ</div>
                            <div style={styles.contactItem}>
                                <EnvironmentOutlined style={styles.contactIcon} />
                                <span>Hà Nội, Việt Nam</span>
                            </div>
                            <div style={styles.contactItem}>
                                <PhoneOutlined style={styles.contactIcon} />
                                <span>+84 123 456 789</span>
                            </div>
                            <div style={styles.contactItem}>
                                <MailOutlined style={styles.contactIcon} />
                                <span>support@polyshoes.com</span>
                            </div>
                            <div style={styles.socialIcons}>
                                <div
                                    style={{
                                        ...styles.socialIcon,
                                        ...(hoveredIcon === 'fb' ? styles.socialIconHover : {})
                                    }}
                                    onMouseEnter={() => setHoveredIcon('fb')}
                                    onMouseLeave={() => setHoveredIcon(null)}
                                    onClick={() => handleSocialClick('facebook')}
                                >
                                    <FacebookOutlined />
                                </div>
                                <div
                                    style={{
                                        ...styles.socialIcon,
                                        ...(hoveredIcon === 'ig' ? styles.socialIconHover : {})
                                    }}
                                    onMouseEnter={() => setHoveredIcon('ig')}
                                    onMouseLeave={() => setHoveredIcon(null)}
                                    onClick={() => handleSocialClick('instagram')}
                                >
                                    <InstagramOutlined />
                                </div>
                                <div
                                    style={{
                                        ...styles.socialIcon,
                                        ...(hoveredIcon === 'shopee' ? styles.socialIconHover : {})
                                    }}
                                    onMouseEnter={() => setHoveredIcon('shopee')}
                                    onMouseLeave={() => setHoveredIcon(null)}
                                    onClick={() => handleSocialClick('shopee')}
                                >
                                    <ShopOutlined />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Bottom footer */}
            <div style={styles.footerBottom}>
                <div style={styles.copyright}>
                    © 2024 Poly Shoes. All Rights Reserved.
                </div>
                <div style={styles.footerLinks}>
                    <a onClick={() => handleNavigation('/privacy-policy')} style={styles.footerBottomLink} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}>
                        Chính Sách Bảo Mật
                    </a>
                    <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
                    <a onClick={() => handleNavigation('/terms-of-service')} style={styles.footerBottomLink} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}>
                        Điều Khoản Sử Dụng
                    </a>
                    <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
                    <a onClick={() => handleNavigation('/contact')} style={styles.footerBottomLink} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6b35'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}>
                        Liên Hệ Với Chúng Tôi
                    </a>
                </div>
            </div>
        </footer>
        
        {/* Chatbot Widget */}
        <ChatbotWidget />
        </>
    );
};

export default Footer;