import React, { useState, useEffect } from 'react';
import { Rate, Typography, Empty, Spin, Pagination } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getFeedbacksByProduct } from '../../services/home/HomeService';
import dayjs from 'dayjs';

const { Title } = Typography;

const styles = {
  container: {
    marginTop: '48px',
    paddingTop: '24px',
    borderTop: '2px solid #eaeaea',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    padding: '24px 16px',
    marginBottom: '24px',
  },

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '18px',
    color: '#222',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #ff4d4f',
    paddingBottom: '6px',
    display: 'inline-block',
  },

  ratingSummaryCard: {
    background: '#f8fafc',
    border: '1px solid #eaeaea',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.3s ease',
  },

  ratingContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '40px',
  },

  averageRatingBox: {
    textAlign: 'center',
    minWidth: '140px',
  },

  largeRating: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#faad14',
    lineHeight: '1',
    marginBottom: '8px',
    borderRadius: '50%',
    background: '#fffbe6',
    padding: '10px 0',
    boxShadow: '0 1px 4px rgba(250,173,20,0.06)',
    width: '60px',
    display: 'inline-block',
  },

  ratingStars: {
    fontSize: '16px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'center',
  },

  totalReviews: {
    fontSize: '13px',
    color: '#999',
    fontWeight: '500',
    marginTop: '4px',
  },

  ratingDistributionContainer: {
    flex: 1,
  },

  ratingBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },

  starLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
    minWidth: '20px',
  },

  starIcon: {
    fontSize: '14px',
    color: '#faad14',
  },

  progressBar: {
    flex: 1,
    height: '6px',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#faad14',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },

  countLabel: {
    fontSize: '13px',
    color: '#999',
    minWidth: '35px',
    textAlign: 'right',
  },

  feedbacksCard: {
    background: '#f8fafc',
    border: '1px solid #eaeaea',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    overflow: 'hidden',
    marginTop: '18px',
  },

  feedbacksContent: {
    padding: '18px',
  },

  feedbackItem: {
    paddingBottom: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid #eaeaea',
  },

  feedbackItemLast: {
    paddingBottom: '0',
    marginBottom: '0',
    borderBottom: 'none',
  },

  feedbackHeader: {
    display: 'flex',
    gap: '10px',
    marginBottom: '8px',
  },

  feedbackAvatar: {
    width: '32px',
    height: '32px',
    minWidth: '32px',
    fontSize: '16px',
    background: '#fff',
    border: '1px solid #eaeaea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
  },

  feedbackMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },

  customerName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
  },

  feedbackRating: {
    fontSize: '13px',
    color: '#faad14',
    fontWeight: '600',
  },

  feedbackDate: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '500',
  },

  feedbackComment: {
    fontSize: '13px',
    color: '#555',
    lineHeight: '1.5',
    marginTop: '6px',
    fontWeight: '400',
  },

  emptyState: {
    padding: '60px 40px',
    textAlign: 'center',
  },

  emptyText: {
    fontSize: '16px',
    color: '#999',
    fontWeight: '500',
  },

  spinner: {
    padding: '60px 40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pagination: {
    marginTop: '18px',
    paddingTop: '10px',
    borderTop: '1px solid #eaeaea',
    textAlign: 'center',
    borderRadius: '999px',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
    display: 'inline-block',
    padding: '6px 12px',
  },
};

const ProductFeedback = ({ productId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const fetchData = async () => {
            if (productId) {
                setLoading(true);
                try {
                    const feedbackData = await getFeedbacksByProduct(productId);
                    const feedbacks = feedbackData || [];
                    setFeedbacks(feedbacks);
                    
                    // Calculate average rating and total count from feedbackData
                    const totalCount = feedbacks.length;
                    const avgRating = totalCount > 0 
                        ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalCount 
                        : 0;
                    
                    setAverageRating(avgRating);
                    setTotalFeedbacks(totalCount);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setFeedbacks([]);
                    setAverageRating(0);
                    setTotalFeedbacks(0);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [productId]);

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        feedbacks.forEach(feedback => {
            if (distribution.hasOwnProperty(feedback.rating)) {
                distribution[feedback.rating]++;
            }
        });
        return distribution;
    };

    const paginatedFeedbacks = feedbacks.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const ratingDistribution = getRatingDistribution();

    if (!feedbacks || feedbacks.length === 0) {
        return null;
    }

    return (
        <div style={styles.container}>
            <Title style={styles.sectionTitle}>Đánh giá sản phẩm</Title>
            
            {/* Rating Summary Card */}
            <div style={styles.ratingSummaryCard}>
                <div style={styles.ratingContainer}>
                    {/* Average Rating */}
                    <div style={styles.averageRatingBox}>
                        <div style={styles.largeRating}>
                            {averageRating.toFixed(1)}
                        </div>
                        <div style={styles.ratingStars}>
                            <Rate disabled value={Math.round(averageRating)} />
                        </div>
                        <div style={styles.totalReviews}>
                            {totalFeedbacks} đánh giá
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div style={styles.ratingDistributionContainer}>
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} style={styles.ratingBar}>
                                <span style={styles.starLabel}>{star}</span>
                                <div style={styles.starIcon}>★</div>
                                <div style={styles.progressBar}>
                                    <div 
                                        style={{
                                            ...styles.progressFill,
                                            width: `${totalFeedbacks > 0 ? (ratingDistribution[star] / totalFeedbacks) * 100 : 0}%`
                                        }}
                                    />
                                </div>
                                <span style={styles.countLabel}>
                                    {ratingDistribution[star]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feedback List Card */}
            <div style={styles.feedbacksCard}>
                {loading ? (
                    <div style={styles.spinner}>
                        <Spin size="large" />
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div style={styles.emptyState}>
                        <Empty 
                            description={
                                <div style={styles.emptyText}>
                                    Chưa có đánh giá nào cho sản phẩm này
                                </div>
                            }
                        />
                    </div>
                ) : (
                    <>
                        <div style={styles.feedbacksContent}>
                            {paginatedFeedbacks.map((feedback, index) => (
                                <div 
                                    key={feedback.feedbackId || index} 
                                    style={index === paginatedFeedbacks.length - 1 ? styles.feedbackItemLast : styles.feedbackItem}
                                >
                                    <div style={styles.feedbackHeader}>
                                        <div style={styles.feedbackAvatar}>
                                            <UserOutlined />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={styles.feedbackMeta}>
                                                <span style={styles.customerName}>
                                                    {feedback.customerName || 'Khách hàng'}
                                                </span>
                                                <div style={styles.feedbackRating}>
                                                    <Rate disabled value={feedback.rating} />
                                                </div>
                                                <span style={styles.feedbackDate}>
                                                    {dayjs(feedback.createdAt).format('DD/MM/YYYY')}
                                                </span>
                                            </div>
                                            {feedback.comment && (
                                                <div style={styles.feedbackComment}>
                                                    {feedback.comment}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {feedbacks.length > pageSize && (
                            <div style={styles.pagination}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={feedbacks.length}
                                    onChange={setCurrentPage}
                                    showSizeChanger={false}
                                    showQuickJumper={false}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductFeedback;
