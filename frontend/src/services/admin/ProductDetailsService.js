// src/services/admin/ProductDetailsService.js - New service for ProductDetails
import BaseService from './BaseService';

const API_URL = '/product-details';

const ProductDetailsService = {
  // Lấy tất cả chi tiết sản phẩm
  async getAllProductDetails() {
    try {
      const response = await BaseService.get(API_URL);
      return response;
    } catch (error) {
      console.error('Error fetching all product details:', error);
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm theo ID
  async getProductDetailsById(id) {
    try {
      const response = await BaseService.get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching product details by ID:', error);
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm theo product ID
  async getDetailsByProductId(productId) {
    try {
      const response = await BaseService.get(`${API_URL}/product/${productId}`);
      return response;
    } catch (error) {
      console.error('Error fetching product details by product ID:', error);
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm có sẵn theo product ID
  async getAvailableProductDetailsByProductId(productId) {
    try {
      const response = await BaseService.get(`${API_URL}/product/${productId}/available`);
      return response;
    } catch (error) {
      console.error('Error fetching available product details:', error);
      throw error;
    }
  },

  // Tạo chi tiết sản phẩm mới
  async createProductDetails(productDetailsData) {
    try {
      const params = new URLSearchParams();
      params.append('productId', productDetailsData.productId);
      params.append('colorId', productDetailsData.colorId);
      params.append('sizeId', productDetailsData.sizeId);
      params.append('stockQuantity', productDetailsData.stockQuantity);
      
      const response = await BaseService.post(`${API_URL}?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error creating product details:', error);
      throw error;
    }
  },

  // Cập nhật chi tiết sản phẩm
  async updateProductDetails(id, productDetails) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}`, productDetails);
      return response;
    } catch (error) {
      console.error('Error updating product details:', error);
      throw error;
    }
  },

  // Cập nhật số lượng tồn kho
  async updateStock(id, stockQuantity) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}/stock`, null, {
        params: { stockQuantity }
      });
      return response;
    } catch (error) {
      console.error('Error updating stock quantity:', error);
      throw error;
    }
  },

  // Cập nhật số lượng tồn kho (alias for updateStock)
  async updateStockQuantity(id, stockQuantity) {
    return this.updateStock(id, stockQuantity);
  },

  // Toggle trạng thái kích hoạt
  async toggleStatus(id) {
    try {
      // Lấy thông tin hiện tại
      const detailsResponse = await this.getProductDetailsById(id);
      const details = detailsResponse.data;
      
      // Đảo ngược trạng thái
      details.isActive = !details.isActive;
      
      // Cập nhật
      const response = await this.updateProductDetails(id, details);
      return response;
    } catch (error) {
      console.error('Error toggling status:', error);
      throw error;
    }
  },

  // Xóa chi tiết sản phẩm (soft delete)
  async deleteProductDetails(id) {
    try {
      const response = await BaseService.delete(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting product details:', error);
      throw error;
    }
  },

  // Kiểm tra tồn kho
  async isInStock(id) {
    try {
      const response = await BaseService.get(`${API_URL}/${id}/in-stock`);
      return response;
    } catch (error) {
      console.error('Error checking stock:', error);
      throw error;
    }
  },

  // Lấy chi tiết sản phẩm có hàng tồn kho
  async getInStockProductDetails() {
    try {
      const response = await BaseService.get(`${API_URL}/in-stock`);
      return response;
    } catch (error) {
      console.error('Error fetching in-stock product details:', error);
      throw error;
    }
  }
};

export default ProductDetailsService;