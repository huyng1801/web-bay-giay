import BaseService from './BaseService';

const API_URL = '/product-colors';

const ProductColorService = {
  async getColorsByProductId(productId) {
    try {
      const response = await BaseService.get(`${API_URL}/product/${productId}`);
      return response;
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  },

  async addColorToProduct(formData) {
    try {
      const response = await BaseService.post(API_URL, formData);
      return response;
    } catch (error) {
      console.error('Error adding color:', error);
      throw error;
    }
  },

  async deleteColorFromProduct(colorId) {
    try {
      const response = await BaseService.delete(`${API_URL}/${colorId}`);
      return response;
    } catch (error) {
      console.error('Error deleting color:', error);
      throw error;
    }
  },

  async toggleColorStatus(colorId) {
    try {
      const response = await BaseService.put(`${API_URL}/${colorId}/toggle-status`);
      return response;
    } catch (error) {
      console.error('Error toggling color status:', error);
      throw error;
    }
  },

  async updateColor(colorId, formData) {
    try {
      const response = await BaseService.put(`${API_URL}/${colorId}`, formData);
      return response;
    } catch (error) {
      console.error('Error updating color:', error);
      throw error;
    }
  }
};

export default ProductColorService;