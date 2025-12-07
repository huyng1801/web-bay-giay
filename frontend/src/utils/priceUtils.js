// Price calculation utilities for the new price structure

/**
 * Calculate the final price after discount
 * @param {number} sellingPrice - The base selling price
 * @param {number} discountPercentage - The discount percentage (0-100)
 * @returns {number} The final price after discount
 */
export const calculateDiscountedPrice = (sellingPrice, discountPercentage = 0) => {
    if (!sellingPrice || discountPercentage < 0 || discountPercentage > 100) {
        return sellingPrice || 0;
    }
    return Math.round(sellingPrice * (100 - discountPercentage) / 100);
};

/**
 * Get price display info for a product
 * @param {object} product - Product object with sellingPrice and discountPercentage
 * @returns {object} Object with originalPrice, finalPrice, hasDiscount, discountPercentage
 */
export const getPriceDisplayInfo = (product) => {
    if (!product || !product.sellingPrice) {
        return {
            originalPrice: null,
            finalPrice: 0,
            hasDiscount: false,
            discountPercentage: 0
        };
    }

    const hasDiscount = product.discountPercentage > 0;
    const finalPrice = calculateDiscountedPrice(product.sellingPrice, product.discountPercentage);

    return {
        originalPrice: hasDiscount ? product.sellingPrice : null,
        finalPrice: finalPrice,
        hasDiscount: hasDiscount,
        discountPercentage: product.discountPercentage || 0
    };
};

/**
 * Format price to Vietnamese currency format
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
    if (!price || price === 0) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price).replace('₫', 'VNĐ');
};

/**
 * Handle backward compatibility for cart items that might have old price structure
 * @param {object} cartItem - Cart item that might have old structure
 * @param {object} productDetails - Current product details from API
 * @returns {object} Updated cart item with correct price
 */
export const migrateCartItemPrice = (cartItem, productDetails) => {
    // If cart item already has the correct final price, return as is
    if (cartItem.unitPrice && productDetails) {
        const expectedPrice = calculateDiscountedPrice(
            productDetails.sellingPrice, 
            productDetails.discountPercentage
        );
        
        // If prices match (within 1 VND tolerance for rounding), assume it's already correct
        if (Math.abs(cartItem.unitPrice - expectedPrice) <= 1) {
            return cartItem;
        }
        
        // Otherwise, update with new price
        return {
            ...cartItem,
            unitPrice: expectedPrice
        };
    }
    
    return cartItem;
};
