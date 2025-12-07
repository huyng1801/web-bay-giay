import React from 'react';
import {
    Button,
    Input,
    Select
} from 'antd';

const { Option } = Select;

const VoucherHeader = ({ 
    onAddVoucher, 
    searchText, 
    onSearchChange, 
    statusFilter, 
    onStatusFilterChange,
    typeFilter,
    onTypeFilterChange 
}) => {
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 16 
        }}>
            <Button
                type="primary"
                onClick={onAddVoucher}
            >
                Thêm Voucher
            </Button>
            <div style={{ display: 'flex', gap: 16 }}>
                <Input.Search
                    placeholder="Tìm kiếm voucher (mã, tên, mô tả)"
                    allowClear
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{ width: 280 }}
                />
                <Select
                    value={statusFilter}
                    onChange={onStatusFilterChange}
                    style={{ width: 180 }}
                >
                    <Option value="">Tất cả trạng thái</Option>
                    <Option value="NOT_STARTED">Chưa bắt đầu</Option>
                    <Option value="ACTIVE">Đang hoạt động</Option>
                    <Option value="EXPIRED">Đã kết thúc</Option>
                    <Option value="OUT_OF_USES">Hết lượt sử dụng</Option>
                </Select>
                <Select
                    value={typeFilter}
                    onChange={onTypeFilterChange}
                    style={{ width: 180 }}
                >
                    <Option value="">Tất cả loại giảm giá</Option>
                    <Option value="PERCENTAGE">Phần trăm (%)</Option>
                    <Option value="FIXED">Số tiền cố định (VNĐ)</Option>
                </Select>
            </div>
        </div>
    );
};

export default VoucherHeader;