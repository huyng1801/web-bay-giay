package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.service.StatisticService;

import java.util.List;
import java.util.Map;

// Controller quản lý các API thống kê doanh thu, số lượng, dữ liệu bán hàng
@RestController
@RequestMapping("/statistics")
public class StatisticController {


    // Inject service xử lý logic thống kê
    @Autowired
    private StatisticService statisticService;

    // Lấy thống kê tổng hợp cho ngày hôm nay
    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getStatisticsToday() {
        Map<String, Object> statistics = statisticService.getStatisticsToday();
        return ResponseEntity.ok(statistics);
    }

    // Lấy thống kê theo từng giờ trong ngày hôm nay
    @GetMapping("/hourly-today")
    public ResponseEntity<List<Map<String, Object>>> getHourlyStatisticsToday() {
        List<Map<String, Object>> hourlyStats = statisticService.getHourlyStatisticsToday();
        return ResponseEntity.ok(hourlyStats);
    }

    // Lấy thống kê tổng hợp cho tháng hiện tại
    @GetMapping("/this-month")
    public ResponseEntity<Map<String, Object>> getStatisticsThisMonth() {
        Map<String, Object> statistics = statisticService.getStatisticsThisMonth();
        return ResponseEntity.ok(statistics);
    }

    // Lấy thống kê tổng hợp cho một tháng cụ thể
    @GetMapping("/month")
    public ResponseEntity<Map<String, Object>> getStatisticsByMonth(
            @RequestParam("year") int year, 
            @RequestParam("month") int month) {
        Map<String, Object> statistics = statisticService.getStatisticsByMonth(year, month);
        return ResponseEntity.ok(statistics);
    }

    // Lấy thống kê tổng hợp cho tháng hiện tại (trùng với /this-month)
    @GetMapping("/current-month")
    public ResponseEntity<Map<String, Object>> getCurrentMonthStatistics() {
        Map<String, Object> statistics = statisticService.getStatisticsThisMonth();
        return ResponseEntity.ok(statistics);
    }

    // Lấy thống kê tổng hợp cho năm hiện tại
    @GetMapping("/this-year")
    public ResponseEntity<Map<String, Object>> getStatisticsThisYear() {
        Map<String, Object> statistics = statisticService.getStatisticsThisYear();
        return ResponseEntity.ok(statistics);
    }

    // Lấy số lượng sản phẩm theo từng danh mục trong năm hiện tại
    @GetMapping("/item-quantity-by-category")
    public ResponseEntity<Map<String, Integer>> getItemQuantityByCategory() {
        Map<String, Integer> categoryQuantities = statisticService.getItemQuantityByCategory();
        return ResponseEntity.ok(categoryQuantities);
    }

    // Lấy thống kê từng tháng trong năm hiện tại
    @GetMapping("/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyStatisticsForYear() {
        List<Map<String, Object>> monthlyStats = statisticService.getMonthlyStatisticsForCurrentYear();
        return ResponseEntity.ok(monthlyStats);
    }

    // Lấy thống kê từng ngày trong một tháng cụ thể
    @GetMapping("/daily")
    public ResponseEntity<List<Map<String, Object>>> getDailyStatisticsForMonth(@RequestParam("year") int year, @RequestParam("month") int month) {
        List<Map<String, Object>> dailyStats = statisticService.getDailyStatisticsForMonth(year, month);
        return ResponseEntity.ok(dailyStats);
    }

    // Lấy thống kê cho một ngày cụ thể
    @GetMapping("/by-day")
    public ResponseEntity<Map<String, Object>> getStatisticsByDay(@RequestParam("year") int year, @RequestParam("month") int month, @RequestParam("day") int day) {
        Map<String, Object> stats = statisticService.getStatisticsByDay(year, month, day);
        return ResponseEntity.ok(stats);
    }
    
    // Lấy doanh thu theo khoảng ngày, có thể xem theo ngày/tháng/năm
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "viewType", defaultValue = "day") String viewType) {
        Map<String, Object> revenue = statisticService.getRevenueByDateRange(startDate, endDate, viewType);
        return ResponseEntity.ok(revenue);
    }
    
    // Lấy doanh thu từng ngày trong một tháng cụ thể
    @GetMapping("/daily-revenue")
    public ResponseEntity<List<Map<String, Object>>> getDailyRevenue(
            @RequestParam("year") int year,
            @RequestParam("month") int month) {
        List<Map<String, Object>> dailyRevenue = statisticService.getDailyRevenue(year, month);
        return ResponseEntity.ok(dailyRevenue);
    }
    
    // Lấy doanh thu từng tháng trong một năm cụ thể
    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue(@RequestParam("year") int year) {
        List<Map<String, Object>> monthlyRevenue = statisticService.getMonthlyRevenue(year);
        return ResponseEntity.ok(monthlyRevenue);
    }

    // Lấy thống kê tổng hợp theo khoảng ngày
    @GetMapping("/date-range")
    public ResponseEntity<Map<String, Object>> getStatisticsByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        Map<String, Object> statistics = statisticService.getStatisticsByDateRange(startDate, endDate);
        return ResponseEntity.ok(statistics);
    }

    // Lấy thống kê từng ngày trong tuần hiện tại
    @GetMapping("/daily-week")
    public ResponseEntity<List<Map<String, Object>>> getDailyStatisticsForWeek() {
        List<Map<String, Object>> weeklyStats = statisticService.getDailyStatisticsForCurrentWeek();
        return ResponseEntity.ok(weeklyStats);
    }

    // Lấy thống kê từng ngày theo khoảng ngày
    @GetMapping("/daily-date-range")
    public ResponseEntity<List<Map<String, Object>>> getDailyStatisticsByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        List<Map<String, Object>> dailyStats = statisticService.getDailyStatisticsByDateRange(startDate, endDate);
        return ResponseEntity.ok(dailyStats);
    }

}
