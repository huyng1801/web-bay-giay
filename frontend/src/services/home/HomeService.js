// src/services/HomeService.js - Updated for new backend structure

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/home'; // Base URL for your API endpoints

export const getAllBanners = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/banners`);
        // Xử lý imageUrl nếu có 2 phần http
        const banners = (response.data || []).map(banner => {
            if (banner.imageUrl) {
                const httpCount = (banner.imageUrl.match(/http/g) || []).length;
                if (httpCount > 1) {
                    const lastHttpIndex = banner.imageUrl.lastIndexOf('http');
                    banner.imageUrl = banner.imageUrl.substring(lastHttpIndex);
                }
            }
            return banner;
        });
        return banners;
    } catch (error) {
        console.error("Error fetching banners:", error);
        throw error;
    }
};

// Fetch all categories
export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Fetch subcategories based on category ID
export const getSubCategories = async (categoryId) => {
    try {
        const response = await axios.get(`${BASE_URL}/subcategories`, {
            params: { categoryId },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching sub categories:", error);
        throw error;
    }
};

// Fetch all products based on various filtering parameters
export const getAllProducts = async (subCategoryId, gender, productName) => {
    try {
        const response = await axios.get(`${BASE_URL}/products`, {
            params: {
                subCategoryId,
                gender,
                productName,
            },
        });
        // Xử lý imageUrl nếu có 2 phần http
        const products = (response.data || []).map(product => {
            if (product.mainImageUrl) {
                const httpCount = (product.mainImageUrl.match(/http/g) || []).length;
                if (httpCount > 1) {
                    const lastHttpIndex = product.mainImageUrl.lastIndexOf('http');
                    product.mainImageUrl = product.mainImageUrl.substring(lastHttpIndex);
                }
            }
            return product;
        });
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

// ====== NEW APIS FOR RESTRUCTURED BACKEND ======

// Fetch all product details (colors + sizes + stock) by product ID
export const getDetailsByProductId = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product-details/available/${productId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching product details for product ID:", error);
        throw error;
    }
};

// Fetch all product details (colors + sizes + stock) by product ID - alternative endpoint
export const getProductDetailsByProductId = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product-details/${productId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching product details for product ID:", error);
        throw error;
    }
};

// Fetch all available colors for a product
export const getAvailableColorsByProductId = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product-details/colors/${productId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching available colors for product ID:", error);
        throw error;
    }
};

// Fetch all available sizes for a product and color
export const getAvailableSizesByProductAndColor = async (productId, colorId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product-details/sizes/${productId}/${colorId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching available sizes for product and color:", error);
        throw error;
    }
};

// Fetch product images (now from Product entity directly)
export const getProductImages = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product-image/${productId}`);
        // Xử lý imageUrl nếu có 2 phần http
        const images = (response.data || []).map(image => {
            if (image.imageUrl) {
                const httpCount = (image.imageUrl.match(/http/g) || []).length;
                if (httpCount > 1) {
                    const lastHttpIndex = image.imageUrl.lastIndexOf('http');
                    image.imageUrl = image.imageUrl.substring(lastHttpIndex);
                }
            }
            return image;
        });
        return images;
    } catch (error) {
        console.error("Error fetching product images:", error);
        throw error;
    }
};

// Get specific product detail by product, color, and size
export const getProductDetailByIds = async (productId, colorId, sizeId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product-details/${productId}/${colorId}/${sizeId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching specific product detail:", error);
        throw error;
    }
};

export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`${BASE_URL}/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
};

// ====== LEGACY FUNCTIONS FOR BACKWARD COMPATIBILITY ======
// These will be removed in future versions

export const getSizesByProductColorId = async (productColorId) => {
    console.warn("getSizesByProductColorId is deprecated. Use getAvailableSizesByProductAndColor instead");
    try {
        const response = await axios.get(`${BASE_URL}/product-size/product-color/${productColorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching sizes for product color ID:", error);
        throw error;
    }
};

export const getImagesByProductColorId = async (productColorId) => {
    console.warn("getImagesByProductColorId is deprecated. Use getProductImages instead");
    try {
        const response = await axios.get(`${BASE_URL}/product-image/product-color/${productColorId}`);
        const images = (response.data || []).map(image => {
            if (image.imageUrl) {
                const httpCount = (image.imageUrl.match(/http/g) || []).length;
                if (httpCount > 1) {
                    const lastHttpIndex = image.imageUrl.lastIndexOf('http');
                    image.imageUrl = image.imageUrl.substring(lastHttpIndex);
                }
            }
            return image;
        });
        return images;
    } catch (error) {
        console.error("Error fetching images for product color ID:", error);
        throw error;
    }
};

