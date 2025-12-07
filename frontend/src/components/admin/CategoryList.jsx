import React, { useState, useEffect } from 'react';
import CategoryService from '../../services/admin/CategoryService';
import { Table, Button, message, Modal, Form, Input, Select, Tag } from 'antd';
import { EditOutlined, PoweroffOutlined } from '@ant-design/icons';

const { Option } = Select;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null); // null = tất cả, true = hoạt động, false = ngừng hoạt động
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (statusFilter === null) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => category.isActive === statusFilter);
      setFilteredCategories(filtered);
    }
  }, [categories, statusFilter]);

  const loadCategories = () => {
    CategoryService.getAllCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch(() => message.error("Lỗi khi tải danh mục"));
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleToggleStatus = (id) => {
    CategoryService.toggleCategoryStatus(id)
      .then(() => {
        message.success("Thay đổi trạng thái danh mục thành công");
        loadCategories();
      })
      .catch((error) => {
        const msg = error?.response?.data?.message || error?.response?.data || "Không thể ngừng hoạt động danh mục này vì đang có sản phẩm sử dụng!";
        message.error(msg);
      });
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({ categoryName: category.categoryName });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const action = editingCategory
          ? CategoryService.updateCategory(editingCategory.categoryId, values)
          : CategoryService.createCategory(values);
        action
          .then(() => {
            message.success(editingCategory ? "Cập nhật danh mục thành công" : "Tạo danh mục mới thành công");
            loadCategories();
            setIsModalVisible(false);
            form.resetFields();
          })
          .catch(() => {
            message.error(editingCategory ? "Tên danh mục đã tồn tại ở danh mục khác" : "Tên danh mục đã tồn tại");
          });
      })
      .catch(() => {
        message.error("Vui lòng điền đầy đủ thông tin");
      });
  };

  const columns = [
    {
      title: 'Mã danh mục',
      dataIndex: 'categoryId',
      key: 'categoryId',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
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
      title: 'Thao tác',
      render: (text, record) => (
        <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button 
            type="link" 
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleStatus(record.categoryId)}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
          >
          </Button>
        </span>
      ),
      key: 'actions',
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button type="primary" onClick={handleAdd}>
          Thêm danh mục
        </Button>
        <Select
          value={statusFilter === null ? null : statusFilter}
          onChange={handleStatusFilterChange}
          style={{ width: 200 }}
        >
          <Select.Option value={null}>Tất cả trạng thái</Select.Option>
          <Select.Option value={true}>Hoạt động</Select.Option>
          <Select.Option value={false}>Ngừng hoạt động</Select.Option>
        </Select>
      </div>
      <Table dataSource={filteredCategories} columns={columns} rowKey="categoryId" pagination={{ pageSize: 8 }} />

      <Modal
  okText="Lưu"
  cancelText="Hủy"
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="categoryName"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
