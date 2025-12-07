import { formatPrice } from './formatters';
import dayjs from 'dayjs';

export const getConditionTypeText = (type) => {
    const normalizedType = type?.toLowerCase();
    switch (normalizedType) {
        case 'first_order':
            return 'Khách hàng mới';
        case 'all_customers':
            return 'Tất cả khách hàng';
        default:
            return 'Không xác định';
    }
};

// Tính trạng thái voucher dựa trên thời gian và lượt sử dụng
export const getVoucherStatus = (voucher) => {
    const now = dayjs();
    const startDate = dayjs(voucher.startDate);
    const endDate = dayjs(voucher.endDate);
    
    if (now.isBefore(startDate)) {
        return 'NOT_STARTED'; // Chưa bắt đầu
    } else if (now.isAfter(endDate)) {
        return 'EXPIRED'; // Đã kết thúc
    } else if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
        return 'OUT_OF_USES'; // Hết lượt sử dụng
    } else {
        return 'ACTIVE'; // Đang hoạt động
    }
};

// Text hiển thị cho trạng thái
export const getVoucherStatusText = (status) => {
    switch (status) {
        case 'NOT_STARTED':
            return 'Chưa bắt đầu';
        case 'ACTIVE':
            return 'Đang hoạt động';
        case 'EXPIRED':
            return 'Đã kết thúc';
        case 'OUT_OF_USES':
            return 'Hết lượt sử dụng';
        default:
            return 'Không xác định';
    }
};

// Màu sắc cho từng trạng thái
export const getVoucherStatusColor = (status) => {
    switch (status) {
        case 'NOT_STARTED':
            return '#faad14'; // Vàng
        case 'ACTIVE':
            return '#52c41a'; // Xanh lá
        case 'EXPIRED':
            return '#ff4d4f'; // Đỏ
        case 'OUT_OF_USES':
            return '#ff4d4f'; // Đỏ
        default:
            return '#000'; // Đen
    }
};

export const getDiscountText = (type, value, maxDiscount) => {
    if (type === 'PERCENTAGE' || type === 'percentage') {
        const maxText = maxDiscount ? ` (tối đa ${formatPrice(maxDiscount)})` : '';
        return `Giảm ${value}%${maxText}`;
    } else {
        return `Giảm ${formatPrice(value)}`;
    }
};