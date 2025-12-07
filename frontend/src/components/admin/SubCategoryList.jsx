import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Form, Input, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, PoweroffOutlined } from '@ant-design/icons';
import SubcategoryService from '../../services/admin/SubcategoryService';
import CategoryService from '../../services/admin/CategoryService';

const { Option } = Select;

const SubCategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null); // New state for gender filter
  const [selectedStatus, setSelectedStatus] = useState(null); // New state for status filter
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCategories(); // Load categories for the filter
    loadSubcategories(); // Load subcategories initially
  }, []);

  useEffect(() => {
    let filtered = subcategories;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(sub => sub.categoryId === selectedCategory);
    }

    // Filter by gender
    if (selectedGender) {
      filtered = filtered.filter(sub => sub.gender === selectedGender);
    }

    // Filter by status
    if (selectedStatus !== null) {
      filtered = filtered.filter(sub => sub.isActive === selectedStatus);
    }

    setFilteredSubcategories(filtered);
  }, [subcategories, selectedCategory, selectedGender, selectedStatus]);

  const loadCategories = () => {
    CategoryService.getAllCategories()
      .then((response) => {
        setCategories(response); // Load categories
      })
      .catch(() => {
        message.error("Lỗi khi tải danh mục");
      });
  };

  const loadSubcategories = (categoryId = null, gender = null) => {
    SubcategoryService.getAllSubcategories(categoryId, gender) // Pass the gender filter
      .then((response) => {
        setSubcategories(response);
      })
      .catch(() => {
        message.error("Lỗi khi tải danh mục phụ");
      });
  };

  const handleToggleStatus = (id) => {
    SubcategoryService.toggleSubcategoryStatus(id)
      .then(() => {
        message.success("Thay đổi trạng thái danh mục con thành công");
        loadSubcategories(selectedCategory, selectedGender);
      })
      .catch((error) => {
        
        if (error.response?.data) {
          // Nếu server trả về ErrorResponse object có message
          if (error.response.data.message) {
            message.error(error.response.data.message);
          }
          // Nếu server trả về string trực tiếp
          else if (typeof error.response.data === 'string') {
            message.error(error.response.data);
          }
          // Fallback
          else {
            message.error("Không thể ngừng hoạt động danh mục con này vì đang có sản phẩm sử dụng!");
          }
        } else {
          message.error("Không thể ngừng hoạt động danh mục con này vì đang có sản phẩm sử dụng!");
        }
      });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleAdd = () => {
    setEditingSubcategory(null);
    setIsModalVisible(true);
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    form.setFieldsValue({
      subCategoryName: subcategory.subCategoryName,
      categoryId: subcategory.categoryId, // Set the categoryId directly from subcategory
      gender: subcategory.gender,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingSubcategory(null);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingSubcategory) {
          // Update subcategory
          SubcategoryService.updateSubcategory(editingSubcategory.subCategoryId, values)
            .then(() => {
              message.success("Cập nhật danh mục phụ thành công");
              loadSubcategories(selectedCategory, selectedGender); // Reload subcategories for the selected category
              setIsModalVisible(false);
              form.resetFields();
            })
            .catch((error) => {
              if (error.response?.data) {
                // Nếu server trả về ErrorResponse object có message
                if (error.response.data.message) {
                  message.error(error.response.data.message);
                }
                // Nếu server trả về string trực tiếp
                else if (typeof error.response.data === 'string') {
                  message.error(error.response.data);
                }
                // Fallback
                else {
                  message.error("Tên danh mục phụ đã tồn tại");
                }
              } else {
                message.error("Tên danh mục phụ đã tồn tại");
              }
            });
        } else {
          // Create new subcategory
          SubcategoryService.createSubcategory(values)
            .then(() => {
              message.success("Tạo danh mục phụ mới thành công");
              loadSubcategories(selectedCategory, selectedGender); // Reload subcategories for the selected category
              setIsModalVisible(false);
              form.resetFields();
            })
            .catch((error) => {
              if (error.response?.data) {
                // Nếu server trả về ErrorResponse object có message
                if (error.response.data.message) {
                  message.error(error.response.data.message);
                }
                // Nếu server trả về string trực tiếp
                else if (typeof error.response.data === 'string') {
                  message.error(error.response.data);
                }
                // Fallback
                else {
                  message.error("Tên danh mục phụ đã tồn tại");
                }
              } else {
                message.error("Tên danh mục phụ đã tồn tại");
              }
            });
        }
      })
      .catch(() => {
       // message.error("Vui lòng điền đầy đủ thông tin");
      });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    loadSubcategories(value, selectedGender); // Load subcategories based on the selected category and gender
  };

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    loadSubcategories(selectedCategory, value); // Load subcategories based on the selected category and gender
  };

  const columns = [
    {
      title: 'Mã danh mục phụ',
      dataIndex: 'subCategoryId',
      key: 'subCategoryId',
    },
    {
      title: 'Tên danh mục phụ',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
    },
    {
      title: 'Danh mục chính',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => <span>{text === 'MALE' ? 'Nam' : 'Nữ'}</span>,
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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}></Button>
          <Button 
            type="link" 
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleStatus(record.subCategoryId)}
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm danh mục phụ
        </Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            <Select
              value={selectedCategory === null ? null : selectedCategory}
              onChange={handleCategoryChange}
              style={{ width: 200 }}
            >
              <Option value={null}>Tất cả danh mục</Option>
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
                {/* Gender Filter Dropdown */}
            <Select
              value={selectedGender === null ? null : selectedGender}
              onChange={handleGenderChange}
              style={{ width: 200 }}
            >
              <Option value={null}>Tất cả giới tính</Option>
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
            </Select>
                {/* Status Filter Dropdown */}
            <Select
              value={selectedStatus === null ? null : selectedStatus}
              onChange={handleStatusChange}
              style={{ width: 200 }}
            >
              <Option value={null}>Tất cả trạng thái</Option>
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Ngừng hoạt động</Option>
            </Select>
        </div>
      </div>

      <Table dataSource={filteredSubcategories} columns={columns} rowKey="subCategoryId" pagination={{ pageSize: 8 }} />

      <Modal
  okText="Lưu"
  cancelText="Hủy"
        title={editingSubcategory ? "Sửa danh mục phụ" : "Thêm danh mục phụ"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên danh mục phụ"
            name="subCategoryName"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục phụ' },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  
                  // Kiểm tra trùng tên (không phân biệt hoa thường)
                  const existingSubcategory = subcategories.find(subcategory => {
                    const isSameName = subcategory.subCategoryName.toLowerCase().trim() === value.toLowerCase().trim();
                    const isDifferentSubcategory = !editingSubcategory || subcategory.subCategoryId !== editingSubcategory.subCategoryId;
                    return isSameName && isDifferentSubcategory;
                  });
                  
                  if (existingSubcategory) {
                    return Promise.reject(new Error('Tên danh mục phụ đã tồn tại!'));
                  }
                  
                  // Kiểm tra độ dài
                  if (value.trim().length < 2) {
                    return Promise.reject(new Error('Tên danh mục phụ phải có ít nhất 2 ký tự!'));
                  }
                  
                  if (value.trim().length > 50) {
                    return Promise.reject(new Error('Tên danh mục phụ không được vượt quá 50 ký tự!'));
                  }
                  
                  return Promise.resolve();
                },
              }
            ]}
          >
            <Input 
              placeholder="Nhập tên danh mục phụ"
              onChange={() => {
                setTimeout(() => form.validateFields(['subCategoryName']), 100);
              }}
              onBlur={() => {
                form.validateFields(['subCategoryName']);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Danh mục chính"
            name="categoryId"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục chính' }]}
          >
            <Select placeholder="Chọn danh mục chính">
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubCategoryList;
