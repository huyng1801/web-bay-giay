import React from 'react';
import { Card, Row, Col, Input, Select, DatePicker, Radio, Button, Space, Tag } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import moment from 'moment';
import { statusOptions, getActiveFilterCount } from '../../utils/orderUtils';

const { Search } = Input;
const { RangePicker } = DatePicker;

const OrderFilter = ({
  filters,
  onFiltersChange,
  onReload,
  onClearFilters,
  loading
}) => {
  const {
    searchText,
    statusFilter,
    paymentFilter,
    dateRange,
    customerTypeFilter,
    filter
  } = filters;

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <Card 
        style={{ marginBottom: 16, borderRadius: 12 }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FilterOutlined style={{ color: '#1890ff' }} />
          <span>Tìm kiếm & Lọc đơn hàng</span>
          {activeFilterCount > 0 && (
            <Tag color="blue">{activeFilterCount} bộ lọc đang áp dụng</Tag>
          )}
        </div>
      }
      extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={onReload}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={onClearFilters}
            disabled={activeFilterCount === 0}
          >
            Xóa bộ lọc
          </Button>
        </Space>
      }
   
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={10} lg={10}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Tìm kiếm:</div>
          <Input.Search
            placeholder="Tìm theo mã đơn, tên khách hàng, SĐT..."
            value={searchText}
            onChange={(e) => onFiltersChange({ searchText: e.target.value })}
            allowClear
            style={{ width: '100%' }}
          />
        </Col>

        <Col xs={24} sm={12} md={6} lg={6}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Trạng thái đơn hàng:</div>
          <Select
            value={statusFilter}
            onChange={(value) => onFiltersChange({ statusFilter: value })}
            style={{ width: '100%' }}
            placeholder="Chọn trạng thái"
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            {statusOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={4} lg={4}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Trạng thái thanh toán:</div>
          <Select
            value={paymentFilter}
            onChange={(value) => onFiltersChange({ paymentFilter: value })}
            style={{ width: '100%' }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="paid">Đã thanh toán</Select.Option>
            <Select.Option value="unpaid">Chưa thanh toán</Select.Option>
          </Select>
        </Col>

        <Col xs={24} sm={12} md={4} lg={4}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Loại bán hàng:</div>
          <Select
            value={customerTypeFilter}
            onChange={(value) => onFiltersChange({ customerTypeFilter: value })}
            style={{ width: '100%' }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="online">🌐 Bán online</Select.Option>
            <Select.Option value="counter">🏪 Bán tại quầy</Select.Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 0]} style={{ marginTop: 8 }}>
        <Col xs={24} sm={24} md={10} lg={10}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Khoảng thời gian:</div>
          <RangePicker
            value={dateRange}
            onChange={(value) => onFiltersChange({ dateRange: value })}
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
            style={{ width: '100%' }}
            allowClear
            ranges={{
              'Hôm nay': [moment().startOf('day'), moment().endOf('day')],
              'Hôm qua': [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
              '7 ngày qua': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
              'Tuần này': [moment().startOf('week'), moment().endOf('week')],
              'Tuần trước': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
              'Tháng này': [moment().startOf('month'), moment().endOf('month')],
              'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
              '30 ngày qua': [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')]
            }}
          />
        </Col>
      </Row>

      
      
    </Card>
  );
};

export default OrderFilter;
