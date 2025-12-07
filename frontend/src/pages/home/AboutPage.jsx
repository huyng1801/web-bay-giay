import React from 'react';
import { Typography, Row, Col } from 'antd';
import { 
    TeamOutlined, 
    HeartOutlined, 
    EnvironmentOutlined,
    CheckCircleOutlined 
} from '@ant-design/icons';
import CustomerLayout from '../../layouts/CustomerLayout';

const { Title, Paragraph, Text } = Typography;

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

    section: {
        marginBottom: '60px',
        background: '#fff',
        padding: '40px 24px',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1.5px solid #eaeaea',
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

    description: {
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#666',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '20px auto 0',
    },

    valueCard: {
        height: '100%',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        border: 'none',
        background: '#fff',
        textAlign: 'center',
        padding: '30px 20px',
    },

    valueCardHover: {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(102,126,234,0.2)',
    },

    valueIcon: {
        fontSize: '3.5rem',
        color: '#667eea',
        marginBottom: '16px',
    },

    valueTitle: {
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#2c3e50',
        marginTop: '16px',
        marginBottom: '12px',
    },

    missionList: {
        marginTop: '30px',
    },

    missionItem: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '16px',
        padding: '18px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        border: '1.5px solid #eaeaea',
    },

    missionIcon: {
        color: '#27ae60',
        fontSize: '24px',
        marginRight: '16px',
        marginTop: '2px',
        flexShrink: 0,
    },

    missionText: {
        flex: 1,
        fontSize: '16px',
        color: '#444',
        fontWeight: '500',
    },

    policyContainer: {
        background: '#fff',
        padding: '40px 24px',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1.5px solid #eaeaea',
        marginBottom: '60px',
    },

    policyTitle: {
        fontSize: '2.2rem',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '8px',
        textAlign: 'center',
        letterSpacing: '0.5px',
    },

    policyContent: {
        marginTop: '24px',
        fontSize: '16px',
        color: '#222',
        lineHeight: '1.8',
    },

    policyList: {
        marginLeft: '24px',
        marginBottom: '16px',
        marginTop: '12px',
    },

    policyNote: {
        background: '#fff8f3',
        borderRadius: '12px',
        padding: '18px',
        color: '#e67e22',
        fontSize: '15px',
        marginBottom: '18px',
        border: '1.5px solid #ffe7d9',
        lineHeight: '1.8',
    },

    policyThanks: {
        color: '#667eea',
        fontWeight: 'bold',
        fontSize: '17px',
        textAlign: 'center',
        marginTop: '24px',
        lineHeight: '1.6',
    },
};

