import React from "react";
import { Layout, Menu, Dropdown, Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  FlagOutlined,
  TagOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  TeamOutlined,
  ControlOutlined,
  GiftOutlined,
  BgColorsOutlined,
  ColumnWidthOutlined,
  StarOutlined,

  TruckOutlined
} from "@ant-design/icons";
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from "../components/admin/ProtectedRoute";

const { Header, Content, Sider } = Layout;

const styles = {
  layout: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    marginLeft: "250px !important", // Account for fixed sidebar width
  },
  sider: {
    background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
    boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    height: "100vh",
    zIndex: 1000,
  },
  logo: {
    height: "64px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  logoIcon: {
    fontSize: 32,
    color: '#fff',
    background: 'linear-gradient(135deg, #3498db 0%, #764ba2 100%)',
    borderRadius: '50%',
    padding: 6,
    boxShadow: '0 2px 8px rgba(52,152,219,0.18)',
    border: '2px solid #fff',
    marginRight: 4,
  },
  logoName: {
    color: "#ecf0f1",
    fontSize: "16px",
    fontWeight: "bold",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
  },
  menu: {
    height: "calc(100vh - 64px)",
    borderRight: 0,
    background: "transparent",
    color: "#ecf0f1",
    overflowY: "auto",
  },
  header: {
    padding: "0 24px",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderBottom: "1px solid #e9ecef",
    marginLeft: '250px'
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    padding: "3px 10px",
    borderRadius: "8px",
    transition: "all 0.2s",
    color: "#764ba2",
    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    border: "1px solid #d1c4e9",
    minHeight: "24px",
    height: "28px",
    boxShadow: "0 2px 8px rgba(118,75,162,0.08)",
    fontWeight: 600,
    fontSize: 13,
  },
  userName: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#2c3e50",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  content: {
    margin: "24px 16px",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    marginLeft: '270px'
  },
};

