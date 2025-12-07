import React, { useState, useEffect } from 'react';
import { 
    Table, 
    Button, 
    Space, 
    Modal, 
    Form, 
    Switch, 
    message, 
    Tag,
    InputNumber,
    Input,
    Select
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    PoweroffOutlined
} from '@ant-design/icons';
import SizeService from '../../services/admin/SizeService';

const SizeList = () => {
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSize, setEditingSize] = useState(null);
    const [form] = Form.useForm();
    const [filteredSizes, setFilteredSizes] = useState([]);
    const [searchSize, setSearchSize] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);

    const styles = {
        container: {
            backgroundColor: 'transparent',
        },
        header: {
            marginBottom: '24px',
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#001529',
            margin: 0,
        },
        subtitle: {
            color: '#666',
            fontSize: '14px',
            marginTop: '8px',
        },
        card: {
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
        toolbar: {
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        searchInput: {
            width: '300px',
        },
        addButton: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
        },
    };

    useEffect(() => {
        loadSizes();
    }, []);

    useEffect(() => {
        let result = sizes;
        if (searchSize) {
            result = result.filter(s => s.sizeValue.toLowerCase().includes(searchSize.toLowerCase()));
        }
        if (statusFilter !== null) {
            result = result.filter(s => s.isActive === statusFilter);
        }
        setFilteredSizes(result);
    }, [sizes, searchSize, statusFilter]);

    const loadSizes = async () => {
        setLoading(true);
        try {
            const data = await SizeService.getAllSizes();
            // Sort sizes numerically
            const sortedSizes = data.sort((a, b) => {
                const numA = parseFloat(a.sizeValue);
                const numB = parseFloat(b.sizeValue);
                return numA - numB;
            });
            setSizes(sortedSizes);
        } catch (error) {
            console.error('Error loading sizes:', error);
            message.error('Lỗi khi tải danh sách kích thước');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingSize(null);
        form.resetFields();
        form.setFieldsValue({ isActive: true });
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingSize(record);
        form.setFieldsValue({
            sizeValue: record.sizeValue,
            isActive: record.isActive,
        });
        setModalVisible(true);
    };

    const handleToggleStatus = async (sizeId) => {
        try {
            const size = sizes.find(s => s.sizeId === sizeId);
            if (!size) return;

            await SizeService.updateSize(sizeId, {
                sizeValue: size.sizeValue,
                isActive: !size.isActive
            });
            
            message.success(`${size.isActive ? 'Tắt' : 'Bật'} kích thước thành công`);
            loadSizes();
        } catch (error) {
            console.error('Error toggling size status:', error);
            if (error.response?.data) {
                if (error.response.data.message) {
                    message.error(error.response.data.message);
                } else if (typeof error.response.data === 'string') {
                    message.error(error.response.data);
                } else {
                    message.error('Không thể thay đổi trạng thái kích thước này!');
                }
            } else {
                message.error('Không thể thay đổi trạng thái kích thước này!');
            }
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            // Convert sizeValue to string
            values.sizeValue = values.sizeValue.toString();
            
            if (editingSize) {
                await SizeService.updateSize(editingSize.sizeId, values);
                message.success('Cập nhật kích thước thành công');
            } else {
                await SizeService.createSize(values);
                message.success('Thêm kích thước thành công');
            }
            
            setModalVisible(false);
            form.resetFields();
            loadSizes();
        } catch (error) {
            // Kiểm tra nếu là lỗi từ form validation
            if (error.errorFields) {
                //message.error('Vui lòng kiểm tra lại thông tin nhập vào!');
                return;
            }
            
            // Xử lý lỗi từ API
            if (error.response?.data) {
                if (error.response.data.message) {
                    message.error(error.response.data.message);
                } else if (typeof error.response.data === 'string') {
                    message.error(error.response.data);
                } else {
                    //message.error('Kích thước này đã tồn tại!');
                }
            } else {
                //message.error('Kích thước này đã tồn tại!');
            }
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
        setEditingSize(null);
    };

    const columns = [
        {
            title: "Mã kích thước",
            dataIndex: "sizeId",
            key: "sizeId",
            width: 150,
        },
        {
            title: 'Size',
            dataIndex: 'sizeValue',
            key: 'sizeValue',
            render: (text) => (
                <span style={{ 
                    fontWeight: '600', 
                    color: '#001529',
                    fontSize: '16px',
                    padding: '4px 8px',
                    backgroundColor: '#f0f2f5',
                    borderRadius: '4px'
                }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 120,
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
            ),
        },
        
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={styles.actionButton}
                    >
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<PoweroffOutlined />}
                        onClick={() => handleToggleStatus(record.sizeId)}
                        style={{
                            ...styles.actionButton,
                            color: record.isActive ? '#ff4d4f' : '#52c41a'
                        }}
                        title={record.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
                    >
                    </Button>
                </Space>
            ),
        },
    ];

        return (
            <div style={{
               
            }}>
      
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Button
                        type="primary"
                        onClick={handleAdd}
                        style={{ marginBottom: 0 }}
                    >
                        Thêm kích thước
                    </Button>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Input.Search
                            placeholder="Tìm kiếm kích thước..."
                            value={searchSize}
                            onChange={e => setSearchSize(e.target.value)}
                            onSearch={value => setSearchSize(value)}
                            style={{ width: 220 }}
                            allowClear
                        />
                        <Select
                            value={statusFilter === null ? null : statusFilter}
                            onChange={value => setStatusFilter(value === null ? null : value)}
                            style={{ width: 160 }}
                            allowClear={false}
                        >
                            <Select.Option value={null}>Tất cả trạng thái</Select.Option>
                            <Select.Option value={true}>Hoạt động</Select.Option>
                            <Select.Option value={false}>Không hoạt động</Select.Option>
                        </Select>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredSizes}
                    loading={loading}
                    rowKey="sizeId"
                    pagination={{ pageSize: 8 }}
                    title={null}
                />
                <Modal

                    title={editingSize ? 'Chỉnh sửa kích thước' : 'Thêm kích thước mới'}
                    open={modalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    okText={editingSize ? 'Cập nhật' : 'Thêm'}
                    cancelText="Hủy"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        style={{ marginTop: '20px' }}
                    >
                        <Form.Item
                            label="Kích thước (số)"
                            name="sizeValue"
                            rules={[
                                { required: true, message: 'Vui lòng nhập kích thước!' },
                                {
                                    validator: async (_, value) => {
                                        if (!value) return Promise.resolve();
                                        
                                        const valueStr = value.toString();
                                        
                                        // Kiểm tra trùng kích thước
                                        const existingSize = sizes.find(size => {
                                            const isSameValue = size.sizeValue === valueStr;
                                            const isDifferentSize = !editingSize || size.sizeId !== editingSize.sizeId;
                                            return isSameValue && isDifferentSize;
                                        });
                                        
                                        if (existingSize) {
                                            return Promise.reject(new Error('Kích thước này đã tồn tại!'));
                                        }
                                        
                                        return Promise.resolve();
                                    },
                                }
                            ]}
                        >
                            <InputNumber
                                placeholder="VD: 39, 40, 41..."
                                min={30}
                                max={50}
                                step={0.5}
                                style={{ width: '100%' }}
                                onChange={() => {
                                    setTimeout(() => form.validateFields(['sizeValue']), 100);
                                }}
                                onBlur={() => {
                                    form.validateFields(['sizeValue']);
                                }}
                            />
                        </Form.Item>

                        {/* Trường trạng thái đã được ẩn hoàn toàn, xử lý logic ở hàm handleAdd và handleEdit */}
                    </Form>
                </Modal>
                
            </div>
        );
};

export default SizeList;