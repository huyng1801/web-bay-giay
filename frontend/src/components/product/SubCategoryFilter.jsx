import React from 'react';
import { Checkbox, Space } from 'antd';


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
    checkboxGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    }
};

const SubCategoryFilter = ({ subCategories, selectedSubCategories, onSubCategoryChange }) => {
    return (
        <>
            <div style={styles.title}>Danh Mục</div>
            <Checkbox.Group 
                value={selectedSubCategories}
                onChange={onSubCategoryChange}
                style={styles.checkboxGroup}
            >
                <Space direction="vertical">
                    {subCategories.map(category => (
                        <Checkbox 
                            key={category.subCategoryId} 
                            value={category.subCategoryId}
                        >
                            {category.subCategoryName}
                        </Checkbox>
                    ))}
                </Space>
            </Checkbox.Group>
        </>
    );
};

export default SubCategoryFilter;