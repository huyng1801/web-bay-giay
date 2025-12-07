import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber,
  Select,
  message, 
  Space, 
  Tag,
  Popconfirm,
  Card,
  Row,
  Col
} from 'antd';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PoweroffOutlined,
  SearchOutlined
} from '@ant-design/icons';
import ShippingService from '../../services/admin/ShippingService';

const ShippingPage = () => {
  const [shippings, setShippings] = useState([]);
  const [allShippings, setAllShippings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingShipping, setEditingShipping] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchShippings();
  }, []);

  const fetchShippings = async () => {
    setLoading(true);
    try {
      const data = await ShippingService.getAllShippings();
      setAllShippings(data);
      setShippings(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách phương thức vận chuyển');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingShipping(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingShipping(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await ShippingService.deleteShipping(id);
      message.success('Xóa phương thức vận chuyển thành công');
      fetchShippings();
    } catch (error) {
      message.error('Lỗi khi xóa phương thức vận chuyển');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await ShippingService.toggleShippingStatus(id);
      message.success('Thay đổi trạng thái thành công');
      fetchShippings();
    } catch (error) {
      message.error('Lỗi khi thay đổi trạng thái');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Check duplicate shippingCode and shippingName
      const codeExists = allShippings.some(s => 
        s.shippingCode === values.shippingCode && 
        (!editingShipping || s.shippingId !== editingShipping.shippingId)
      );
      const nameExists = allShippings.some(s => 
        s.shippingName.trim().toLowerCase() === values.shippingName.trim().toLowerCase() && 
        (!editingShipping || s.shippingId !== editingShipping.shippingId)
      );
      
      if (codeExists) {
        message.error('Mã vận chuyển đã tồn tại!');
        return;
      }
      if (nameExists) {
        message.error('Tên phương thức vận chuyển đã tồn tại!');
        return;
      }
      
      if (editingShipping) {
        await ShippingService.updateShipping(editingShipping.shippingId, values);
        message.success('Cập nhật phương thức vận chuyển thành công');
      } else {
        await ShippingService.createShipping(values);
        message.success('Thêm phương thức vận chuyển thành công');
      }
      
      setModalVisible(false);
      fetchShippings();
    } catch (error) {
      if (error.response?.data) {
        message.error(error.response.data);
      } else {
        message.error('Có lỗi xảy ra');
      }
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setShippings(allShippings);
      return;
    }
    
    setLoading(true);
    try {
      const data = await ShippingService.searchShippingsByName(searchText);
      setShippings(data);
    } catch (error) {
      message.error('Lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã vận chuyển',
      dataIndex: 'shippingCode',
      key: 'shippingCode',
      width: 120,
    },
    {
      title: 'Tên phương thức',
      dataIndex: 'shippingName',
      key: 'shippingName',
      width: 250,
    },
    {
      title: 'Khu vực',
      dataIndex: 'shippingType',
      key: 'shippingType',
      width: 120,
      render: (type) => {
        const typeMap = {
          'HANOI_INNER': 'Nội thành Hà Nội',
          'NORTHERN': 'Miền Bắc',
          'CENTRAL': 'Miền Trung',
          'SOUTHERN': 'Miền Nam'
        };
        return typeMap[type] || type;
      },
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      width: 130,
      render: (fee) => `${fee?.toLocaleString()} đ`,
    },
    {
      title: 'Thời gian giao hàng',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Sửa"
          />
          <Button
            type="link"
            icon={<PoweroffOutlined />}
            onClick={() => handleToggleStatus(record.shippingId)}
            style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            title={record.isActive ? 'Tắt' : 'Bật'}
          />
        
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }} justify="space-between" align="middle">
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm phương thức vận chuyển
          </Button>
        </Col>
        <Col>
          <Space>
            <Input.Search
              placeholder="Tìm kiếm tên vận chuyển..."
              allowClear
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
            <Select
              defaultValue="all"
              style={{ width: 160 }}
              onChange={value => {
                if (value === "all") {
                  setShippings(allShippings);
                } else {
                  setShippings(allShippings.filter(s => value === "active" ? s.isActive : !s.isActive));
                }
              }}
            >
              <Select.Option value="all">Tất cả trạng thái</Select.Option>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
            </Select>
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={shippings}
        rowKey="shippingId"
        loading={loading}
        pagination={{
          total: shippings.length,
          pageSize: 10,

        }}
        scroll={{ x: 1000 }}
      />

      <Modal

        title={editingShipping ? 'Cập nhật phương thức vận chuyển' : 'Thêm phương thức vận chuyển'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditingShipping(null);
          form.resetFields();
        }}
        okText={editingShipping ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          {editingShipping && (
            <Form.Item name="isActive" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item
            name="shippingCode"
            label="Mã vận chuyển"
            rules={[
              { required: true, message: 'Vui lòng nhập mã vận chuyển!' },
              { pattern: /^[A-Z0-9_]+$/, message: 'Mã chỉ được chứa chữ hoa, số và dấu gạch dưới!' }
            ]}
          >
            <Input placeholder="VD: NT_001" />
          </Form.Item>

          <Form.Item
            name="shippingName"
            label="Tên phương thức vận chuyển"
            rules={[{ required: true, message: 'Vui lòng nhập tên phương thức vận chuyển!' }]}
          >
            <Input placeholder="VD: Giao hàng nhanh nội thành" />
          </Form.Item>

          <Form.Item
            name="shippingType"
            label="Khu vực vận chuyển"
            rules={[{ required: true, message: 'Vui lòng chọn khu vực vận chuyển!' }]}
            style={{ minHeight: '80px' }}
          >
            <Select placeholder="Chọn khu vực">
              <Select.Option value="HANOI_INNER">Nội thành Hà Nội</Select.Option>
              <Select.Option value="NORTHERN">Miền Bắc</Select.Option>
              <Select.Option value="CENTRAL">Miền Trung</Select.Option>
              <Select.Option value="SOUTHERN">Miền Nam</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="shippingFee"
            label="Phí vận chuyển (VNĐ)"
            rules={[
              { required: true, message: 'Vui lòng nhập phí vận chuyển!' },
              { type: 'number', min: 0, message: 'Phí vận chuyển phải lớn hơn hoặc bằng 0!' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="VD: 25000"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="deliveryTime"
            label="Thời gian giao hàng"
            rules={[
              { required: true, message: 'Vui lòng nhập thời gian giao hàng!' },
              { pattern: /^[1-9][0-9]*-[1-9][0-9]* ngày$/, message: 'Định dạng phải là "1-3 ngày", "2-5 ngày"...' }
            ]}
          >
            <Input placeholder="VD: 1-3 ngày" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default ShippingPage;
