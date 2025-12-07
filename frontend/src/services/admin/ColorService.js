import BaseService from './BaseService';

const API_PREFIX = '/colors';

class ColorService {
    // Lấy tất cả màu sắc
    getAllColors() {
        return BaseService.get(API_PREFIX);
    }

    // Lấy màu sắc đang hoạt động (cho dropdown)
    getActiveColors() {
        return BaseService.get(`${API_PREFIX}/active`);
    }

    // Phân trang với tìm kiếm - sử dụng method tương tự như các service khác
    getColors(page = 0, size = 10, search = '') {
        const params = { page, size };
        if (search) {
            params.colorName = search;  // Backend expects 'colorName' parameter
        }
        return BaseService.get(`${API_PREFIX}/page`, { params });
    }

    // Phân trang với tìm kiếm (method cũ để backward compatibility)
    getColorsWithPagination(params) {
        return BaseService.get(`${API_PREFIX}/page`, { params });
    }

    // Lấy màu sắc theo ID
    getColorById(id) {
        return BaseService.get(`${API_PREFIX}/${id}`);
    }

    // Tạo màu sắc mới
    createColor(colorData) {
        return BaseService.post(API_PREFIX, colorData);
    }

    // Cập nhật màu sắc
    updateColor(id, colorData) {
        return BaseService.put(`${API_PREFIX}/${id}`, colorData);
    }

    // Xóa màu sắc
    deleteColor(id) {
        return BaseService.delete(`${API_PREFIX}/${id}`);
    }

    // Đổi trạng thái màu sắc (toggle active/inactive)
    toggleColorStatus(id) {
        return BaseService.put(`${API_PREFIX}/${id}/toggle-status`);
    }
}

const colorService = new ColorService();
export default colorService;