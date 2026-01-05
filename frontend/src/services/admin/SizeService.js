import BaseService from './BaseService';

const API_PREFIX = '/sizes';

const SizeService = {
    // Lấy tất cả size
    getAllSizes() {
        return BaseService.get(API_PREFIX);
    },

    // Lấy size đang hoạt động (cho dropdown)
    getActiveSizes() {
        return BaseService.get(`${API_PREFIX}/active`);
    },

    // Phân trang với tìm kiếm - sử dụng method tương tự như các service khác
    getSizes(page = 0, size = 10, search = '') {
        const params = { page, size };
        if (search) {
            params.sizeValue = search;  // Backend expects 'sizeValue' parameter
        }
        return BaseService.get(`${API_PREFIX}/page`, { params });
    },

    // Phân trang với tìm kiếm (method cũ để backward compatibility)
    getSizesWithPagination(params) {
        return BaseService.get(`${API_PREFIX}/page`, { params });
    },

    // Lấy size theo ID
    getSizeById(id) {
        return BaseService.get(`${API_PREFIX}/${id}`);
    },

    // Tạo size mới
    createSize(sizeData) {
        return BaseService.post(API_PREFIX, sizeData);
    },

    // Cập nhật size
    updateSize(id, sizeData) {
        return BaseService.put(`${API_PREFIX}/${id}`, sizeData);
    },

    // Xóa size
    deleteSize(id) {
        return BaseService.delete(`${API_PREFIX}/${id}`);
    }
};

export default SizeService;