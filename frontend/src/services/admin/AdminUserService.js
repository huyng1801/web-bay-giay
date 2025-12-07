
import BaseService from './BaseService';

const API_URL = '/users';

class AdminUserService {
    // --- UserService methods ---
    // Lấy tất cả nhân viên
    async getAllUsers() {
        return await BaseService.get(API_URL);
    }

    // Lấy thông tin nhân viên theo ID
    async getUserById(userId) {
        return await BaseService.get(`${API_URL}/${userId}`);
    }

    // Tạo nhân viên mới
    async createUser(userData) {
        return await BaseService.post(`${API_URL}/create`, userData);
    }

    // Cập nhật thông tin nhân viên
    async updateUser(userId, userData) {
        return await BaseService.put(`${API_URL}/${userId}`, userData);
    }

    // Xóa nhân viên
    async deleteUser(userId) {
        return await BaseService.delete(`${API_URL}/${userId}`);
    }

    // Đổi mật khẩu
    async changePassword(userId, passwordData) {
        return await BaseService.put(`${API_URL}/${userId}/password`, passwordData);
    }

    // Kích hoạt/vô hiệu hóa tài khoản
    async toggleUserStatus(userId) {
        return await BaseService.put(`${API_URL}/${userId}/toggle-status`);
    }

    // Tìm kiếm nhân viên
    async searchUsers(keyword) {
        return await BaseService.get(`${API_URL}/search`, { params: { keyword } });
    }

    // --- AdminUserService methods ---
    // Lấy thông tin admin user theo ID
    getAdminUserById(userId) {
        return BaseService.get(`/users/${userId}`);
    }

    // Cập nhật thông tin admin user
    updateAdminUser(userId, userData) {
        return BaseService.put(`/users/${userId}`, userData);
    }

    // Upload avatar admin
    uploadAvatar(userId, formData) {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        };
        return BaseService.post(`/users/${userId}/avatar`, formData, config);
    }

    // Lấy thông tin admin hiện tại
    getCurrentAdminProfile() {
        return BaseService.get('/users/profile');
    }

    // Cập nhật thông tin admin hiện tại
    updateCurrentAdminProfile(userData) {
        return BaseService.put('/users/profile', userData);
    }

    // Thay đổi mật khẩu admin hiện tại
    changeCurrentPassword(passwordData) {
        return BaseService.put('/users/profile/password', passwordData);
    }
}

const adminUserService = new AdminUserService();
export default adminUserService;
