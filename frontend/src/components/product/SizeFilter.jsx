import React from 'react';
import { Checkbox } from 'antd';

const SizeFilter = ({ sizes = [], selectedSizes = [], onSizeChange }) => {
  const handleSizeChange = (checkedValues) => {
    onSizeChange(checkedValues);
  };

  return (
    <Checkbox.Group
      value={selectedSizes}
      onChange={handleSizeChange}
      style={{ width: '100%' }}
    >
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '8px' 
      }}>
        {sizes.map(size => (
          <Checkbox 
            key={size.id} 
            value={size.id}
            style={{
              padding: '6px 8px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ 
              fontSize: '14px', 
              color: '#444',
              fontWeight: '500'
            }}>
              {size.name}
            </span>
          </Checkbox>
        ))}
      </div>
    </Checkbox.Group>
  );
};

export default SizeFilter;