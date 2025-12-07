/**
 * Province/City utilities mapped to backend ShippingType enum
 */

export const SHIPPING_TYPES = {
    HANOI_INNER: 'HANOI_INNER',
    NORTHERN: 'NORTHERN', 
    CENTRAL: 'CENTRAL',
    SOUTHERN: 'SOUTHERN'
};

export const PROVINCES_BY_REGION = {
    [SHIPPING_TYPES.HANOI_INNER]: [
        'Hà Nội'
    ],
    [SHIPPING_TYPES.NORTHERN]: [
        'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Điện Biên',
        'Lai Châu', 'Sơn La', 'Yên Bái', 'Hòa Bình', 'Thái Nguyên', 'Lạng Sơn',
        'Quảng Ninh', 'Bắc Giang', 'Phú Thọ', 'Vĩnh Phúc', 'Bắc Ninh', 'Hải Dương',
        'Hải Phòng', 'Hưng Yên', 'Thái Bình', 'Hà Nam', 'Nam Định', 'Ninh Bình'
    ],
    [SHIPPING_TYPES.CENTRAL]: [
        'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế',
        'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa',
        'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng'
    ],
    [SHIPPING_TYPES.SOUTHERN]: [
        'TP. Hồ Chí Minh', 'Bình Phước', 'Tây Ninh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu',
        'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long', 'Đồng Tháp',
        'An Giang', 'Kiên Giang', 'Cần Thơ', 'Hậu Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau'
    ]
};

// All provinces in a flat array for dropdown options
export const ALL_PROVINCES = [
    ...PROVINCES_BY_REGION[SHIPPING_TYPES.HANOI_INNER],
    ...PROVINCES_BY_REGION[SHIPPING_TYPES.NORTHERN],
    ...PROVINCES_BY_REGION[SHIPPING_TYPES.CENTRAL], 
    ...PROVINCES_BY_REGION[SHIPPING_TYPES.SOUTHERN]
].sort();

// Get province options for Select component
export const getProvinceOptions = () => {
    return ALL_PROVINCES.map(province => ({
        value: province,
        label: province
    }));
};

// Find shipping type by province name
export const findShippingTypeByProvince = (provinceName) => {
    for (const [shippingType, provinces] of Object.entries(PROVINCES_BY_REGION)) {
        for (const province of provinces) {
            if (province.toLowerCase().includes(provinceName.toLowerCase()) ||
                provinceName.toLowerCase().includes(province.toLowerCase())) {
                return shippingType;
            }
        }
    }
    return SHIPPING_TYPES.NORTHERN; // Default
};

// Get shipping type display name
export const getShippingTypeDisplayName = (shippingType) => {
    const displayNames = {
        [SHIPPING_TYPES.HANOI_INNER]: 'Nội thành Hà Nội',
        [SHIPPING_TYPES.NORTHERN]: 'Miền Bắc',
        [SHIPPING_TYPES.CENTRAL]: 'Miền Trung',
        [SHIPPING_TYPES.SOUTHERN]: 'Miền Nam'
    };
    return displayNames[shippingType] || 'Miền Bắc';
};

// Get provinces by shipping type
export const getProvincesByShippingType = (shippingType) => {
    return PROVINCES_BY_REGION[shippingType] || [];
};

// Client-side filtering of shipping methods based on shipping type
export const filterShippingByType = (allShippings, shippingType) => {
    // For now, return all shippings as backend might not have type-based filtering yet
    // This can be enhanced when backend supports shipping type filtering
    return allShippings.filter(shipping => {
        // If shipping has a 'shippingType' or 'applicableRegions' field, filter by it
        // Otherwise, return all shippings for compatibility
        if (shipping.shippingType) {
            return shipping.shippingType === shippingType;
        }
        if (shipping.applicableRegions && Array.isArray(shipping.applicableRegions)) {
            return shipping.applicableRegions.includes(shippingType);
        }
        // Default: return all if no filtering field exists
        return true;
    });
};