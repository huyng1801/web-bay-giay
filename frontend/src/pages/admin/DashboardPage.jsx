import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Spin, Alert, List, Typography, Tag, Select, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  DollarCircleOutlined, 
  ShoppingOutlined, 
  UserOutlined,
  ShopOutlined,
  TagsOutlined,
  PictureOutlined,
  TrophyOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import StatisticService from '../../services/admin/StatisticService';
import moment from 'moment';

const { Option } = Select;

const { Text } = Typography;

const styles = {
  alert: {
    marginBottom: '24px'
  },
  card: {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    height: '100%'
  },
  icon: {
    fontSize: '24px',
    padding: '12px',
    borderRadius: '12px',
    marginRight: '16px'
  },
  statContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  statLabel: {
    color: '#8c8c8c',
    fontSize: '14px',
    marginBottom: '4px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#001529'
  },
  bestSellingCard: {
    height: '100%'
  }
};

const StatisticCard = ({ icon: Icon, iconStyle, label, value, onClick, clickable = false }) => (
  <Card 
    style={{
      ...styles.card,
      cursor: clickable ? 'pointer' : 'default'
    }} 
    hoverable={clickable}
    onClick={clickable ? onClick : undefined}
  >
    <div style={styles.statContainer}>
      <Icon style={{ ...styles.icon, ...iconStyle }} />
      <div>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
    </div>
  </Card>
);

