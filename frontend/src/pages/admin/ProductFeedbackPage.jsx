import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Rate, 
  Space, 
  Popconfirm, 
  message, 
  Card,
  Row,
  Col
} from 'antd';
import { 
  EyeOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { getAllFeedbacks, deleteProductFeedback } from '../../services/admin/FeedbackService';
import dayjs from 'dayjs';



const ProductFeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const data = await getAllFeedbacks();
            setFeedbacks(data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            message.error('Không thể tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setViewModalVisible(true);
    };

    const handleDeleteFeedback = async (feedbackId) => {
        try {
            await deleteProductFeedback(feedbackId);
            message.success('Xóa đánh giá thành công');
            fetchFeedbacks();
        } catch (error) {
            console.error('Error deleting feedback:', error);
            message.error('Không thể xóa đánh giá');
        }
    };



    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => <Rate disabled defaultValue={rating} />,
        },
        {
            title: 'Bình luận',
            dataIndex: 'comment',
            key: 'comment',
            render: (comment) => (
                <div style={{ maxWidth: '200px' }}>
                    {comment ? comment.substring(0, 50) + (comment.length > 50 ? '...' : '') : 'Không có bình luận'}
                </div>
            ),
        },
        {
            title: 'Ngày đánh giá',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewFeedback(record)}
                    />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa?"
                        onConfirm={() => handleDeleteFeedback(record.feedbackId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AdminLayout>
           

                    <Table
                        columns={columns}
                        dataSource={feedbacks}
                        rowKey="feedbackId"
                        loading={loading}
                        pagination={{
                            total: feedbacks.length,
                            pageSize: 10,

                        }}
                        scroll={{ x: 800 }}
                    />
            

                <Modal
  okText="Lưu"
  cancelText="Hủy"
                    title="Chi tiết đánh giá"
                    open={viewModalVisible}
                    onCancel={() => {
                        setViewModalVisible(false);
                        setSelectedFeedback(null);
                    }}
                    footer={[
                        <Button key="close" onClick={() => setViewModalVisible(false)}>
                            Đóng
                        </Button>,
                    ]}
                    width={600}
                >
                    {selectedFeedback && (
                        <div>
                            <p><strong>Sản phẩm:</strong> {selectedFeedback.productName}</p>
                            <p><strong>Khách hàng:</strong> {selectedFeedback.customerName}</p>
                            <p><strong>Đánh giá:</strong> <Rate disabled defaultValue={selectedFeedback.rating} /></p>
                            <p><strong>Bình luận:</strong></p>
                            <div style={{ 
                                padding: '12px', 
                                backgroundColor: '#f5f5f5', 
                                borderRadius: '6px',
                                minHeight: '60px' 
                            }}>
                                {selectedFeedback.comment || 'Không có bình luận'}
                            </div>
                            <p style={{ marginTop: '16px' }}>
                                <strong>Ngày đánh giá:</strong> {dayjs(selectedFeedback.createdAt).format('DD/MM/YYYY HH:mm')}
                            </p>
                        </div>
                    )}
                </Modal>
       
        </AdminLayout>
    );
};

export default ProductFeedbackPage;
