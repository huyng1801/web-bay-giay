import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Tag, Image, Select } from "antd";
import { EditOutlined, PoweroffOutlined } from "@ant-design/icons";
import BrandService from "../../services/admin/BrandService";

const BrandList = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { Option } = Select;
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await BrandService.getAllBrands();
      setBrands(response);
    } catch (error) {
      console.log("Fetch brands error:", error);
      
      const errorMessage = error?.errorFields?.[0]?.errors?.[0] ||
                          error?.response?.data?.message || 
                          error?.response?.data || 
                          error?.message || 
                          "Lỗi khi tải danh sách thương hiệu";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await BrandService.toggleBrandStatus(id);
      message.success("Cập nhật trạng thái thương hiệu thành công");
      fetchBrands();
    } catch (error) {
      console.log("Toggle status error:", error);
      

      message.error(error);
    }
  };

  const showModal = (brand) => {
    setCurrentBrand(brand);
    form.setFieldsValue(brand);
    setIsModalVisible(true);
    setImageFile(null);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Validate ảnh khi tạo mới
      if (!currentBrand && !imageFile) {
        message.error('Vui lòng chọn hình ảnh cho thương hiệu!');
        return;
      }
      const data = { ...values };
      setLoadingButton(true);
      if (imageFile) data.imageFile = imageFile;
      if (currentBrand) {
        await BrandService.updateBrand(currentBrand.brandId, data);
        message.success("Cập nhật thương hiệu thành công");
      } else {
        await BrandService.createBrand(data);
        message.success("Tạo thương hiệu thành công");
      }
      setIsModalVisible(false);
      fetchBrands();
    } catch (error) {
      console.log("Error:", error);
      

      
const errorMessage =
  error?.errorFields?.[0]?.errors?.[0] ||
  (currentBrand ? "Lỗi khi cập nhật thương hiệu" : "Lỗi khi tạo thương hiệu");


      message.error(errorMessage);
    } finally {
      setLoadingButton(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentBrand(null);
    form.resetFields();
    setImageFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const columns = [
    {
      title: "Mã thương hiệu",
      dataIndex: "brandId",
      key: "brandId",
    },
    {
      title: "Tên Thương Hiệu",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <Image
          width={150}
          src={imageUrl}
          alt="Hình ảnh thương hiệu"
          style={{ objectFit: "cover" }}
          placeholder={<Image preview={false} src="loading.gif" />}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
      width: 130,
    },
    {
      title: "Hành động",
      key: "actions",
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
            onClick={() => handleToggleStatus(record.brandId)}
            title={record.isActive ? "Ngừng hoạt động" : "Kích hoạt"}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
          />
        </span>
      ),
    },
  ];

  // Lọc dữ liệu
  const filteredBrands = brands.filter(brand => {
    const matchName = brand.brandName.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" && brand.isActive) || (statusFilter === "inactive" && !brand.isActive);
    return matchName && matchStatus;
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Button type="primary" onClick={() => showModal(null)}>
          Thêm Thương Hiệu
        </Button>
        <div style={{ display: 'flex', gap: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm tên thương hiệu..."
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
        dataSource={filteredBrands}
        columns={columns}
        rowKey="brandId"
        loading={loading}
        pagination={{ pageSize: 8 }} 
      />
      <Modal
  okText="Lưu"
  cancelText="Hủy"
        title={currentBrand ? "Chỉnh sửa Thương Hiệu" : "Thêm Thương Hiệu"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loadingButton} // Show loading state on OK button
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="brandName"
            label="Tên Thương Hiệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu!" },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  // Kiểm tra trùng tên (không phân biệt hoa thường)
                  const existingBrand = brands.find(brand => {
                    const isSameName = brand.brandName.toLowerCase().trim() === value.toLowerCase().trim();
                    const isDifferentBrand = !currentBrand || brand.brandId !== currentBrand.brandId;
                    return isSameName && isDifferentBrand;
                  });
                  
                  if (existingBrand) {
                    return Promise.reject(new Error('Tên thương hiệu đã tồn tại!'));
                  }
                  
                  // Kiểm tra độ dài
                  if (value.trim().length < 2) {
                    return Promise.reject(new Error('Tên thương hiệu phải có ít nhất 2 ký tự!'));
                  }
                  
                  if (value.trim().length > 50) {
                    return Promise.reject(new Error('Tên thương hiệu không được vượt quá 50 ký tự!'));
                  }
                  
                  return Promise.resolve();
                },
              }
            ]}
            validateStatus={form.getFieldError('brandName').length > 0 ? 'error' : ''}
            help={form.getFieldError('brandName').length > 0 && (
              <span style={{ color: '#ff4d4f' }}>
                {form.getFieldError('brandName')[0]}
              </span>
            )}
          >
            <Input 
              placeholder="Nhập tên thương hiệu"
              style={{ 
                borderColor: form.getFieldError('brandName').length > 0 ? '#ff4d4f' : undefined 
              }}
              onChange={() => {
                // Trigger validation khi thay đổi
                setTimeout(() => form.validateFields(['brandName']), 100);
              }}
              onBlur={() => {
                // Trigger validation khi blur
                form.validateFields(['brandName']);
              }}
            />
          </Form.Item>
          <Form.Item 
            label="Hình Ảnh"
            required={!currentBrand}
            help={!currentBrand ? "Vui lòng chọn hình ảnh cho thương hiệu" : "Chọn ảnh mới nếu muốn thay đổi"}
          >
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {imageFile && <p style={{ marginTop: 10, color: '#52c41a' }}>Tệp đã chọn: {imageFile.name}</p>}
            {currentBrand && !imageFile && (
              <p style={{ marginTop: 10, color: '#1890ff' }}>Đang sử dụng ảnh hiện tại</p>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BrandList;
