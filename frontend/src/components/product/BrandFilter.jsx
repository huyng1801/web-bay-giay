import React from 'react';
import { Checkbox } from 'antd';

const BrandFilter = ({ brands = [], selectedBrands = [], onBrandChange }) => {
  const handleBrandChange = (checkedValues) => {
    onBrandChange(checkedValues);
  };

  return (
    <Checkbox.Group
      value={selectedBrands}
      onChange={handleBrandChange}
      style={{ width: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {brands.map(brand => (
          <Checkbox key={brand.id} value={brand.id}>
            <span style={{ fontSize: '14px', color: '#444' }}>
              {brand.name}
            </span>
          </Checkbox>
        ))}
      </div>
    </Checkbox.Group>
  );
};

export default BrandFilter;