export const getProductColorsByProductId = async (productId) => {
    console.warn("getProductColorsByProductId is deprecated. Use getAvailableColorsByProductId instead");
    try {
        const response = await axios.get(`${BASE_URL}/product-color/${productId}`);
        const colors = (response.data || []).map(color => {
            if (color.imageUrl) {
                const httpCount = (color.imageUrl.match(/http/g) || []).length;
                if (httpCount > 1) {
                    const lastHttpIndex = color.imageUrl.lastIndexOf('http');
                    color.imageUrl = color.imageUrl.substring(lastHttpIndex);
                }
            }
            return color;
        });
        return colors;
    } catch (error) {
        console.error("Error fetching product colors for product ID:", error);
        throw error;
    }
};

// ====== CART AND ORDER APIs (NOT IMPLEMENTED IN BACKEND - FRONTEND ONLY) ======

// Add item to cart (Frontend localStorage implementation)
export const addToCart = async (cartData) => {
    console.warn('Cart APIs are not implemented in backend - using localStorage');
    // Implementation would be handled by frontend cart context/localStorage
    return cartData;
};

// Get cart items for customer (Frontend localStorage implementation)
export const getCartItems = async (customerId) => {
    console.warn('Cart APIs are not implemented in backend - using localStorage');
    // Implementation would be handled by frontend cart context/localStorage
    return [];
};

// Update cart item quantity (Frontend localStorage implementation)
export const updateCartItem = async (cartItemId, quantity) => {
    console.warn('Cart APIs are not implemented in backend - using localStorage');
    return { cartItemId, quantity };
};

// Remove item from cart (Frontend localStorage implementation)
export const removeFromCart = async (cartItemId) => {
    console.warn('Cart APIs are not implemented in backend - using localStorage');
    return { cartItemId };
};

// Clear all cart items for customer (Frontend localStorage implementation)
export const clearCart = async (customerId) => {
    console.warn('Cart APIs are not implemented in backend - using localStorage');
    return { customerId };
};

// ====== ORDER APIS ======

// Get customer orders
export const getCustomerOrders = async (customerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/customer/${customerId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        throw error;
    }
};

// Get order details by order ID (NOT IMPLEMENTED IN BACKEND)
export const getOrderDetails = async (orderId) => {
    console.warn('getOrderDetails is not implemented in backend - use getOrdersByCustomerId instead');
    throw new Error('getOrderDetails endpoint not available in backend');
};

// Get order status history
export const getOrderStatusHistory = async (orderId) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/${orderId}/history`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching order status history:", error);
        throw error;
    }
};

// Cancel order (removing duplicate - kept the correct implementation below)

// ====== CHECKOUT APIS (LIMITED BACKEND SUPPORT) ======

// Calculate shipping fee (NOT IMPLEMENTED IN BACKEND - Shipping is now part of Order entity)
export const calculateShippingFee = async (orderData) => {
    console.warn('calculateShippingFee not implemented in backend - shipping calculation handled during order creation');
    // Return mock shipping fee for compatibility
    return {
        shippingFee: 30000, // Default shipping fee
        estimatedDays: '3-5 ngày'
    };
};

// Create order
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${BASE_URL}/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

// Process payment (PARTIAL IMPLEMENTATION - Use createVNPayPayment for VNPay)
export const processPayment = async (paymentData) => {
    console.warn('processPayment not fully implemented - use createVNPayPayment for VNPay payments');
    if (paymentData.paymentMethod === 'VNPay') {
        return await createVNPayPayment(paymentData.orderId, paymentData.amount);
    }
    throw new Error('Only VNPay payment is currently supported');
};

// ====== AUTH APIS ======

// Register new customer
export const register = async (registerData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, registerData);
        return response.data;
    } catch (error) {
        console.error("Error registering customer:", error);
        throw error;
    }
};

// Login customer
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

// Get customer by email
export const getCustomerByEmail = async (email) => {
    try {
        const response = await axios.get(`${BASE_URL}/customer/email/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching customer by email:", error);
        throw error;
    }
};

