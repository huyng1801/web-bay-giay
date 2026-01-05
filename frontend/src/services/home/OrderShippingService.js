// src/services/home/OrderShippingService.js - Service for GHN shipping integration

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/home/shippings';

const OrderShippingService = {
  /**
   * Lấy danh sách tỉnh/thành phố từ GHN
   */
  getProvinces: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/provinces`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách quận/huyện theo tỉnh/thành phố
   */
  getDistricts: async (provinceId) => {
    try {
      const response = await axios.get(`${BASE_URL}/districts`, {
        params: { provinceId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách phường/xã theo quận/huyện
   */
  getWards: async (districtId) => {
    try {
      const response = await axios.get(`${BASE_URL}/wards`, {
        params: { districtId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách dịch vụ vận chuyển khả dụng
   */
  getAvailableServices: async (toDistrictId) => {
    try {
      const response = await axios.get(`${BASE_URL}/services`, {
        params: { toDistrictId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  /**
   * Tính cước phí vận chuyển cho đơn hàng
   */
  calculateShippingFee: async (params) => {
    try {
      const response = await axios.post(`${BASE_URL}/calculate-fee`, null, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      throw error;
    }
  },

  /**
   * Lấy thời gian giao hàng dự kiến
   */
  getLeadTime: async (params) => {
    try {
      const response = await axios.get(`${BASE_URL}/lead-time`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lead time:', error);
      throw error;
    }
  }
};

export default OrderShippingService;
