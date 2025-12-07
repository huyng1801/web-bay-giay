import { Link, useLocation } from 'react-router-dom';

const styles = {
    nav: {
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: '105px',
        zIndex: 997,
    },

    navContent: {
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        height: '60px',
    },

    navList: {
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: '5px',
        width: '100%',
    },

    navItem: {
        position: 'relative',
        margin: 0,
    },

    navLink: {
        display: 'block',
        padding: '20px 18px',
        color: '#2c3e50',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        borderBottom: '3px solid transparent',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },

    navLinkActive: {
        color: '#667eea',
        borderBottomColor: '#667eea',
    },

    navLinkHover: {
        color: '#667eea',
        backgroundColor: '#f8f9fa',
    },

    submenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        backgroundColor: 'white',
        boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
        borderRadius: '4px',
        minWidth: '200px',
        zIndex: 1000,
        opacity: 0,
        visibility: 'hidden',
        transform: 'translateY(-10px)',
        transition: 'all 0.3s ease',
        marginTop: '-3px',
        paddingTop: '10px',
    },

    submenuActive: {
        opacity: 1,
        visibility: 'visible',
        transform: 'translateY(0)',
        marginTop: '0',
    },

    submenuItem: {
        display: 'block',
        padding: '12px 20px',
        color: '#2c3e50',
        textDecoration: 'none',
        fontSize: '13px',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap',
    },

    submenuItemHover: {
        backgroundColor: '#f8f9fa',
        paddingLeft: '25px',
        color: '#667eea',
    },

    mobileMenuButton: {
        display: 'none',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#2c3e50',
    },
};

const Navigation = () => {
    const location = useLocation();

    const menuItems = [
        { id: '1', label: 'Trang Chủ', path: '/' },
        { id: '2', label: 'Sản Phẩm', path: '/product' },
        { id: '3', label: 'Giới Thiệu', path: '/about' },
        { id: '4', label: 'Liên Hệ', path: '/contact' },
    ];

    return (
        <nav style={styles.nav}>
            <div style={styles.navContent}>
                <ul style={styles.navList}>
                    {menuItems.map((item) => (
                        <li key={item.id} style={styles.navItem}>
                            <Link
                                to={item.path}
                                style={{
                                    ...styles.navLink,
                                    ...(location.pathname === item.path ? styles.navLinkActive : {})
                                }}
                                onMouseEnter={(e) => {
                                    if (location.pathname !== item.path) {
                                        e.currentTarget.style.color = '#667eea';
                                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (location.pathname !== item.path) {
                                        e.currentTarget.style.color = '#2c3e50';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;
