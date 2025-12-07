import React from 'react';
import { Checkbox } from 'antd';

const ColorFilter = ({ colors = [], selectedColors = [], onColorChange }) => {
  const handleColorChange = (checkedValues) => {
    onColorChange(checkedValues);
  };

  const colorMap = {
    'Đen': '#000000',
    'Trắng': '#ffffff',
    'Xám': '#808080',
    'Nâu': '#8b4513',
    'Xanh': '#0066cc',
    'Đỏ': '#dc3545',
    'Vàng': '#ffc107'
  };

  return (
    <Checkbox.Group
      value={selectedColors}
      onChange={handleColorChange}
      style={{ width: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {colors.map(color => (
          <Checkbox key={color.id} value={color.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: colorMap[color.name] || '#ccc',
                  border: color.name === 'Trắng' ? '1px solid #ddd' : 'none',
                  borderRadius: '3px',
                  flexShrink: 0
                }}
              />
              <span style={{ fontSize: '14px', color: '#444' }}>
                {color.name}
              </span>
            </div>
          </Checkbox>
        ))}
      </div>
    </Checkbox.Group>
  );
};

export default ColorFilter;