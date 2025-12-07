import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const PriceDisplay = ({ 
    originalPrice, 
    salePrice, 
    originalStyle = {}, 
    saleStyle = {}, 
    showOriginalPrice = true,
    direction = 'horizontal' // 'horizontal' or 'vertical'
}) => {
    // If no original price, use sale price as the main price
    const displayOriginalPrice = originalPrice || salePrice;
    const displaySalePrice = salePrice;
    
    // Check if there's a discount (original price exists and is different from sale price)
    const hasDiscount = originalPrice && salePrice && originalPrice !== salePrice && originalPrice > salePrice;
    
    const defaultOriginalStyle = {
        textDecoration: hasDiscount ? 'line-through' : 'none',
        color: hasDiscount ? '#999' : '#f50',
        fontSize: hasDiscount ? '14px' : '18px',
        fontWeight: hasDiscount ? 'normal' : 'bold',
        marginRight: hasDiscount && direction === 'horizontal' ? '8px' : '0',
        display: hasDiscount && direction === 'vertical' ? 'block' : 'inline',
        ...originalStyle
    };

    const defaultSaleStyle = {
        color: '#f50',
        fontSize: '18px',
        fontWeight: 'bold',
        display: hasDiscount && direction === 'vertical' ? 'block' : 'inline',
        ...saleStyle
    };

    if (hasDiscount) {
        return (
            <div style={{ display: direction === 'vertical' ? 'block' : 'inline' }}>
                {showOriginalPrice && (
                    <Text style={defaultOriginalStyle}>
                        {displayOriginalPrice.toLocaleString('vi-VN')} VNĐ
                    </Text>
                )}
                <Text style={defaultSaleStyle}>
                    {displaySalePrice.toLocaleString('vi-VN')} VNĐ
                </Text>
            </div>
        );
    }

    // No discount, show the available price
    return (
        <Text style={defaultOriginalStyle}>
            {displaySalePrice.toLocaleString('vi-VN')} VNĐ
        </Text>
    );
};

export default PriceDisplay;