const AboutPage = () => {
    const [hoveredCard, setHoveredCard] = React.useState(null);

    const values = [
        {
            id: 1,
            icon: <TeamOutlined />,
            title: 'Khách Hàng Là Trọng Tâm',
            description: 'Chúng tôi luôn đặt nhu cầu và sự hài lòng của khách hàng lên hàng đầu.'
        },
        {
            id: 2,
            icon: <HeartOutlined />,
            title: 'Chất Lượng Vượt Trội',
            description: 'Cam kết mang đến những sản phẩm chất lượng cao với giá cả hợp lý.'
        },
        {
            id: 3,
            icon: <EnvironmentOutlined />,
            title: 'Trách Nhiệm Môi Trường',
            description: 'Chúng tôi luôn quan tâm đến việc bảo vệ môi trường trong mọi hoạt động.'
        }
    ];

    const missions = [
        'Cung cấp các sản phẩm quần áo chất lượng cao với giá cả phải chăng',
        'Xây dựng môi trường mua sắm trực tuyến an toàn và thuận tiện',
        'Thúc đẩy xu hướng quần áo bền vững và thân thiện với môi trường',
        'Tạo ra trải nghiệm mua sắm độc đáo và cá nhân hóa cho khách hàng'
    ];

    return (
        <CustomerLayout>
            <div style={styles.container}>
                <div style={styles.contentWrapper}>
                    {/* About Section */}
                    <SectionWithTitle
                        title="Về Poly Shoes"
                        description="Poly Shoes là điểm đến lý tưởng cho những người yêu thích quần áo chất lượng. Với hơn 5 năm kinh nghiệm trong ngành, chúng tôi tự hào mang đến những sản phẩm quần áo chất lượng cao, thân thiện với môi trường và theo kịp xu hướng quần áo hiện đại."
                    />
                    {/* Values Section */}
                    <SectionWithTitle title="Giá Trị Cốt Lõi">
                        <Row gutter={[24, 24]}>
                            {values.map(value => (
                                <Col xs={24} sm={12} md={8} key={value.id}>
                                    <div
                                        style={{
                                            ...styles.valueCard,
                                            ...(hoveredCard === value.id ? styles.valueCardHover : {})
                                        }}
                                        onMouseEnter={() => setHoveredCard(value.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div style={styles.valueIcon}>{value.icon}</div>
                                        <Title level={4} style={styles.valueTitle}>{value.title}</Title>
                                        <Text style={{ color: '#666', fontSize: '15px' }}>{value.description}</Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </SectionWithTitle>
                    {/* Mission Section */}
                    <SectionWithTitle title="Sứ Mệnh">
                        <div style={styles.missionList}>
                            {missions.map((mission, index) => (
                                <div 
                                    key={index} 
                                    style={styles.missionItem}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateX(8px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                    }}
                                >
                                    <CheckCircleOutlined style={styles.missionIcon} />
                                    <Text style={styles.missionText}>{mission}</Text>
                                </div>
                            ))}
                        </div>
                    </SectionWithTitle>
                    {/* Policy Section */}
                    <div style={styles.policyContainer}>
                        <Title level={2} style={{ ...styles.policyTitle, position: 'relative', marginBottom: '24px' }}>
                            Chính Sách Hỗ Trợ Poly Shoes
                            <div style={styles.sectionTitleAfter}></div>
                        </Title>
                        <div style={styles.policyContent}>
                            <Paragraph>
                                Poly Shoes cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng với các chính sách hỗ trợ sau:
                            </Paragraph>
                            <ul style={styles.policyList}>
                                <li>Cam kết đổi trả <b>15 ngày</b> theo chính sách của sàn.</li>
                                <li>Nếu có bất kì khiếu nại cần polyshoes hỗ trợ về sản phẩm, bạn vui lòng <b>quay video quá trình mở sản phẩm</b> để được đảm bảo đổi lại sản phẩm mới nếu trong quá trình giao hàng bị hư hỏng hàng hóa.</li>
                            </ul>
                        </div>
                        <div style={styles.policyNote}>
                            <b>📌 Lưu ý:</b><br />
                            <ul style={{ marginLeft: 18, marginBottom: 0, marginTop: 8 }}>
                                <li>Màu sắc vải/sản phẩm có thể sẽ chênh lệch thực tế một phần nhỏ, do ảnh hưởng về độ lệch màu của ánh sáng nhưng vẫn đảm bảo chất lượng.</li>
                                <li>Quý khách nhận được sản phẩm, nếu hài lòng hãy đánh giá giúp Shop để hưởng thêm nhiều ưu đãi hơn nhé.</li>
                                <li>Khi bạn gặp bất kì vấn đề gì về sản phẩm, đừng vội đánh giá mà hãy liên hệ cho polyshoes để được hỗ trợ một cách tốt nhất.</li>
                            </ul>
                        </div>
                        <div style={styles.policyThanks}>
                            💝 polyshoes xin cảm ơn <span style={{ color: '#ff6b35' }}>QUÝ KHÁCH</span> đã tin tưởng ủng hộ<br />
                            Mong bạn sẽ có trải nghiệm tốt nhất khi sử dụng sản phẩm của chúng tớ ^^
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
// SectionWithTitle component for DRY code
function SectionWithTitle({ title, description, children }) {
    return (
        <div style={styles.section}>
            <Title level={2} style={{ ...styles.sectionTitle, position: 'relative', marginBottom: description ? '24px' : '40px' }}>
                {title}
                <div style={styles.sectionTitleAfter}></div>
            </Title>
            {description && <Paragraph style={styles.description}>{description}</Paragraph>}
            {children}
        </div>
    );
}
};

export default AboutPage;