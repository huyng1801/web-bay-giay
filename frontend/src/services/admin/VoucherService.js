// src/services/admin/VoucherService.js

import BaseService from './BaseService';

const API_URL = '/vouchers';

// Get all vouchers
export const getAllVouchers = async () => {
    return await BaseService.get(API_URL);
};

// Get voucher by ID
export const getVoucherById = async (voucherId) => {
    return await BaseService.get(`${API_URL}/${voucherId}`);
};

// Create new voucher
export const createVoucher = async (voucherData) => {
    return await BaseService.post(API_URL, voucherData);
};

// Update voucher
export const updateVoucher = async (voucherId, voucherData) => {
    return await BaseService.put(`${API_URL}/${voucherId}`, voucherData);
};

// Delete voucher
export const deleteVoucher = async (voucherId) => {
    return await BaseService.delete(`${API_URL}/${voucherId}`);
};

// Get voucher dynamic status
export const getVoucherStatus = async (voucherId) => {
    return await BaseService.get(`${API_URL}/${voucherId}/status`);
};

// Check voucher validity for customer
export const checkVoucherValidity = async (voucherCode, customerId, orderValue) => {
    return await BaseService.post(`/home/vouchers/check`, {
        voucherCode,
        customerId,
        orderValue
    });
};

// Apply voucher to order
export const applyVoucher = async (voucherCode, customerId, orderValue) => {
    return await BaseService.post(`/home/vouchers/apply`, {
        voucherCode,
        customerId,
        orderValue
    });
};

// Get available vouchers for customer with usage validation
export const getAvailableVouchersForCustomer = async (customerId, orderValue = 0) => {
    console.log(`Loading vouchers for customerId: ${customerId}, orderValue: ${orderValue}`); // Debug log
    
    // Build query parameters, handle null customerId for guest customers
    const params = new URLSearchParams();
    if (customerId !== null && customerId !== undefined) {
        params.append('customerId', customerId);
    }
    params.append('orderValue', orderValue);
    
    const queryString = params.toString();
    console.log(`API call: /home/vouchers/available?${queryString}`);
    
    return await BaseService.get(`/home/vouchers/available?${queryString}`);
};

// Check if customer has already used a specific voucher
export const checkVoucherUsageHistory = async (voucherCode, customerId, customerEmail, customerPhone) => {
    const params = new URLSearchParams();
    params.append('voucherCode', voucherCode);
    
    if (customerId && customerId > 0) {
        params.append('customerId', customerId);
    } else if (customerEmail) {
        params.append('customerEmail', customerEmail);
    } else if (customerPhone) {
        params.append('customerPhone', customerPhone);
    }
    
    return await BaseService.get(`${API_URL}/usage-history?${params.toString()}`);
};

// Get voucher usage statistics (for admin)
export const getVoucherUsageStats = async (voucherId) => {
    return await BaseService.get(`${API_URL}/${voucherId}/usage-stats`);
};

// Validate voucher
export const validateVoucher = async (code, customerId, orderValue) => {
    return await BaseService.get(`/home/vouchers/validate`, {
        code,
        customerId,
        orderValue
    });
};
