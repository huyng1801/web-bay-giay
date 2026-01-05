package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.model.*;
import vn.student.polyshoes.repository.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;
import java.util.TimeZone;
import java.util.Locale;

@Service
public class StatisticService {

    private static final Logger logger = LoggerFactory.getLogger(StatisticService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;
    
    @Autowired
    private vn.student.polyshoes.repository.BannerRepository bannerRepository;

    public Map<String, Object> getStatisticsToday() {
        try {
            Calendar today = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            int year = today.get(Calendar.YEAR);
            int month = today.get(Calendar.MONTH) + 1;
            int day = today.get(Calendar.DAY_OF_MONTH);
            List<Order> orders = orderRepository.findOrdersByDate(year, month, day);
            Map<String, Object> statistics = calculateStatistics(orders);
            // Tính toán theo thời gian được chọn thay vì tổng toàn hệ thống
            statistics.put("totalBanners", calculateBannersInPeriod(orders));
            statistics.put("totalBrands", calculateBrandsInPeriod(orders));
            statistics.put("totalCategories", calculateCategoriesInPeriod(orders));
            statistics.put("totalProducts", calculateProductsInPeriod(orders));
            statistics.put("totalOrders", orderRepository.countOrdersByDate(year, month, day));
            statistics.put("bestSellingProducts", getBestSellingProductsInPeriod(orders));
            return statistics;
        } catch (Exception e) {
            logger.error("Error getting today's statistics: ", e);
            return getDefaultStatistics();
        }
    }

    public List<Map<String, Object>> getHourlyStatisticsToday() {
        try {
            Calendar today = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            int year = today.get(Calendar.YEAR);
            int month = today.get(Calendar.MONTH) + 1;
            int day = today.get(Calendar.DAY_OF_MONTH);
            
            List<Map<String, Object>> hourlyStats = new ArrayList<>();
            
            // Generate stats for each hour (0-23)
            for (int hour = 0; hour < 24; hour++) {
                List<Order> orders = orderRepository.findOrdersByDateAndHour(year, month, day, hour);
                Map<String, Object> hourStats = new HashMap<>();
                hourStats.put("hour", hour);
                hourStats.put("orders", orders.size());
                hourStats.put("revenue", orders.stream()
                    .mapToLong(Order::getTotalPrice)
                    .sum());
                hourlyStats.add(hourStats);
            }
            
            return hourlyStats;
        } catch (Exception e) {
            logger.error("Error getting hourly statistics for today: ", e);
            return new ArrayList<>();
        }
    }

    public Map<String, Object> getStatisticsThisMonth() {
        try {
            Calendar today = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            int year = today.get(Calendar.YEAR);
            int month = today.get(Calendar.MONTH) + 1;
            List<Order> orders = orderRepository.findOrdersByMonth(year, month);
            Map<String, Object> statistics = calculateStatistics(orders);
            // Tính toán theo thời gian được chọn thay vì tổng toàn hệ thống
            statistics.put("totalBanners", calculateBannersInPeriod(orders));
            statistics.put("totalBrands", calculateBrandsInPeriod(orders));
            statistics.put("totalCategories", calculateCategoriesInPeriod(orders));
            statistics.put("totalProducts", calculateProductsInPeriod(orders));
            statistics.put("totalOrders", orderRepository.countOrdersByMonth(year, month));
            statistics.put("bestSellingProducts", getBestSellingProductsInPeriod(orders));
            return statistics;
        } catch (Exception e) {
            logger.error("Error getting this month's statistics: ", e);
            return getDefaultStatistics();
        }
    }

    public Map<String, Object> getStatisticsThisYear() {
        try {
            Calendar today = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            int year = today.get(Calendar.YEAR);
            List<Order> orders = orderRepository.findOrdersByYear(year);
            Map<String, Object> statistics = calculateStatistics(orders);
            // Tính toán theo thời gian được chọn thay vì tổng toàn hệ thống
            statistics.put("totalBanners", calculateBannersInPeriod(orders));
            statistics.put("totalBrands", calculateBrandsInPeriod(orders));
            statistics.put("totalCategories", calculateCategoriesInPeriod(orders));
            statistics.put("totalProducts", calculateProductsInPeriod(orders));
            statistics.put("totalOrders", orderRepository.countOrdersByYear(year));
            statistics.put("bestSellingProducts", getBestSellingProductsInPeriod(orders));
            return statistics;
        } catch (Exception e) {
            logger.error("Error getting this year's statistics: ", e);
            return getDefaultStatistics();
        }
    }

    public Map<String, Integer> getItemQuantityByCategory() {
        Map<String, Integer> categoryQuantities = new HashMap<>();
        List<Order> orders = orderRepository.findOrdersByYear(Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh")).get(Calendar.YEAR));
        for (Order order : orders) {
            List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
            for (OrderItem item : orderItems) {
                String categoryName = item.getProductDetails().getProduct().getSubCategory().getCategory().getCategoryName();
                categoryQuantities.put(categoryName, categoryQuantities.getOrDefault(categoryName, 0) + item.getQuantity());
            }
        }
        return categoryQuantities;
    }

    private Map<String, Object> calculateStatistics(List<Order> orders) {
        Map<String, Object> statistics = new HashMap<>();
        double totalRevenue = 0;
        double totalShippingFee = 0;
        double totalVoucherDiscount = 0;
        double netRevenue = 0; // Revenue sau khi trừ discount
        double totalProfit = 0; // Lợi nhuận thực tế
        int totalQuantity = 0;
        Set<Integer> uniqueCustomers = new HashSet<>();
        
        for (Order order : orders) {
            if (order != null) {
                // Đếm khách hàng unique
                if (order.getCustomer() != null && order.getCustomer().getCustomerId() != null) {
                    uniqueCustomers.add(order.getCustomer().getCustomerId());
                }
                
                // Cộng phí vận chuyển từ Order entity
                if (order.getShippingFee() != null) {
                    totalShippingFee += order.getShippingFee();
                }
                
                // Cộng voucher discount
                if (order.getVoucherDiscount() != null) {
                    totalVoucherDiscount += order.getVoucherDiscount();
                }
                
                List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
                for (OrderItem item : orderItems) {
                    if (item != null && item.getQuantity() != null) {
                        double itemRevenue = item.getUnitPrice() * item.getQuantity();
                        totalRevenue += itemRevenue;
                        totalQuantity += item.getQuantity();
                        
                        // Tính lợi nhuận: Doanh thu - chi phí ước tính
                        // Chi phí = 60% giá bán (cost price ước tính) + phí hao khẩu + vận chuyển + thuế
                        double costPrice = item.getUnitPrice() * 0.6; // 60% của selling price
                        double itemCost = costPrice * item.getQuantity();
                        double operationalCost = itemRevenue * 0.05; // 5% phí hoạt động
                        double itemProfit = itemRevenue - itemCost - operationalCost;
                        totalProfit += itemProfit;
                    }
                }
            }
        }
        
        // Tính net revenue = total revenue + shipping fee - voucher discount
        netRevenue = totalRevenue + totalShippingFee - totalVoucherDiscount;
        
        // Điều chỉnh lợi nhuận: trừ voucher discount và cộng shipping profit (30% phí ship)
        double shippingProfit = totalShippingFee * 0.3; // Lợi nhuận từ phí vận chuyển
        double finalProfit = totalProfit - totalVoucherDiscount + shippingProfit;
        
        statistics.put("totalRevenue", totalRevenue); // Doanh thu từ sản phẩm
        statistics.put("totalShippingFee", totalShippingFee); // Phí vận chuyển
        statistics.put("totalVoucherDiscount", totalVoucherDiscount); // Giảm giá voucher
        statistics.put("netRevenue", netRevenue); // Doanh thu thực tế
        statistics.put("totalProfit", Math.max(0, finalProfit)); // Lợi nhuận thực tế (không âm)
        statistics.put("totalQuantity", totalQuantity);
        statistics.put("totalOrders", orders.size());
        statistics.put("totalCustomers", uniqueCustomers.size()); // Số khách hàng unique trong period này
        
        return statistics;
    }
    // Default statistics in case of error
    private Map<String, Object> getDefaultStatistics() {
        Map<String, Object> errorStats = new HashMap<>();
        errorStats.put("totalRevenue", 0.0);
        errorStats.put("totalShippingFee", 0.0);
        errorStats.put("totalVoucherDiscount", 0.0);
        errorStats.put("netRevenue", 0.0);
        errorStats.put("totalProfit", 0.0);
        errorStats.put("totalQuantity", 0);
        errorStats.put("totalBanners", 0);
        errorStats.put("totalBrands", 0);
        errorStats.put("totalCategories", 0);
        errorStats.put("totalCustomers", 0);
        errorStats.put("totalProducts", 0);
        errorStats.put("totalOrders", 0);
        errorStats.put("bestSellingProducts", new ArrayList<>());
        return errorStats;
    }



    // Get monthly statistics for the current year (for charting)
    public List<Map<String, Object>> getMonthlyStatisticsForCurrentYear() {
        try {
            int year = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh")).get(Calendar.YEAR); // Get the current year
            List<Map<String, Object>> monthlyStats = new ArrayList<>();

            for (int month = 1; month <= 12; month++) {
                Map<String, Object> stats = getStatisticsByMonth(year, month);  // Reuse existing method to get monthly stats
                stats.put("month", month);
                stats.put("year", year);
                monthlyStats.add(stats);
            }

            return monthlyStats;
        } catch (Exception e) {
            logger.error("Error getting monthly statistics for current year: ", e);
            return new ArrayList<>();
        }
    }



    // Get daily statistics for a specific month (for charting)
    public List<Map<String, Object>> getDailyStatisticsForMonth(int year, int month) {
        // Generate statistics for each day in the month
        List<Map<String, Object>> dailyStats = new ArrayList<>();
        int daysInMonth = java.time.Month.of(month).length(java.time.Year.isLeap(year)); // Get the number of days in the month
        for (int day = 1; day <= daysInMonth; day++) {
            Map<String, Object> stats = getStatisticsByDay(year, month, day);
            dailyStats.add(stats);
        }
        return dailyStats;
    }
    public Map<String, Object> getStatisticsByDay(int year, int month, int day) {
        // Retrieve orders for the specific day using the repository
        List<Order> orders = orderRepository.findOrdersByDate(year, month, day);
        
        // Calculate statistics for the retrieved orders
        Map<String, Object> stats = calculateStatistics(orders);
        
        // Thêm thông tin ngày tháng
        stats.put("date", String.format("%04d-%02d-%02d", year, month, day));
        stats.put("year", year);
        stats.put("month", month);
        stats.put("day", day);
        
        return stats;
    }
    
    // Get revenue by date range with different view types
    public Map<String, Object> getRevenueByDateRange(String startDate, String endDate, String viewType) {
        List<Map<String, Object>> revenueData = new ArrayList<>();
        double totalRevenue = 0;
        
        try {
            java.time.LocalDate start = java.time.LocalDate.parse(startDate);
            java.time.LocalDate end = java.time.LocalDate.parse(endDate);
            
            if ("day".equals(viewType)) {
                // Daily revenue
                java.time.LocalDate current = start;
                while (!current.isAfter(end)) {
                    List<Order> orders = orderRepository.findOrdersByDate(
                        current.getYear(), 
                        current.getMonthValue(), 
                        current.getDayOfMonth()
                    );
                    
                    Map<String, Object> stats = calculateStatistics(orders);
                    Map<String, Object> dayData = new HashMap<>();
                    dayData.put("date", current.toString());
                    dayData.put("revenue", stats.get("totalRevenue"));
                    dayData.put("orderCount", orders.size());
                    
                    revenueData.add(dayData);
                    totalRevenue += (Double) stats.get("totalRevenue");
                    
                    current = current.plusDays(1);
                }
            } else if ("month".equals(viewType)) {
                // Monthly revenue
                java.time.LocalDate current = start.withDayOfMonth(1);
                java.time.LocalDate endMonth = end.withDayOfMonth(1);
                
                while (!current.isAfter(endMonth)) {
                    List<Order> orders = orderRepository.findOrdersByMonth(
                        current.getYear(), 
                        current.getMonthValue()
                    );
                    
                    Map<String, Object> stats = calculateStatistics(orders);
                    Map<String, Object> monthData = new HashMap<>();
                    monthData.put("date", current.toString());
                    monthData.put("revenue", stats.get("totalRevenue"));
                    monthData.put("orderCount", orders.size());
                    
                    revenueData.add(monthData);
                    totalRevenue += (Double) stats.get("totalRevenue");
                    
                    current = current.plusMonths(1);
                }
            } else if ("year".equals(viewType)) {
                // Yearly revenue
                for (int year = start.getYear(); year <= end.getYear(); year++) {
                    List<Order> orders = orderRepository.findOrdersByYear(year);
                    
                    Map<String, Object> stats = calculateStatistics(orders);
                    Map<String, Object> yearData = new HashMap<>();
                    yearData.put("date", String.valueOf(year));
                    yearData.put("revenue", stats.get("totalRevenue"));
                    yearData.put("orderCount", orders.size());
                    
                    revenueData.add(yearData);
                    totalRevenue += (Double) stats.get("totalRevenue");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("data", revenueData);
        result.put("totalRevenue", totalRevenue);
        
        return result;
    }
    
    // Get daily revenue for a specific month
    public List<Map<String, Object>> getDailyRevenue(int year, int month) {
        List<Map<String, Object>> dailyRevenue = new ArrayList<>();
        int daysInMonth = java.time.Month.of(month).length(java.time.Year.isLeap(year));
        
        for (int day = 1; day <= daysInMonth; day++) {
            List<Order> orders = orderRepository.findOrdersByDate(year, month, day);
            Map<String, Object> stats = calculateStatistics(orders);
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", String.format("%04d-%02d-%02d", year, month, day));
            dayData.put("revenue", stats.get("totalRevenue"));
            dayData.put("orderCount", orders.size());
            
            dailyRevenue.add(dayData);
        }
        
        return dailyRevenue;
    }
    
    // Get monthly revenue for a specific year
    public List<Map<String, Object>> getMonthlyRevenue(int year) {
        List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            List<Order> orders = orderRepository.findOrdersByMonth(year, month);
            Map<String, Object> stats = calculateStatistics(orders);
            
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("date", String.format("%04d-%02d", year, month));
            monthData.put("revenue", stats.get("totalRevenue"));
            monthData.put("orderCount", orders.size());
            
            monthlyRevenue.add(monthData);
        }
        
        return monthlyRevenue;
    }

    public Map<String, Object> getStatisticsByDateRange(String startDate, String endDate) {
        try {
            String[] startParts = startDate.split("-");
            String[] endParts = endDate.split("-");
            
            int startYear = Integer.parseInt(startParts[0]);
            int startMonth = Integer.parseInt(startParts[1]) - 1; // Calendar month is 0-based
            int startDay = Integer.parseInt(startParts[2]);
            
            int endYear = Integer.parseInt(endParts[0]);
            int endMonth = Integer.parseInt(endParts[1]) - 1; // Calendar month is 0-based
            int endDay = Integer.parseInt(endParts[2]);
            
            Calendar startCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            startCal.set(startYear, startMonth, startDay, 0, 0, 0);
            startCal.set(Calendar.MILLISECOND, 0);
            
            Calendar endCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            endCal.set(endYear, endMonth, endDay, 23, 59, 59);
            endCal.set(Calendar.MILLISECOND, 999);
            
            List<Order> orders = orderRepository.findOrdersByDateRange(
                startCal.getTime(), 
                endCal.getTime()
            );
            
            Map<String, Object> statistics = calculateStatistics(orders);
            statistics.put("startDate", startDate);
            statistics.put("endDate", endDate);
            
            // Tính toán theo thời gian được chọn thay vì tổng toàn hệ thống
            statistics.put("totalBanners", calculateBannersInPeriod(orders));
            statistics.put("totalBrands", calculateBrandsInPeriod(orders));
            statistics.put("totalCategories", calculateCategoriesInPeriod(orders));
            statistics.put("totalProducts", calculateProductsInPeriod(orders));
            statistics.put("bestSellingProducts", getBestSellingProductsInPeriod(orders));
            
            return statistics;
        } catch (Exception e) {
            logger.error("Error getting statistics for date range {} to {}: ", startDate, endDate, e);
            Map<String, Object> emptyStats = new HashMap<>();
            emptyStats.put("totalOrders", 0);
            emptyStats.put("totalRevenue", 0.0);
            emptyStats.put("totalQuantity", 0);
            emptyStats.put("startDate", startDate);
            emptyStats.put("endDate", endDate);
            return emptyStats;
        }
    }

    public List<Map<String, Object>> getDailyStatisticsForCurrentWeek() {
        try {
            Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            
            // Set to start of week (Monday)
            int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
            int daysFromMonday = (dayOfWeek == Calendar.SUNDAY) ? 6 : dayOfWeek - Calendar.MONDAY;
            cal.add(Calendar.DAY_OF_MONTH, -daysFromMonday);
            
            List<Map<String, Object>> weeklyStats = new ArrayList<>();
            
            for (int i = 0; i < 7; i++) {
                int year = cal.get(Calendar.YEAR);
                int month = cal.get(Calendar.MONTH) + 1;
                int day = cal.get(Calendar.DAY_OF_MONTH);
                
                List<Order> orders = orderRepository.findOrdersByDate(year, month, day);
                Map<String, Object> stats = calculateStatistics(orders);
                
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("date", String.format("%04d-%02d-%02d", year, month, day));
                dayData.put("dayOfWeek", cal.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.ENGLISH));
                dayData.put("totalOrders", orders.size());
                dayData.put("totalRevenue", stats.get("totalRevenue"));
                dayData.put("totalQuantity", stats.get("totalQuantity"));
                
                weeklyStats.add(dayData);
                
                // Move to next day
                cal.add(Calendar.DAY_OF_MONTH, 1);
            }
            
            return weeklyStats;
        } catch (Exception e) {
            logger.error("Error getting daily statistics for current week: ", e);
            return new ArrayList<>();
        }
    }
    
    // Helper methods để tính toán theo period thay vì tổng hệ thống
    private int calculateBannersInPeriod(List<Order> orders) {
        // Banner không liên quan trực tiếp đến đơn hàng, trả về tổng banner active
        try {
            return (int) bannerRepository.count();
        } catch (Exception e) {
            logger.warn("Error counting banners: {}", e.getMessage());
            return 0;
        }
    }
    
    private int calculateBrandsInPeriod(List<Order> orders) {
        Set<Integer> brandIds = new HashSet<>();
        for (Order order : orders) {
            if (order != null) {
                List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
                for (OrderItem item : orderItems) {
                    if (item != null && item.getProductDetails() != null 
                        && item.getProductDetails().getProduct() != null
                        && item.getProductDetails().getProduct().getBrand() != null) {
                        brandIds.add(item.getProductDetails().getProduct().getBrand().getBrandId());
                    }
                }
            }
        }
        return brandIds.size();
    }
    
    private int calculateCategoriesInPeriod(List<Order> orders) {
        Set<Integer> categoryIds = new HashSet<>();
        for (Order order : orders) {
            if (order != null) {
                List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
                for (OrderItem item : orderItems) {
                    if (item != null && item.getProductDetails() != null 
                        && item.getProductDetails().getProduct() != null
                        && item.getProductDetails().getProduct().getSubCategory() != null
                        && item.getProductDetails().getProduct().getSubCategory().getCategory() != null) {
                        categoryIds.add(item.getProductDetails().getProduct().getSubCategory().getCategory().getCategoryId());
                    }
                }
            }
        }
        return categoryIds.size();
    }
    
    private int calculateProductsInPeriod(List<Order> orders) {
        Set<Integer> productIds = new HashSet<>();
        for (Order order : orders) {
            if (order != null) {
                List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
                for (OrderItem item : orderItems) {
                    if (item != null && item.getProductDetails() != null 
                        && item.getProductDetails().getProduct() != null) {
                        productIds.add(item.getProductDetails().getProduct().getProductId());
                    }
                }
            }
        }
        return productIds.size();
    }
    
    private List<Map<String, Object>> getBestSellingProductsInPeriod(List<Order> orders) {
        logger.info("DEBUG: Processing {} orders for best selling products", orders.size());
        Map<Integer, Integer> productQuantities = new HashMap<>();
        Map<Integer, String> productNames = new HashMap<>();
        
        for (Order order : orders) {
            logger.info("DEBUG: Processing order {} created at {}", order.getOrderId(), order.getCreatedAt());
            if (order != null) {
                List<OrderItem> orderItems = orderItemRepository.findByOrder(order);
                for (OrderItem item : orderItems) {
                    if (item != null && item.getProductDetails() != null 
                        && item.getProductDetails().getProduct() != null) {
                        
                        Product product = item.getProductDetails().getProduct();
                        Integer productId = product.getProductId();
                        Integer quantity = item.getQuantity();
                        
                        logger.info("DEBUG: Product {} (ID: {}) - Quantity: {}", product.getProductName(), productId, quantity);
                        
                        productQuantities.put(productId, productQuantities.getOrDefault(productId, 0) + quantity);
                        productNames.put(productId, product.getProductName());
                    }
                }
            }
        }
        
        List<Map<String, Object>> result = productQuantities.entrySet().stream()
                .sorted((e1, e2) -> Integer.compare(e2.getValue(), e1.getValue()))
                .limit(10)
                .map(entry -> {
                    Map<String, Object> productStat = new HashMap<>();
                    productStat.put("productName", productNames.get(entry.getKey()));
                    productStat.put("totalQuantitySold", entry.getValue());
                    logger.info("DEBUG: Best selling product: {} - Sold: {}", productNames.get(entry.getKey()), entry.getValue());
                    return productStat;
                })
                .collect(Collectors.toList());
        
        logger.info("DEBUG: Total best selling products found: {}", result.size());
        return result;
    }
    
    public Map<String, Object> getStatisticsByMonth(int year, int month) {
        try {
            // Get all orders for the specified month
            List<Order> orders = orderRepository.findOrdersByMonth(year, month);
            
            Map<String, Object> statistics = calculateStatistics(orders);
            statistics.put("year", year);
            statistics.put("month", month);
            
            // Tính toán theo tháng được chọn thay vì tổng toàn hệ thống  
            statistics.put("totalBanners", calculateBannersInPeriod(orders));
            statistics.put("totalBrands", calculateBrandsInPeriod(orders));
            statistics.put("totalCategories", calculateCategoriesInPeriod(orders));
            statistics.put("totalProducts", calculateProductsInPeriod(orders));
            statistics.put("bestSellingProducts", getBestSellingProductsInPeriod(orders));
            
            return statistics;
        } catch (Exception e) {
            logger.error("Error getting statistics for month {}/{}: ", month, year, e);
            return getDefaultStatistics();
        }
    }
    
    public List<Map<String, Object>> getDailyStatisticsByDateRange(String startDate, String endDate) {
        try {
            String[] startParts = startDate.split("-");
            String[] endParts = endDate.split("-");
            
            int startYear = Integer.parseInt(startParts[0]);
            int startMonth = Integer.parseInt(startParts[1]) - 1; // Calendar month is 0-based
            int startDay = Integer.parseInt(startParts[2]);
            
            int endYear = Integer.parseInt(endParts[0]);
            int endMonth = Integer.parseInt(endParts[1]) - 1; // Calendar month is 0-based
            int endDay = Integer.parseInt(endParts[2]);
            
            Calendar startCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            startCal.set(startYear, startMonth, startDay);
            
            Calendar endCal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            endCal.set(endYear, endMonth, endDay);
            
            List<Map<String, Object>> dailyStats = new ArrayList<>();
            
            // Iterate through each day in the range
            Calendar current = (Calendar) startCal.clone();
            while (!current.after(endCal)) {
                int year = current.get(Calendar.YEAR);
                int month = current.get(Calendar.MONTH) + 1;
                int day = current.get(Calendar.DAY_OF_MONTH);
                
                List<Order> orders = orderRepository.findOrdersByDate(year, month, day);
                Map<String, Object> stats = calculateStatistics(orders);
                
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("date", String.format("%04d-%02d-%02d", year, month, day));
                dayData.put("dayOfWeek", current.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, Locale.ENGLISH));
                dayData.put("totalOrders", orders.size());
                dayData.put("totalRevenue", stats.get("totalRevenue"));
                dayData.put("totalQuantity", stats.get("totalQuantity"));
                
                dailyStats.add(dayData);
                
                // Move to next day
                current.add(Calendar.DAY_OF_MONTH, 1);
            }
            
            return dailyStats;
        } catch (Exception e) {
            logger.error("Error getting daily statistics for date range {} to {}: ", startDate, endDate, e);
            return new ArrayList<>();
        }
    }
    
}
