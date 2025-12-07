import React from 'react';
import { Modal, Form, Rate, Input } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const FeedbackModal = ({ 
    open, 
    onCancel, 
    onSubmit, 
    selectedProduct, 
    form 
}) => {
    const styles = {
        productInfo: {
            marginBottom: '16px', 
            padding: '12px', 
            background: '#f5f5f5', 
            borderRadius: '8px'
        },
        productName: {
            fontWeight: 'bold',
            color: '#001529',
            marginBottom: '4px'
        },
        productDetails: {
            fontSize: '12px', 
            color: '#666'
        },
        rateContainer: {
            marginBottom: '16px'
        },
        rate: {
            fontSize: '24px', 
            color: '#fadb14'
        },
        textArea: {
            borderRadius: '6px'
        },
        modalHeader: {
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
        },
        starIcon: {
            color: '#faad14'
        }
    };

    return (
        <Modal
  okText="Lưu"
  cancelText="Hủy"
            title={
                <div style={styles.modalHeader}>
                    <StarOutlined style={styles.starIcon} />
                    Đánh giá sản phẩm
                </div>
            }
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            okText="Gửi đánh giá"
            cancelText="Hủy"
            width={600}
            centered
            maskClosable={false}
            destroyOnClose
        >
            {selectedProduct && (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                >
                    <div style={styles.productInfo}>
                        <div style={styles.productName}>
                            {selectedProduct.productName}
                        </div>
                        <div style={styles.productDetails}>
                            Màu sắc: {selectedProduct.colorName} | Kích cỡ: {selectedProduct.sizeValue}
                        </div>
                    </div>

                    <Form.Item
                        label={
                            <span style={{ fontWeight: '600', color: '#001529' }}>
                                Đánh giá sao
                            </span>
                        }
                        name="rating"
                        rules={[
                            { required: true, message: 'Vui lòng chọn số sao đánh giá!' },
                            { type: 'number', min: 1, max: 5, message: 'Đánh giá phải từ 1 đến 5 sao!' }
                        ]}
                        style={styles.rateContainer}
                    >
                        <Rate 
                            allowHalf 
                            style={styles.rate}
                            character={<StarOutlined />}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <span style={{ fontWeight: '600', color: '#001529' }}>
                                Nhận xét (không bắt buộc)
                            </span>
                        }
                        name="comment"
                        rules={[
                            { max: 1000, message: 'Nhận xét không được vượt quá 1000 ký tự!' }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            showCount
                            maxLength={1000}
                            style={styles.textArea}
                        />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default FeedbackModal;