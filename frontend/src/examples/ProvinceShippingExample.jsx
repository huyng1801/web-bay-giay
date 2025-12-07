/**
 * Usage Example: Province Selection with Shipping Type Mapping
 * 
 * This example demonstrates how to use the province utilities and shipping type mapping
 * in your React components.
 */

import React, { useState } from 'react';
import { Select, Card, Typography, Tag } from 'antd';
import { 
    getProvinceOptions, 
    findShippingTypeByProvince, 
    getShippingTypeDisplayName 
} from '../utils/provinceUtils';

const { Title, Text } = Typography;

const ProvinceShippingExample = () => {
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [shippingType, setShippingType] = useState(null);

    const handleProvinceChange = (provinceName) => {
        setSelectedProvince(provinceName);
        const type = findShippingTypeByProvince(provinceName);
        setShippingType(type);
        console.log('Province:', provinceName, 'Shipping Type:', type);
    };

    return (
        <Card style={{ maxWidth: 600, margin: '20px auto' }}>
            <Title level={4}>Province Selection Demo</Title>
            
            <div style={{ marginBottom: 16 }}>
                <Text strong>Chọn tỉnh/thành phố:</Text>
                <Select
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Chọn tỉnh/thành phố"
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={getProvinceOptions()}
                    onChange={handleProvinceChange}
                />
            </div>

            {selectedProvince && (
                <div>
                    <Text strong>Tỉnh/thành phố đã chọn: </Text>
                    <Tag color="blue">{selectedProvince}</Tag>
                    <br />
                    <Text strong>Vùng vận chuyển: </Text>
                    <Tag color="green">{getShippingTypeDisplayName(shippingType)}</Tag>
                    <br />
                    <Text strong>Shipping Type Code: </Text>
                    <Tag color="orange">{shippingType}</Tag>
                </div>
            )}

            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                <Title level={5}>Shipping Type Mapping:</Title>
                <ul>
                    <li><strong>HANOI_INNER:</strong> Nội thành Hà Nội</li>
                    <li><strong>NORTHERN:</strong> Miền Bắc (trừ Hà Nội)</li>
                    <li><strong>CENTRAL:</strong> Miền Trung</li>
                    <li><strong>SOUTHERN:</strong> Miền Nam</li>
                </ul>
            </div>
        </Card>
    );
};

export default ProvinceShippingExample;

/**
 * How to integrate this into your forms:
 * 
 * 1. Registration Form:
 * ```jsx
 * <Form.Item
 *   name="city"
 *   rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
 * >
 *   <Select
 *     placeholder="Chọn tỉnh/thành phố"
 *     showSearch
 *     optionFilterProp="label"
 *     filterOption={(input, option) =>
 *       (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
 *     }
 *     options={getProvinceOptions()}
 *   />
 * </Form.Item>
 * ```
 * 
 * 2. Checkout Form with Shipping Filtering:
 * ```jsx
 * <Select
 *   placeholder="Chọn tỉnh/thành phố"
 *   options={getProvinceOptions()}
 *   onChange={(selectedCity) => {
 *     const shippingType = findShippingTypeByProvince(selectedCity);
 *     // Filter shipping methods based on shippingType
 *     filterShippingMethods(shippingType);
 *   }}
 * />
 * ```
 * 
 * 3. Backend Integration:
 * When sending data to backend, the city name will automatically map to the correct
 * ShippingType enum using the findByProvince() method in the Java enum.
 */