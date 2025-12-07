import BaseService from './BaseService';

const API_URL = '/shippings';

const ShippingService = {
  async getAllShippings() {
    try {
      const response = await BaseService.get(API_URL);
      return response;
    } catch (error) {
      console.error('Error fetching shippings:', error);
      throw error;
    }
  },

  async getActiveShippings() {
    try {
      const response = await BaseService.get(`${API_URL}/active`);
      return response;
    } catch (error) {
      console.error('Error fetching active shippings:', error);
      throw error;
    }
  },

  async getShippingById(id) {
    try {
      const response = await BaseService.get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching shipping by id:', error);
      throw error;
    }
  },

  async createShipping(shippingData) {
    try {
      const response = await BaseService.post(API_URL, shippingData);
      return response;
    } catch (error) {
      console.error('Error creating shipping:', error);
      throw error;
    }
  },

  async updateShipping(id, shippingData) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}`, shippingData);
      return response;
    } catch (error) {
      console.error('Error updating shipping:', error);
      throw error;
    }
  },

  async deleteShipping(id) {
    try {
      const response = await BaseService.delete(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting shipping:', error);
      throw error;
    }
  },

  async toggleShippingStatus(id) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}/toggle-status`);
      return response;
    } catch (error) {
      console.error('Error toggling shipping status:', error);
      throw error;
    }
  },

  async searchShippingsByName(name) {
    try {
      const response = await BaseService.get(`${API_URL}/search?name=${encodeURIComponent(name)}`);
      return response;
    } catch (error) {
      console.error('Error searching shippings by name:', error);
      throw error;
    }
  }
};

export default ShippingService;