const BestSellingProducts = ({ products = [], loading }) => {
  const getTagColor = (index) => {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return '#cd7f32';
      default: return 'default';
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrophyOutlined style={{ color: '#faad14' }} />
          <span>Sản Phẩm Bán Chạy</span>
        </div>
      }
      style={{ ...styles.card, ...styles.bestSellingCard }}
      loading={loading}
    >
      <List
        dataSource={products}
        renderItem={(item, index) => (
          <List.Item>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag color={getTagColor(index)} style={{ minWidth: '24px', textAlign: 'center' }}>
                  #{index + 1}
                </Tag>
                <Text ellipsis style={{ maxWidth: '200px' }}>{item.productName}</Text>
              </div>
              <Text strong>{item.totalQuantitySold} đã bán</Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [timeFilter, setTimeFilter] = useState('today'); // today, week, month, year
  const [selectedYear, setSelectedYear] = useState(2025); // Force current year to 2025
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    try {
      let statsData, chartStats;
      
      switch (timeFilter) {
        case 'today':
          statsData = await StatisticService.getStatisticsToday();
          chartStats = await StatisticService.getHourlyStatisticsForToday();
          console.log('Hourly Stats for Today:', chartStats);
          break;
        case 'week':
          const startOfWeek = moment().startOf('isoWeek'); // Tuần bắt đầu từ thứ 2
          const endOfWeek = moment().endOf('isoWeek'); // Tuần kết thúc chủ nhật
          console.log('Week range (Monday-Sunday):', startOfWeek.format('YYYY-MM-DD'), 'to', endOfWeek.format('YYYY-MM-DD'));
          statsData = await StatisticService.getStatisticsByDateRange(
            startOfWeek.format('YYYY-MM-DD'),
            endOfWeek.format('YYYY-MM-DD')
          );
          console.log('Week stats data:', statsData);
          // Sử dụng cùng date range cho chart để đảm bảo consistency
          chartStats = await StatisticService.getDailyStatisticsByDateRange(
            startOfWeek.format('YYYY-MM-DD'),
            endOfWeek.format('YYYY-MM-DD')
          );
          break;
        case 'month':
          const startOfMonth = moment().year(selectedYear).month(selectedMonth - 1).startOf('month');
          const endOfMonth = moment().year(selectedYear).month(selectedMonth - 1).endOf('month');
          console.log('Month range:', startOfMonth.format('YYYY-MM-DD'), 'to', endOfMonth.format('YYYY-MM-DD'));
          
          statsData = await StatisticService.getStatisticsByDateRange(
            startOfMonth.format('YYYY-MM-DD'),
            endOfMonth.format('YYYY-MM-DD')
          );
          console.log('Month stats data:', statsData);
          
          // Sử dụng cùng date range cho chart để đảm bảo consistency
          chartStats = await StatisticService.getDailyStatisticsByDateRange(
            startOfMonth.format('YYYY-MM-DD'),
            endOfMonth.format('YYYY-MM-DD')
          );
          break;
        case 'year':
          statsData = await StatisticService.getStatisticsForYear(selectedYear);
          chartStats = await StatisticService.getMonthlyStatisticsForSpecificYear(selectedYear);
          break;

        default:
          statsData = await StatisticService.getStatisticsToday();
          chartStats = await StatisticService.getHourlyStatisticsForToday();
      }

      setStatistics(statsData);
      
      // Format chart data based on time filter
      let formattedChartData = [];
      if (chartStats && Array.isArray(chartStats)) {
        formattedChartData = chartStats.map((item) => {
          let value, orders, label;
          
          switch (timeFilter) {
            case 'today':
              value = Number(item.revenue) || 0;
              orders = Number(item.orders) || 0;
              label = `${item.hour}:00`;
              break;
            case 'week':
              value = Number(item.totalRevenue) || 0;
              orders = Number(item.totalOrders) || 0;
              label = moment(item.date).format('DD/MM');
              break;
            case 'month':
              value = Number(item.totalRevenue) || 0;
              orders = Number(item.totalOrders) || 0;
              console.log('Month chart item:', item); // Debug log
              console.log('Item date:', item.date); // Debug log
              label = item.date ? moment(item.date).format('DD/MM') : `${item.day}/${item.month}`;
              break;
            case 'year':
              value = Number(item.totalRevenue) || 0;
              orders = Number(item.totalOrders) || 0;
              label = `${item.month.toString().padStart(2, '0')}/${item.year}`;
              break;
            case 'custom':
              value = Number(item.totalRevenue) || 0;
              orders = Number(item.totalOrders) || 0;
              label = moment(item.date).format('DD/MM');
              break;
            default:
              value = Number(item.totalRevenue || item.revenue) || 0;
              orders = Number(item.totalOrders || item.orders) || 0;
              label = item.label || item.date || item.hour;
          }
          
          return {
            label,
            value,
            originalValue: value,
            orders: orders
          };
        });
      }
      
      console.log('Formatted Chart Data:', formattedChartData); // Debug log
      console.log('Sample chart item:', formattedChartData[0]); // Debug log
      setChartData(formattedChartData);
      setError(null);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [timeFilter, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleRevenueClick = () => {
    //navigate('/admin/revenue');
  };

  const statisticsConfig = [
    {
      icon: DollarCircleOutlined,
      iconStyle: { backgroundColor: '#e6f7ff', color: '#1890ff' },
      label: 'Doanh Thu',
      value: statistics?.totalRevenue ? `${statistics.totalRevenue.toLocaleString('vi-VN')} ₫` : '0 ₫',
      clickable: true,
      onClick: handleRevenueClick
    },
    {
      icon: TrophyOutlined,
      iconStyle: { backgroundColor: '#f6ffed', color: '#52c41a' },
      label: 'Lợi Nhuận',
      value: statistics?.totalProfit ? `${Math.round(statistics.totalProfit).toLocaleString('vi-VN')} ₫` : '0 ₫'
    },
    {
      icon: ShoppingOutlined,
      iconStyle: { backgroundColor: '#fff0f6', color: '#eb2f96' },
      label: 'Đơn Hàng',
      value: statistics?.totalOrders ? statistics.totalOrders.toLocaleString('vi-VN') : '0'
    },
    {
      icon: UserOutlined,
      iconStyle: { backgroundColor: '#fff7e6', color: '#fa8c16' },
      label: timeFilter === 'today' ? 'Khách Hàng Mới' : 'Khách Hàng',
      value: statistics?.totalCustomers ? statistics.totalCustomers.toLocaleString('vi-VN') : '0'
    },
    {
      icon: ShopOutlined,
      iconStyle: { backgroundColor: '#f9f0ff', color: '#722ed1' },
      label: timeFilter === 'today' ? 'Thương Hiệu Bán' : 'Thương Hiệu',
      value: statistics?.totalBrands ? statistics.totalBrands.toLocaleString('vi-VN') : '0'
    },
    {
      icon: TagsOutlined,
      iconStyle: { backgroundColor: '#fff2e8', color: '#fa541c' },
      label: timeFilter === 'today' ? 'Danh Mục Bán' : 'Danh Mục',
      value: statistics?.totalCategories ? statistics.totalCategories.toLocaleString('vi-VN') : '0'
    },
    {
      icon: PictureOutlined,
      iconStyle: { backgroundColor: '#e6fffb', color: '#13c2c2' },
      label: 'Banner',
      value: statistics?.totalBanners ? statistics.totalBanners.toLocaleString('vi-VN') : '0'
    },
    {
      icon: ShoppingOutlined,
      iconStyle: { backgroundColor: '#fcffe6', color: '#a0d911' },
      label: timeFilter === 'today' ? 'Sản Phẩm Bán' : 'Sản Phẩm',
      value: statistics?.totalProducts ? statistics.totalProducts.toLocaleString('vi-VN') : '0'
    }
  ];

  // Get time filter options
  const getTimeFilterOptions = () => [
    { label: '📅 Hôm nay', value: 'today' },
    { label: '📊 Tuần này', value: 'week' },
    { label: '📈 Tháng này', value: 'month' },
    { label: '📋 Năm này', value: 'year' }
  ];

  // Get period description
  const getPeriodDescription = () => {
    switch (timeFilter) {
      case 'today':
        return `Hôm nay - ${moment().format('DD/MM/YYYY')}`;
      case 'week':
        return `Tuần này - ${moment().startOf('isoWeek').format('DD/MM')} đến ${moment().endOf('isoWeek').format('DD/MM/YYYY')}`;
      case 'month':
        return `Tháng ${selectedMonth}/${selectedYear}`;
      case 'year':
        return `Năm ${selectedYear}`;
      default:
        return '';
    }
  };

  // Get chart title based on filter
  const getChartTitle = () => {
    switch (timeFilter) {
      case 'today':
        return 'Doanh Thu Theo Giờ - Hôm Nay';
      case 'week':
        return 'Doanh Thu Theo Ngày - Tuần Này';
      case 'month':
        return `Doanh Thu Theo Ngày - Tháng ${selectedMonth}/${selectedYear}`;
      case 'year':
        return `Doanh Thu Theo Tháng - Năm ${selectedYear}`;
      case 'custom':
        return 'Doanh Thu Theo Ngày - Tùy Chọn';
      default:
        return 'Doanh Thu';
    }
  };



  return (
    <AdminLayout>
      <div style={{ padding: '0' }}>
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={styles.alert}
          />
        )}

        {/* Time Filter Section */}
        <Card style={{ ...styles.card, marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <BarChartOutlined style={{ fontSize: '20px', color: '#1890ff', marginRight: '8px' }} />
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Thống Kê</span>
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '12px' }}>
                {getPeriodDescription()}
              </span>
            </Col>
            <Col>
              <Select
                value={timeFilter}
                onChange={setTimeFilter}
                style={{ minWidth: '120px' }}
                suffixIcon={<CalendarOutlined />}
              >
                {getTimeFilterOptions().map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Col>
            
            {timeFilter === 'month' && (
              <>
                <Col>
                  <Select
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    style={{ width: '80px' }}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <Option key={i + 1} value={i + 1}>
                        T{i + 1}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col>
                  <Select
                    value={selectedYear}
                    onChange={setSelectedYear}
                    style={{ width: '100px' }}
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = moment().year() - i;
                      return (
                        <Option key={year} value={year}>
                          {year}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
              </>
            )}
            
            {timeFilter === 'year' && (
              <Col>
                <Select
                  value={selectedYear}
                  onChange={setSelectedYear}
                  style={{ width: '100px' }}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = moment().year() - i;
                    return (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            )}
            

            
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchStatistics}
                loading={loading}
              >
                Làm mới
              </Button>
            </Col>
          </Row>
        </Card>

        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            {statisticsConfig.map((stat, index) => (
              <Col xs={24} sm={12} md={12} lg={6} xl={6} key={index}>
                <StatisticCard
                  icon={stat.icon}
                  iconStyle={stat.iconStyle}
                  label={stat.label}
                  value={stat.value}
                  clickable={stat.clickable}
                  onClick={stat.onClick}
                />
              </Col>
            ))}

            <Col xs={24} lg={16}>
              <Card
                title={getChartTitle()}
                style={styles.card}
                bodyStyle={{ height: '400px', padding: '20px' }}
              >
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="label" 
                        axisLine={{ stroke: '#d9d9d9' }}
                        tickLine={{ stroke: '#d9d9d9' }}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <YAxis 
                        axisLine={{ stroke: '#d9d9d9' }}
                        tickLine={{ stroke: '#d9d9d9' }}
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => {
                          const numValue = Number(value) || 0;
                          if (numValue >= 1000000) {
                            return `${(numValue / 1000000).toFixed(1)}M ₫`;
                          } else if (numValue >= 1000) {
                            return `${(numValue / 1000).toFixed(0)}K ₫`;
                          }
                          return `${numValue.toLocaleString('vi-VN')} ₫`;
                        }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #d9d9d9',
                          borderRadius: '6px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}
                        formatter={(value, name, props) => {
                          const revenue = Number(value) || 0;
                          const orders = Number(props.payload.orders) || 0;
                          return [
                            `${revenue.toLocaleString('vi-VN')} ₫`,
                            `Doanh Thu (${orders} đơn)`
                          ];
                        }}
                        labelFormatter={(label) => `${timeFilter === 'today' ? 'Giờ' : 'Thời gian'}: ${label}`}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#1890ff" 
                        radius={[4, 4, 0, 0]}
                        stroke="#1890ff"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#999'
                  }}>
                    Không có dữ liệu để hiển thị
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <BestSellingProducts 
                products={statistics?.bestSellingProducts} 
                loading={loading}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;