// Get customer default address
export const getCustomerDefaultAddress = async (customerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/customer/${customerId}/addresses/default`);
        return response.data;
    } catch (error) {
        console.error("Error fetching customer default address:", error);
        throw error;
    }
};

// Get all customer addresses
export const getCustomerAddresses = async (customerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/customer/${customerId}/addresses`);
        return response.data;
    } catch (error) {
        console.error("Error fetching customer addresses:", error);
        throw error;
    }
};

// Get orders by customer ID
export const getOrdersByCustomerId = async (customerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/customer/${customerId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching orders by customer ID:", error);
        throw error;
    }
};

// Cancel order
export const cancelOrder = async (orderId, customerId, cancelReason) => {
    try {
        const response = await axios.post(`${BASE_URL}/order/${orderId}/cancel?customerId=${customerId}`, {
            cancelReason
        });
        return response.data;
    } catch (error) {
        console.error("Error canceling order:", error);
        throw error;
    }
};

// ====== VOUCHER APIS ======

// Get available vouchers for customer
export const getAvailableVouchersForCustomer = async (customerId, orderValue) => {
    try {
        const response = await axios.get(`${BASE_URL}/vouchers/available`, {
            params: { customerId, orderValue }
        });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching available vouchers:", error);
        throw error;
    }
};

// Apply voucher
export const applyVoucher = async (voucherCode, customerId, orderValue) => {
    try {
        const response = await axios.post(`${BASE_URL}/vouchers/apply`, {
            voucherCode,
            customerId, 
            orderValue
        });
        return response.data;
    } catch (error) {
        console.error("Error applying voucher:", error);
        throw error;
    }
};

// Validate voucher
export const validateVoucher = async (voucherCode, customerId, orderValue) => {
    try {
        const response = await axios.post(`${BASE_URL}/vouchers/validate`, {
            voucherCode,
            customerId,
            orderValue
        });
        return response.data;
    } catch (error) {
        console.error("Error validating voucher:", error);
        throw error;
    }
};

// ====== VNPAY PAYMENT APIs ======

