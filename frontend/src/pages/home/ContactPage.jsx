import React from 'react';
import { 
    Form, 
    Input, 
    Button, 
    Row, 
    Col, 
    Typography, 
    message
} from 'antd';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';

const { Title, Text } = Typography;
const { TextArea } = Input;

const styles = {
    container: {
        padding: '0',
        minHeight: '100vh',
        background: '#fff',
    },

    pageHeader: {
        background: '#fff',
        padding: '36px 12px 24px',
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
        fontSize: '2.8rem',
        fontWeight: '800',
        color: '#222',
        margin: '0 0 8px 0',
        letterSpacing: '1px',
        borderBottom: '3px solid rgb(255, 107, 53)',
        display: 'inline-block',
        paddingBottom: '6px',
    },

    pageBreadcrumb: {
        fontSize: '14px',
        color: '#888',
        margin: '0',
        letterSpacing: '0.5px',
    },

    // Content wrapper
    contentWrapper: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 12px 60px',
    },

    // Description section
    description: {
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#666',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '20px auto 0',
    },

    sectionTitle: {
        fontSize: '2.2rem',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '8px',
        textAlign: 'center',
        letterSpacing: '0.5px',
    },
    sectionTitleAfter: {
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '4px',
        backgroundColor: '#ff6b35',
        borderRadius: '2px',
    },
    section: {
        marginBottom: '60px',
        background: '#fff',
        padding: '40px 24px',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1.5px solid #eaeaea',
    },

    // Contact info cards
    infoCard: {
        background: '#fff',
        borderRadius: '15px',
        padding: '24px',
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1.5px solid #eaeaea',
        transition: 'all 0.3s ease',
    },

    infoCardHover: {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(102,126,234,0.15)',
        borderColor: '#667eea',
    },

    infoIcon: {
        fontSize: '2.5rem',
        color: '#667eea',
        marginBottom: '12px',
    },

    infoTitle: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '8px',
    },

    infoText: {
        color: '#666',
        fontSize: '15px',
        lineHeight: '1.6',
    },

    // Form section
    formSection: {
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1.5px solid #eaeaea',
    },

    formTitle: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '24px',
        textAlign: 'center',
        position: 'relative',
        paddingBottom: '16px',
    },

    formInput: {
        borderRadius: '8px',
        border: '1.5px solid #eaeaea',
        fontSize: '15px',
        padding: '10px 14px',
        transition: 'all 0.3s ease',
    },

    submitButton: {
        width: '100%',
        height: '44px',
        fontSize: '16px',
        fontWeight: '600',
        background: '#667eea',
        border: 'none',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        color: '#fff',
    },

    // Map section
    mapContainer: {
        marginTop: '24px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1.5px solid #eaeaea',
    },

    map: {
        width: '100%',
        height: '350px',
        border: 'none',
    },
};

const ContactPage = () => {
    const [form] = Form.useForm();
    const [hoveredCard, setHoveredCard] = React.useState(null);

    const onFinish = (values) => {
        console.log('Form values:', values);
        message.success('Cảm ơn bạn đã liên hệ với chúng tôi!');
        form.resetFields();
    };

    const contactInfo = [
        {
            id: 1,
            icon: <EnvironmentOutlined style={styles.icon} />,
            title: 'Địa Chỉ',
            content: 'Hà Nội'
        },
        {
            id: 2,
            icon: <PhoneOutlined style={styles.icon} />,
            title: 'Điện Thoại',
            content: '+84 123 456 789'
        },
        {
            id: 3,
            icon: <MailOutlined style={styles.icon} />,
            title: 'Email',
            content: 'contact@Poly Shoes.com'
        },
        {
            id: 4,
            icon: <ClockCircleOutlined style={styles.icon} />,
            title: 'Giờ Làm Việc',
            content: 'Thứ 2 - Chủ Nhật: 9:00 - 21:00'
        }
    ];

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <div style={styles.contentWrapper}>
                    
                    {/* Section: Contact Info & Map */}
                    <div style={styles.section}>
                        <Title level={2} style={{ ...styles.sectionTitle, position: 'relative', marginBottom: '24px' }}>
                            Thông Tin Liên Hệ
                            <div style={styles.sectionTitleAfter}></div>
                        </Title>
                        <Row gutter={[0, 16]}>
                            {contactInfo.map(info => (
                                <Col xs={24} sm={12} key={info.id}>
                                    <div
                                        style={{
                                            ...styles.infoCard,
                                            ...(hoveredCard === info.id ? styles.infoCardHover : {})
                                        }}
                                        onMouseEnter={() => setHoveredCard(info.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div style={styles.infoIcon}>{info.icon}</div>
                                        <Title level={5} style={styles.infoTitle}>{info.title}</Title>
                                        <Text style={styles.infoText}>{info.content}</Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <div style={styles.mapContainer}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29793.98045311035!2d105.81636407392857!3d21.02277841929238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1758636383805!5m2!1svi!2s"
                                style={styles.map}
                                allowFullScreen=""
                                loading="lazy"
                                title="Location Map"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default ContactPage;