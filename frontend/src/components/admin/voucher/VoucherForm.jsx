import React from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Switch,
    Space,
    Button,
    Row,
    Col,
    Divider
} from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const VoucherForm = ({ 
    visible, 
    onCancel, 
    onSubmit, 
    editingVoucher, 
    form 
}) => {
    const [discountType, setDiscountType] = React.useState(form.getFieldValue('discountType'));
    const styles = {
        modal: {
            borderRadius: '12px',
        },
        modalHeader: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '16px',
            marginBottom: '24px',
        },
        section: {
            marginBottom: '24px',
        },
        divider: {
            margin: '24px 0 16px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1890ff',
        },
        formItem: {
            marginBottom: '16px',
        },

        submitSection: {
            marginTop: '32px',
            paddingTop: '16px',
            borderTop: '1px solid #f0f0f0',
            textAlign: 'right',
        },
    };

    return (
        <Modal
  okText="Lưu"
  cancelText="Hủy"
            title={editingVoucher ? 'Chỉnh sửa Voucher' : 'Thêm Voucher'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnClose
            style={styles.modal}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                onFinishFailed={(errorInfo) => {
                    console.log('Form validation failed:', errorInfo);
                }}
                validateTrigger={['onChange', 'onBlur']}
            >
                <div style={styles.section}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Mã voucher"
                                name="code"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã voucher!' },
                                    { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ chứa chữ hoa và số!' }
                                ]}
                                style={styles.formItem}
                            >
                                <Input 
                                    placeholder="VD: NEWUSER10" 
                                    disabled={true}
                                    style={{ 
                                        borderRadius: '6px',
                                        backgroundColor: '#f5f5f5',
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Tên voucher"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên voucher!' }]}
                                style={styles.formItem}
                            >
                                <Input 
                                    placeholder="Tên hiển thị của voucher" 
                                    style={{ 
                                        borderRadius: '6px'
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        style={styles.formItem}
                    >
                        <TextArea 
                            rows={2} 
                            placeholder="Mô tả chi tiết về voucher (không bắt buộc)" 
                            style={{ borderRadius: '6px' }}
                        />
                    </Form.Item>
                </div>

                <Divider style={styles.divider}>Cài đặt giảm giá</Divider>

                <div style={styles.section}>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Loại giảm giá"
                                name="discountType"
                                rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                                style={styles.formItem}
                            >
                                <Select 
                                    placeholder="Chọn loại giảm giá"
                                    onChange={(value) => {
                                        // Update state to trigger re-render
                                        setDiscountType(value);
                                        
                                        // Clear discount value and max discount when changing type
                                        form.setFieldsValue({ discountValue: undefined, maxDiscount: undefined });
                                        
                                        // If switching to fixed type, we'll set maxDiscount equal to discountValue after user inputs
                                        if (value === 'fixed') {
                                            // Clear max discount for fixed type since it will be auto-set
                                            form.setFieldsValue({ maxDiscount: undefined });
                                        }
                                    }}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <Option value="percentage">Phần trăm (%)</Option>
                                    <Option value="fixed">Số tiền cố định (VNĐ)</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Giá trị giảm"
                                name="discountValue"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giá trị giảm!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const discountType = getFieldValue('discountType');
                                            
                                            if (!value && value !== 0) return Promise.resolve();
                                            
                                            if (value < 0) {
                                                return Promise.reject(new Error('Giá trị giảm không được âm!'));
                                            }
                                            
                                            if (value === 0) {
                                                return Promise.reject(new Error('Giá trị giảm phải lớn hơn 0!'));
                                            }
                                            
                                            if (discountType === 'percentage') {
                                                if (value > 100) {
                                                    return Promise.reject(new Error('Phần trăm giảm không được vượt quá 100%!'));
                                                }
                                                if (value < 1) {
                                                    return Promise.reject(new Error('Phần trăm giảm phải ít nhất 1%!'));
                                                }
                                            }
                                            
                                            if (discountType === 'fixed') {
                                                if (value < 1000) {
                                                    return Promise.reject(new Error('Giá trị giảm phải ít nhất 1.000 VNĐ!'));
                                                }
                                                if (value > 50000000) {
                                                    return Promise.reject(new Error('Giá trị giảm không được vượt quá 50.000.000 VNĐ!'));
                                                }
                                            }
                                            
                                            return Promise.resolve();
                                        },
                                    })
                                ]}
                                style={styles.formItem}
                            >
                                <InputNumber
                                    style={{ 
                                        width: '100%',
                                        borderRadius: '6px'
                                    }}
                                    min={0}
                                    max={discountType === 'percentage' ? 100 : 50000000}
                                    placeholder={discountType === 'percentage' ? 'VD: 10' : 'VD: 100000'}
                                    addonAfter={discountType === 'percentage' ? '%' : 'VND'}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(value) => {
                                        // Auto-set maxDiscount for fixed type
                                        if (discountType === 'fixed' && value) {
                                            form.setFieldsValue({ maxDiscount: value });
                                        }
                                        form.validateFields(['discountValue']);
                                    }}
                                    onBlur={() => {
                                        form.validateFields(['discountValue']);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Giảm tối đa (VNĐ)"
                                name="maxDiscount"
                                tooltip={
                                    discountType === 'percentage' 
                                        ? "Giá trị tối đa có thể giảm khi áp dụng phần trăm" 
                                        : "Tự động bằng giá trị giảm với loại cố định"
                                }
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const discountType = getFieldValue('discountType');
                                            const minOrderValue = getFieldValue('minOrderValue');
                                            
                                            if (discountType === 'fixed') {
                                                // For fixed discount, no additional validation needed as it's auto-set
                                                return Promise.resolve();
                                            }
                                            
                                            if (value && value < 0) {
                                                return Promise.reject(new Error('Giá trị giảm tối đa không được âm!'));
                                            }
                                            
                                            if (discountType === 'percentage' && !value) {
                                                return Promise.reject(new Error('Giá trị giảm tối đa là bắt buộc khi chọn phần trăm!'));
                                            }
                                            
                                            if (value && value > 0 && value < 1000) {
                                                return Promise.reject(new Error('Giá trị giảm tối đa phải ít nhất 1.000 VNĐ!'));
                                            }
                                            
                                            if (value && value > 100000000) {
                                                return Promise.reject(new Error('Giá trị giảm tối đa không được vượt quá 100.000.000 VNĐ!'));
                                            }

                                            // Validate that maxDiscount does not exceed minOrderValue
                                            if (value && minOrderValue && value >= minOrderValue) {
                                                return Promise.reject(new Error('Giá trị giảm tối đa phải nhỏ hơn giá trị đơn hàng tối thiểu!'));
                                            }
                                            
                                            return Promise.resolve();
                                        },
                                    })
                                ]}
                                style={styles.formItem}
                            >
                                <InputNumber
                                    style={{ 
                                        width: '100%',
                                        borderRadius: '6px',
                                        backgroundColor: discountType === 'fixed' ? '#f5f5f5' : undefined
                                    }}
                                    min={0}
                                    max={100000000}
                                    placeholder={
                                        discountType === 'fixed' 
                                            ? 'Tự động bằng giá trị giảm' 
                                            : 'Nhập giá trị tối đa'
                                    }
                                    disabled={discountType === 'fixed'}
                                    addonAfter="VND"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    onChange={(value) => {
                                        form.validateFields(['maxDiscount']);
                                        form.validateFields(['minOrderValue']); // Re-validate minOrderValue when maxDiscount changes
                                    }}
                                    onBlur={() => {
                                        form.validateFields(['maxDiscount']);
                                        form.validateFields(['minOrderValue']); // Re-validate minOrderValue when maxDiscount changes
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Giá trị đơn hàng tối thiểu (VNĐ)"
                        name="minOrderValue"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value && value !== 0) return Promise.resolve();
                                    
                                    if (value < 0) {
                                        return Promise.reject(new Error('Giá trị đơn hàng tối thiểu không được âm!'));
                                    }
                                    
                                    if (value > 50000000) {
                                        return Promise.reject(new Error('Giá trị đơn hàng tối thiểu không được vượt quá 50.000.000 VNĐ!'));
                                    }
                                    
                                    const discountValue = getFieldValue('discountValue');
                                    const discountType = getFieldValue('discountType');
                                    const maxDiscount = getFieldValue('maxDiscount');
                                    
                                    if (discountType === 'fixed' && discountValue && value && value <= discountValue) {
                                        return Promise.reject(new Error('Giá trị đơn hàng tối thiểu phải lớn hơn giá trị giảm!'));
                                    }

                                    // Validate that minOrderValue is greater than maxDiscount
                                    if (maxDiscount && value && value <= maxDiscount) {
                                        return Promise.reject(new Error('Giá trị đơn hàng tối thiểu phải lớn hơn giá trị giảm tối đa!'));
                                    }
                                    
                                    return Promise.resolve();
                                },
                            })
                        ]}

                        style={styles.formItem}
                    >
                        <InputNumber
                            style={{ 
                                width: '100%',
                                borderRadius: '6px'
                            }}
                            min={0}
                            max={50000000}
                            placeholder="Không yêu cầu tối thiểu"
                            addonAfter="VNĐ"
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(value) => {
                                form.validateFields(['minOrderValue']);
                                form.validateFields(['maxDiscount']); // Re-validate maxDiscount when minOrderValue changes
                            }}
                            onBlur={() => {
                                form.validateFields(['minOrderValue']);
                                form.validateFields(['maxDiscount']); // Re-validate maxDiscount when minOrderValue changes
                            }}
                        />
                    </Form.Item>
                </div>

                <Divider style={styles.divider}>Điều kiện áp dụng</Divider>

                <div style={styles.section}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Điều kiện áp dụng"
                                name="conditionType"
                                rules={[{ 
                                    required: true, 
                                    message: 'Vui lòng chọn điều kiện áp dụng voucher!' 
                                }]}
                                style={styles.formItem}
                            >
                                <Select 
                                    placeholder="Chọn điều kiện áp dụng"
                                    style={{ 
                                        borderRadius: '6px',
                                        height: '60px'
                                    }}
                                >
                                    <Option value="all_customers">
                                        <div>
                                            <strong>Tất cả khách hàng</strong>
                                            <br />
                                            <small style={{ color: '#666' }}>Áp dụng cho mọi khách hàng</small>
                                        </div>
                                    </Option>
                                    <Option value="first_order">
                                        <div>
                                            <strong>Khách hàng mua lần đầu</strong>
                                            <br />
                                            <small style={{ color: '#666' }}>Chỉ áp dụng cho khách hàng chưa từng mua hàng</small>
                                        </div>
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label="Ghi chú điều kiện"
                                name="conditionNote"
                                tooltip="Ghi chú thêm về điều kiện áp dụng voucher"
                                style={styles.formItem}
                            >
                                <Input.TextArea
                                    rows={2}
                                    placeholder="VD: Voucher chỉ áp dụng cho khách hàng đăng ký mới..."
                                    maxLength={200}
                                    showCount
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <Divider style={styles.divider}>Thời gian và giới hạn</Divider>

                <div style={styles.section}>
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Thời gian áp dụng"
                                name="dateRange"
                                rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}
                                style={styles.formItem}
                            >
                                <RangePicker 
                                    style={{ 
                                        width: '100%',
                                        borderRadius: '6px'
                                    }} 
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Giới hạn sử dụng"
                                name="usageLimit"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giới hạn sử dụng!' },
                                    {
                                        validator(_, value) {
                                            if (!value && value !== 0) return Promise.resolve();
                                            
                                            // Check if it's a positive integer
                                            if (!Number.isInteger(value) || value <= 0) {
                                                return Promise.reject(new Error('Giới hạn sử dụng phải là số nguyên dương!'));
                                            }
                                            
                                            if (value > 100000) {
                                                return Promise.reject(new Error('Giới hạn sử dụng không được vượt quá 100.000 lần!'));
                                            }
                                            
                                            return Promise.resolve();
                                        },
                                    }
                                ]}
                                style={styles.formItem}
                            >
                                <InputNumber
                                    style={{ 
                                        width: '100%',
                                        borderRadius: '6px'
                                    }}
                                    min={1}
                                    max={100000}
                                    placeholder="Số lần sử dụng tối đa"
                                    addonAfter="lần"
                                    onChange={(value) => {
                                        form.validateFields(['usageLimit']);
                                    }}
                                    onBlur={() => {
                                        form.validateFields(['usageLimit']);
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <div style={styles.submitSection}>
                    <Space size="large">
                        <Button 
                            onClick={onCancel}
                            style={{
                                borderRadius: '6px',
                                padding: '6px 24px',
                                height: 'auto'
                            }}
                        >
                            Hủy
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                            style={{
                                borderRadius: '6px',
                                padding: '6px 24px',
                                height: 'auto',
                                backgroundColor: '#1890ff',
                                borderColor: '#1890ff'
                            }}
                        >
                            {editingVoucher ? 'Cập nhật' : 'Tạo voucher'}
                        </Button>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
};

export default VoucherForm;