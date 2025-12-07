import BaseService from './BaseService';

// Product Feedback API
export const createProductFeedback = async (feedbackData) => {
    return await BaseService.post('/feedback', feedbackData);
};

export const getFeedbacksByProduct = async (productId) => {
    return await BaseService.get(`/feedback/product/${productId}`);
};

export const getFeedbacksByCustomer = async (customerId) => {
    return await BaseService.get(`/feedback/customer/${customerId}`);
};

export const getAllFeedbacks = async () => {
    return await BaseService.get('/feedback');
};

export const getAverageRating = async (productId) => {
    return await BaseService.get(`/feedback/product/${productId}/average-rating`);
};

export const getFeedbackCount = async (productId) => {
    return await BaseService.get(`/feedback/product/${productId}/count`);
};

export const updateProductFeedback = async (feedbackId, feedbackData) => {
    return await BaseService.put(`/feedback/${feedbackId}`, feedbackData);
};

export const deleteProductFeedback = async (feedbackId) => {
    return await BaseService.delete(`/feedback/${feedbackId}`);
};

const FeedbackService = {
    createProductFeedback,
    getFeedbacksByProduct,
    getFeedbacksByCustomer,
    getAllFeedbacks,
    getAverageRating,
    getFeedbackCount,
    updateProductFeedback,
    deleteProductFeedback
};

export default FeedbackService;