const AdminLayout = ({ children }) => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();

  // Define page titles for breadcrumb
  const pageMap = {
  '/admin/dashboard': 'Trang chủ',


  '/admin/product': 'Quản lý sản phẩm',
  '/admin/order': 'Quản lý đơn hàng',
  '/admin/sale': 'Bán hàng',
  '/admin/customer': 'Quản lý khách hàng',
  '/admin/users': 'Quản lý nhân viên',
  '/admin/voucher': 'Quản lý voucher',
  '/admin/shipping': 'Quản lý vận chuyển',
  '/admin/invoice': 'Quản lý hóa đơn',

  };

  // Get current page title
  const currentPageTitle = pageMap[location.pathname] || 'Trang admin';

  // Get selected menu key based on path
  const getSelectedKey = () => {
    const pathMap = {
      '/admin/dashboard': '1',
      '/admin/banner': '2',
      '/admin/brand': ['3', 'attributes'],
      '/admin/category': ['4', 'attributes'],
      '/admin/subcategory': ['5', 'attributes'],
      '/admin/colors': ['7', 'attributes'],
      '/admin/sizes': ['8', 'attributes'],
      '/admin/product': '9',
      '/admin/order': '10',
      '/admin/sale': '11',
      '/admin/customer': '12',
      '/admin/users': '13',
      '/admin/voucher': '14',
      '/admin/shipping': '16',
      '/admin/feedback': '15',
      '/admin/invoice': '17'
    };
    const result = pathMap[location.pathname];
    return Array.isArray(result) ? [result[0]] : [result || '1'];
  };

  const getOpenKeys = () => {
    const pathMap = {
      '/admin/brand': ['attributes'],
      '/admin/category': ['attributes'],
      '/admin/subcategory': ['attributes'],
      '/admin/attributes': ['attributes'],
      '/admin/colors': ['attributes'],
      '/admin/sizes': ['attributes']
    };
    return pathMap[location.pathname] || [];
  };

  // Add custom CSS for menu styling
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-admin-menu .ant-menu-item {
        margin: 4px 8px !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
      }
      .custom-admin-menu .ant-menu-item:hover:not(.ant-menu-item-selected) {
        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3) !important;
      }
      .custom-admin-menu .ant-menu-item-selected,
      .custom-admin-menu .ant-menu-item-selected:hover {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%) !important;
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3) !important;
      }
      .custom-admin-menu .ant-menu-item a {
        color: #ecf0f1 !important;
        text-decoration: none !important;
      }
      .custom-admin-menu .ant-menu-item-icon {
        color: #ecf0f1 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const userMenuItems = [
    {
      key: "profile",
      icon: <SettingOutlined />,
      label: (
        <Link to="/admin/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
          Quản lý tài khoản
        </Link>
      ),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <ProtectedRoute>
      <div>
        <Sider width={250} style={styles.sider}>
          <div style={styles.logo}>
            <ShopOutlined style={styles.logoIcon} />
            <span style={styles.logoName}>Poly Shoes</span>
          </div>
<Menu 
    mode="inline" 
    selectedKeys={getSelectedKey()} 
    defaultOpenKeys={getOpenKeys()} 
    style={styles.menu}
    theme="dark"
    className="custom-admin-menu"
    items={[
      {
        key: '1',
        icon: <HomeOutlined />,
        label: <Link to="/admin/dashboard">Trang chủ</Link>
      },

      //--- QUẢN LÝ DANH MỤC SẢN PHẨM ---
      {
        key: 'attributes',
        icon: <FolderOutlined />,
        label: "Danh mục sản phẩm",
        children: [
          {
            key: '2',
            icon: <FlagOutlined />,
            label: <Link to="/admin/banner">Banner</Link>,
          },
          {
            key: '3',
            icon: <TagOutlined />,
            label: <Link to="/admin/brand">Thương hiệu</Link>,
          },
          {
            key: '4',
            icon: <FolderOutlined />,
            label: <Link to="/admin/category">Danh mục</Link>,
          },
          {
            key: '5',
            icon: <FolderOpenOutlined />,
            label: <Link to="/admin/subcategory">Danh mục con</Link>,
          },
          {
            key: '7',
            icon: <BgColorsOutlined />,
            label: <Link to="/admin/colors">Màu sắc</Link>,
          },
          {
            key: '8',
            icon: <ColumnWidthOutlined />,
            label: <Link to="/admin/sizes">Kích cỡ</Link>,
          }
        ]
      },

      //--- QUẢN LÝ SẢN PHẨM ---
      {
        key: '9',
        icon: <AppstoreAddOutlined />,
        label: <Link to="/admin/product">Sản phẩm</Link>
      },

      //--- QUẢN LÝ ĐƠN HÀNG ---
      {
        key: '10',
        icon: <ShoppingCartOutlined />,
        label: <Link to="/admin/order">Đơn hàng</Link>
      },

      //--- BÁN HÀNG ---
      {
        key: '11',
        icon: <DollarCircleOutlined />,
        label: <Link to="/admin/sale">Bán hàng</Link>
      },

      //--- KHÁCH HÀNG ---
      {
        key: '12',
        icon: <TeamOutlined />,
        label: <Link to="/admin/customer">Khách hàng</Link>
      },

      //--- NHÂN VIÊN (CHỈ ADMIN) ---
      ...(user?.role === 'ADMIN'
        ? [{
            key: '13',
            icon: <UserOutlined />,
            label: <Link to="/admin/users">Quản lý nhân viên</Link>
          }]
        : []
      ),

      //--- VOUCHER ---
      {
        key: '14',
        icon: <GiftOutlined />,
        label: <Link to="/admin/voucher">Voucher</Link>
      },

      //--- FEEDBACK ---
      {
        key: '15',
        icon: <StarOutlined />,
        label: <Link to="/admin/feedback">Phản hồi / Đánh giá</Link>
      },

      //--- VẬN CHUYỂN ---
      {
        key: '16',
        icon: <TruckOutlined />,
        label: <Link to="/admin/shipping">Vận chuyển</Link>
      },

     

    ]}
/>

        </Sider>
        <Layout>
          <Header style={styles.header}>
            <div style={{ flex: 1 }}>
              <Breadcrumb style={{ fontSize: 14, fontWeight: 500, color: '#6c757d' }}>
                <Breadcrumb.Item>
                  <Link to="/admin/dashboard" style={{ color: '#764ba2', textDecoration: 'none' }}>
                    Admin
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: '#495057', fontWeight: 600 }}>
                  {currentPageTitle}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
              <div
                style={{
                  ...styles.userMenu,
                  minWidth: 0,
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(118,75,162,0.08)',
                  border: '1px solid #d1c4e9',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  transition: 'box-shadow 0.2s, border 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(118,75,162,0.16)';
                  e.currentTarget.style.border = '1.5px solid #b39ddb';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(118,75,162,0.08)';
                  e.currentTarget.style.border = '1px solid #d1c4e9';
                }}
              >
                <UserOutlined style={{ fontSize: 13, color: '#764ba2', marginRight: 2, verticalAlign: 'middle' }} />
                <span style={{ color: '#764ba2', fontWeight: 600, fontSize: 13, verticalAlign: 'middle', letterSpacing: 0.2 }}>{user?.fullName || "Admin"}</span>
                <DownOutlined style={{ fontSize: 10, color: '#764ba2', marginLeft: 2, verticalAlign: 'middle' }} />
              </div>
            </Dropdown>
          </Header>
          <Content style={styles.content}>{children}</Content>
        </Layout>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;