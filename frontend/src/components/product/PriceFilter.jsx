import React, { useCallback } from 'react';
import { Slider } from 'antd';


const styles = {
    container: {
        padding: '0',
        background: 'none',
        boxShadow: 'none',
        borderRadius: '0',
    },
    title: {
        marginBottom: '10px',
        fontSize: '15px',
        fontWeight: '700',
        color: '#222',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '2px solid #ff4d4f',
        paddingBottom: '4px',
        display: 'inline-block',
    },
    priceRange: {
        marginTop: '8px',
        color: '#666',
        fontSize: '14px',
    }
};

const PriceFilter = ({ onPriceChange }) => {
    const [range, setRange] = React.useState([0, 10000000]);

    const handleChange = useCallback((value) => {
        if (!value || !Array.isArray(value) || value.length !== 2) {
            return;
        }
        try {
            setRange(value);
            onPriceChange(value);
        } catch (error) {
            console.error('Error in price filter:', error);
        }
    }, [onPriceChange]);

    return (
        <>
            <div style={styles.title}>Khoảng Giá</div>
            <Slider
                range
                min={0}
                max={10000000}
                step={100000}
                value={range}
                onChange={handleChange}
            />
            <div style={styles.priceRange}>
                {range[0].toLocaleString('vi-VN')} VNĐ - {range[1].toLocaleString('vi-VN')} VNĐ
            </div>
        </>
    );
};

export default PriceFilter;