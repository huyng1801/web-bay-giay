import BaseService from './BaseService';

const API_URL = '/product-images';

const ProductImageService = {
  // Lấy tất cả hình ảnh sản phẩm
  async getAllProductImages() {
    try {
      const response = await BaseService.get(API_URL);
      return response;
    } catch (error) {
      console.error('Error fetching all product images:', error);
      throw error;
    }
  },

  // Lấy hình ảnh sản phẩm theo ID
  async getProductImageById(id) {
    try {
      const response = await BaseService.get(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching product image by ID:', error);
      throw error;
    }
  },

  // Lấy tất cả hình ảnh theo product ID
  async getProductImagesByProductId(productId) {
    try {
      const response = await BaseService.get(`${API_URL}/product/${productId}`);
      return response;
    } catch (error) {
      console.error('Error fetching product images by product ID:', error);
      throw error;
    }
  },

  // Alias method for compatibility
  async getImagesByProductId(productId) {
    return this.getProductImagesByProductId(productId);
  },

  // Tạo hình ảnh sản phẩm mới
  async createProductImage(productId, imageUrl) {
    try {
      const response = await BaseService.post(API_URL, null, {
        params: { productId, imageUrl }
      });
      return response;
    } catch (error) {
      console.error('Error creating product image:', error);
      throw error;
    }
  },

  // Cập nhật hình ảnh sản phẩm
  async updateProductImage(id, productImage) {
    try {
      const response = await BaseService.put(`${API_URL}/${id}`, productImage);
      return response;
    } catch (error) {
      console.error('Error updating product image:', error);
      throw error;
    }
  },

  // Xóa hình ảnh sản phẩm
  async deleteProductImage(id) {
    try {
      const response = await BaseService.delete(`${API_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  },

  // Alias method for compatibility
  async deleteImage(id) {
    return this.deleteProductImage(id);
  },

  // Upload multiple images
  async uploadImages(formData) {
    try {
      const response = await BaseService.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Đặt hình ảnh chính
  async setMainImage(imageId) {
    try {
      const response = await BaseService.put(`${API_URL}/${imageId}/set-main`);
      return response;
    } catch (error) {
      console.error('Error setting main image:', error);
      throw error;
    }
  },

  // Đếm số lượng hình ảnh của sản phẩm
  async countImagesByProductId(productId) {
    try {
      const response = await BaseService.get(`${API_URL}/product/${productId}/count`);
      return response;
    } catch (error) {
      console.error('Error counting images by product ID:', error);
      throw error;
    }
  },

  // Xóa tất cả hình ảnh của một sản phẩm
  async deleteAllImagesByProductId(productId) {
    try {
      const response = await BaseService.delete(`${API_URL}/product/${productId}`);
      return response;
    } catch (error) {
      console.error('Error deleting all images by product ID:', error);
      throw error;
    }
  }
};

export default ProductImageService;