// Create VNPay payment URL
export const createVNPayPayment = async (orderId, amount) => {
    try {
        const response = await axios.post(`${BASE_URL}/vnpay-payment`, null, {
            params: { orderId, amount }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating VNPay payment:", error);
        throw error;
    }
};

// Verify VNPay payment
export const verifyVNPayPayment = async (paymentParams) => {
    try {
        const response = await axios.get(`${BASE_URL}/vnpay-return`, {
            params: paymentParams
        });
        return response.data;
    } catch (error) {
        console.error("Error verifying VNPay payment:", error);
        throw error;
    }
};

// ====== SHIPPING APIs (Deprecated - use GHN API instead) ======

// Get all active shippings - DEPRECATED
// This is now replaced by GHN API (getGHNServices and calculateGHNShippingFee)
// Keeping this for backward compatibility as static fallback data only
export const getAllActiveShippings = async () => {
    console.warn('getAllActiveShippings is deprecated. Use GHN API instead: getGHNServices + calculateGHNShippingFee');
    
    // Return static fallback data for backward compatibility
    return [
        {
            shippingId: 1,
            shippingName: 'Giao hàng tiêu chuẩn',
            shippingFee: 30000,
            deliveryTime: '3-5 ngày',
            estimatedDays: '3-5 ngày'
        },
        {
            shippingId: 2, 
            shippingName: 'Giao hàng nhanh', 
            shippingFee: 50000,
            deliveryTime: '1-2 ngày',
            estimatedDays: '1-2 ngày'
        },
        {
            shippingId: 3,
            shippingName: 'Giao hàng siêu tốc',
            shippingFee: 80000,
            deliveryTime: '2-6 giờ',
            estimatedDays: '2-6 giờ'
        }
    ];
};

// Get shippings by type
export const getShippingsByType = async (type) => {
    console.warn('Shipping APIs have been removed from backend - shipping info is now part of Order entity');
    const allShippings = await getAllActiveShippings();
    return allShippings.filter(shipping => 
        shipping.shippingName.toLowerCase().includes(type.toLowerCase())
    );
};

// Calculate shipping fee based on province and order details
export const calculateShippingFeeByProvince = async (province, orderValue, weight = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/shipping/calculate-fee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                province,
                orderValue,
                weight,
                serviceType: 'standard' // standard, express, super_express
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log('Backend shipping calculation API not available, using mock calculation');
    }

    // Mock calculation based on province distance
    const isNearbyProvince = ['Hà Nội', 'Hồ Chí Minh', 'Bình Dương', 'Đồng Nai', 'Long An'].includes(province);
    const baseFee = isNearbyProvince ? 25000 : 35000;
    
    // Apply discount for high order value
    const discountedFee = orderValue >= 500000 ? Math.max(baseFee - 10000, 15000) : baseFee;
    
    return [
        {
            shippingId: 1,
            shippingName: 'Giao hàng tiêu chuẩn',
            shippingFee: discountedFee,
            deliveryTime: isNearbyProvince ? '2-3 ngày' : '4-6 ngày',
            estimatedDays: isNearbyProvince ? '2-3 ngày' : '4-6 ngày'
        },
        {
            shippingId: 2,
            shippingName: 'Giao hàng nhanh',
            shippingFee: discountedFee + 20000,
            deliveryTime: isNearbyProvince ? '1-2 ngày' : '2-3 ngày', 
            estimatedDays: isNearbyProvince ? '1-2 ngày' : '2-3 ngày'
        },
        {
            shippingId: 3,
            shippingName: 'Giao hàng siêu tốc',
            shippingFee: discountedFee + 50000,
            deliveryTime: isNearbyProvince ? '2-6 giờ' : '1 ngày',
            estimatedDays: isNearbyProvince ? '2-6 giờ' : '1 ngày'
        }
    ];
};

// ====== GHN (GIAO HÀNG NHANH) SHIPPING APIs ======

// Get provinces from GHN
export const getGHNProvinces = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/shippings/provinces`);
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching GHN provinces:", error);
        throw error;
    }
};

// Get districts by province ID
export const getGHNDistricts = async (provinceId) => {
    try {
        const response = await axios.get(`${BASE_URL}/shippings/districts`, {
            params: { provinceId }
        });
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching GHN districts:", error);
        throw error;
    }
};

// Get wards by district ID
export const getGHNWards = async (districtId) => {
    try {
        const response = await axios.get(`${BASE_URL}/shippings/wards`, {
            params: { districtId }
        });
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching GHN wards:", error);
        throw error;
    }
};

// Get available shipping services
export const getGHNServices = async (toDistrictId) => {
    try {
        const response = await axios.get(`${BASE_URL}/shippings/services`, {
            params: { toDistrictId }
        });
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching GHN services:", error);
        throw error;
    }
};

// Calculate optimal shipping fee using GHN API (new simplified method)
export const calculateOptimalShippingFee = async (params) => {
    try {
        const {
            toDistrictId,
            toWardCode,
            orderValue,
            weight = 1000, // default 1000g (1kg)
            length = 20,
            width = 15,
            height = 10
        } = params;

        const response = await axios.post(`${BASE_URL}/calculate-fee`, null, {
            params: {
                toDistrictId,
                toWardCode,
                orderValue,
                weight,
                length,
                width,
                height
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error calculating optimal shipping fee:", error);
        // Return fallback if API fails
        return {
            success: false,
            shippingFee: 30000,
            serviceName: "Giao hàng tiêu chuẩn",
            estimatedTime: "3-5 ngày",
            message: "Lỗi khi tính phí vận chuyển, sử dụng phí mặc định"
        };
    }
};

// Calculate shipping fee using GHN API
export const calculateGHNShippingFee = async (params) => {
    try {
        const {
            ghnServiceId,
            toDistrictId,
            toWardCode,
            orderValue,
            weight = 1000, // default 1000g (1kg) - minimum GHN requires
            length = 20,
            width = 15,
            height = 10
        } = params;

        const response = await axios.post(`${BASE_URL}/shippings/calculate-fee`, null, {
            params: {
                ghnServiceId,
                toDistrictId,
                toWardCode,
                orderValue,
                weight,
                length,
                width,
                height
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error calculating GHN shipping fee:", error);
        // Return fallback if GHN API fails
        return {
            success: false,
            shippingFee: 30000,
            message: "Lỗi khi tính phí vận chuyển, sử dụng phí mặc định"
        };
    }
};

// Calculate GHN delivery lead time
export const calculateGHNLeadTime = async (params) => {
    try {
        const {
            serviceId,
            toDistrictId,
            toWardCode
        } = params;

        const response = await axios.post(`${BASE_URL}/shippings/calculate-leadtime`, null, {
            params: {
                serviceId,
                toDistrictId,
                toWardCode
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error calculating GHN lead time:", error);
        // Return fallback if GHN API fails
        return {
            success: false,
            leadtime: 0,
            estimatedDelivery: "Liên hệ để biết thời gian giao hàng",
            message: "Lỗi khi tính thời gian giao hàng"
        };
    }
};