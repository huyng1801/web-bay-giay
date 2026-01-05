import React, { useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const CustomerModal = ({
  visible,
  form,
  onCancel,
  onSubmit,
  loading
}) => {
  // Inline styles
  const styles = {
    modal: {
      width: 500
    },
    formItem: {
      marginBottom: '16px'
    }
  };

  const [provinceOptions, setProvinceOptions] = useState([
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
  ]);

  // useEffect no longer needed since we have static options

  return (
    <Modal
      title="Tạo khách hàng mới"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Tạo khách hàng"
      cancelText="Hủy"
      confirmLoading={loading}
      style={styles.modal}
      destroyOnClose
    >
      <Form 
        form={form} 
        onFinish={onSubmit} 
        layout="vertical"
        initialValues={{ hashPassword: '12345678' }}
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ và tên!' },
            { max: 50, message: 'Tối đa 50 ký tự!' }
          ]}
          style={styles.formItem}
        >
          <Input placeholder="Nhập họ và tên khách hàng" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
            { max: 255, message: 'Tối đa 255 ký tự!' }
          ]}
          style={styles.formItem}
        >
          <Input placeholder="Nhập email khách hàng" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]{10,15}$/, message: 'Số điện thoại không hợp lệ!' },
            { max: 15, message: 'Tối đa 15 ký tự!' }
          ]}
          style={styles.formItem}
        >
          <Input placeholder="Nhập số điện thoại (10-15 số)" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            { required: true, message: 'Vui lòng nhập địa chỉ!' },
            { max: 255, message: 'Tối đa 255 ký tự!' }
          ]}
          style={styles.formItem}
        >
          <Input placeholder="Nhập địa chỉ khách hàng" />
        </Form.Item>

        <Form.Item
          name="address2"
          label="Địa chỉ phụ"
          rules={[{ max: 255, message: 'Tối đa 255 ký tự!' }]}
          style={styles.formItem}
        >
          <Input placeholder="Nhập địa chỉ phụ (nếu có)" />
        </Form.Item>

        <Form.Item
          name="city"
          label="Tỉnh/Thành phố"
          rules={[
            { required: true, message: 'Vui lòng chọn tỉnh/thành!' },
            { max: 50, message: 'Tối đa 50 ký tự!' }
          ]}
          style={styles.formItem}
        >
          <Select
            showSearch
            placeholder="Chọn tỉnh/thành phố"
            options={provinceOptions}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          name="hashPassword"
          label="Mật khẩu (mặc định 1-8)"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
            { max: 255, message: 'Tối đa 255 ký tự!' }
          ]}
          style={styles.formItem}
        >
          <Input.Password placeholder="Mật khẩu mặc định: 12345678" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomerModal;