
import React, { useState, useEffect } from 'react';
import { Table, Button, message, Image, Modal, Form, Input, Switch, Select, Tag } from 'antd';
import { EditOutlined, PoweroffOutlined } from '@ant-design/icons';
import BannerService from '../../services/admin/BannerService';

const BannerList = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { Option } = Select;
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    setLoading(true);
    BannerService.getAllBanners()
      .then(setBanners)
      .catch(() => message.error('Lỗi khi tải danh sách banner'))
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = (id) => {
    BannerService.toggleBannerStatus(id)
      .then(() => {
        message.success('Thay đổi trạng thái banner thành công');
        loadBanners();
      })
      .catch((error) => {
        message.error(error?.response?.data || 'Lỗi khi thay đổi trạng thái banner');
      });
  };

  const showModal = (banner) => {
    setCurrentBanner(banner);
    if (banner) {
      // Chỉnh sửa banner hiện có
      form.setFieldsValue(banner);
    } else {
      // Tạo banner mới - thiết lập giá trị mặc định
      form.setFieldsValue({ isActive: true });
    }
    setIsModalVisible(true);
    setImageFile(null);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Validate ảnh khi tạo mới
        if (!currentBanner && !imageFile) {
          message.error('Vui lòng chọn hình ảnh cho banner!');
          return;
        }
        const data = { ...values, imageFile };
        setLoadingButton(true);
        const action = currentBanner
          ? BannerService.updateBanner(currentBanner.bannerId, data)
          : BannerService.createBanner(data);
        action
          .then(() => {
            message.success(currentBanner ? 'Cập nhật banner thành công' : 'Tạo banner thành công');
            setIsModalVisible(false);
            loadBanners();
          })
          .catch(() => {
            message.error(currentBanner ? 'Lỗi khi cập nhật banner' : 'Lỗi khi tạo banner');
          })
          .finally(() => setLoadingButton(false));
      })
      .catch((errorInfo) => {
        console.log('Failed:', errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentBanner(null);
    form.resetFields();
    setImageFile(null);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const columns = [
    {
      title: 'Mã banner',
      dataIndex: 'bannerId',
      key: 'bannerId',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Liên kết',
      dataIndex: 'link',
      key: 'link',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <Image
          width={150}
          src={imageUrl}
          alt="Hình ảnh banner"
          placeholder={<Image preview={false} src="loading.gif" />}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} style={{ minWidth: 90, textAlign: 'center' }}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="link"
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleStatus(record.bannerId)}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
          />
        </span>
      ),
    },
  ];
  
  // Lọc dữ liệu
  const filteredBanners = banners.filter(banner => {
    const matchTitle = banner.title.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" && banner.isActive) || (statusFilter === "inactive" && !banner.isActive);
    return matchTitle && matchStatus;
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button type="primary" onClick={() => showModal(null)}>
          Thêm Banner
        </Button>
        <div style={{ display: 'flex', gap: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm tiêu đề banner..."
            allowClear
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 240 }}
          />
          <Select
            value={statusFilter}
            onChange={value => setStatusFilter(value)}
            style={{ width: 160 }}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Ngừng hoạt động</Option>
          </Select>
        </div>
      </div>
      <Table
        dataSource={filteredBanners}
        columns={columns}
        rowKey="bannerId"
        loading={loading}
        pagination={{ pageSize: 8 }} 
      />
      <Modal
  okText="Lưu"
  cancelText="Hủy"
      
        title={currentBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loadingButton} // Show loading state on OK button
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="Liên kết"
            rules={[
              { required: true, message: 'Vui lòng nhập liên kết!' },
              { type: 'url', message: 'Liên kết phải là một URL hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            label={!currentBanner ? (<span>Hình ảnh <span style={{color:'#ff4d4f'}}></span></span>) : "Hình ảnh"}
            required={!currentBanner}
            help={!currentBanner ? "Vui lòng chọn hình ảnh cho banner" : "Chọn ảnh mới nếu muốn thay đổi"}
          >
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {imageFile && <p style={{ marginTop: 10 }}>Selected file: {imageFile.name}</p>}
            {currentBanner && !imageFile && (
              <p style={{ marginTop: 10, color: '#1890ff' }}>Đang sử dụng ảnh hiện tại</p>
            )}
          </Form.Item>
          <Form.Item
            name="isActive"
            hidden
          >
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BannerList;
