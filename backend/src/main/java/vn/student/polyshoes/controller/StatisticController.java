package vn.student.polyshoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.service.StatisticService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/statistics")
public class StatisticController {


    @Autowired
    private StatisticService statisticService;

    // Get statistics for today
    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getStatisticsToday() {
        Map<String, Object> statistics = statisticService.getStatisticsToday();
        return ResponseEntity.ok(statistics);
    }

    // Get hourly statistics for today
    @GetMapping("/hourly-today")
    public ResponseEntity<List<Map<String, Object>>> getHourlyStatisticsToday() {
        List<Map<String, Object>> hourlyStats = statisticService.getHourlyStatisticsToday();
        return ResponseEntity.ok(hourlyStats);
    }

    // Get statistics for this month
    @GetMapping("/this-month")
    public ResponseEntity<Map<String, Object>> getStatisticsThisMonth() {
        Map<String, Object> statistics = statisticService.getStatisticsThisMonth();
        return ResponseEntity.ok(statistics);
    }

    // Get statistics for a specific month
    @GetMapping("/month")
    public ResponseEntity<Map<String, Object>> getStatisticsByMonth(
            @RequestParam("year") int year, 
            @RequestParam("month") int month) {
        Map<String, Object> statistics = statisticService.getStatisticsByMonth(year, month);
        return ResponseEntity.ok(statistics);
    }

    // Get statistics for the current month (duplicate method)
    @GetMapping("/current-month")
    public ResponseEntity<Map<String, Object>> getCurrentMonthStatistics() {
        Map<String, Object> statistics = statisticService.getStatisticsThisMonth();
        return ResponseEntity.ok(statistics);
    }

    // Get statistics for the current year
    @GetMapping("/this-year")
    public ResponseEntity<Map<String, Object>> getStatisticsThisYear() {
        Map<String, Object> statistics = statisticService.getStatisticsThisYear();
        return ResponseEntity.ok(statistics);
    }

    // Get item quantity by category for the current year
    @GetMapping("/item-quantity-by-category")
    public ResponseEntity<Map<String, Integer>> getItemQuantityByCategory() {
        Map<String, Integer> categoryQuantities = statisticService.getItemQuantityByCategory();
        return ResponseEntity.ok(categoryQuantities);
    }

    // Get monthly statistics for the current year
    @GetMapping("/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyStatisticsForYear() {
        List<Map<String, Object>> monthlyStats = statisticService.getMonthlyStatisticsForCurrentYear();
        return ResponseEntity.ok(monthlyStats);
    }

    // Get daily statistics for a specific month
    @GetMapping("/daily")
    public ResponseEntity<List<Map<String, Object>>> getDailyStatisticsForMonth(@RequestParam("year") int year, @RequestParam("month") int month) {
        List<Map<String, Object>> dailyStats = statisticService.getDailyStatisticsForMonth(year, month);
        return ResponseEntity.ok(dailyStats);
    }

    // Get statistics for a specific day
    @GetMapping("/by-day")
    public ResponseEntity<Map<String, Object>> getStatisticsByDay(@RequestParam("year") int year, @RequestParam("month") int month, @RequestParam("day") int day) {
        Map<String, Object> stats = statisticService.getStatisticsByDay(year, month, day);
        return ResponseEntity.ok(stats);
    }
    
    // Get revenue by date range
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "viewType", defaultValue = "day") String viewType) {
        Map<String, Object> revenue = statisticService.getRevenueByDateRange(startDate, endDate, viewType);
        return ResponseEntity.ok(revenue);
    }
    
    // Get daily revenue for a specific month
    @GetMapping("/daily-revenue")
    public ResponseEntity<List<Map<String, Object>>> getDailyRevenue(
            @RequestParam("year") int year,
            @RequestParam("month") int month) {
        List<Map<String, Object>> dailyRevenue = statisticService.getDailyRevenue(year, month);
        return ResponseEntity.ok(dailyRevenue);
    }
    
    // Get monthly revenue for a specific year
    @GetMapping("/monthly-revenue")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue(@RequestParam("year") int year) {
        List<Map<String, Object>> monthlyRevenue = statisticService.getMonthlyRevenue(year);
        return ResponseEntity.ok(monthlyRevenue);
    }

    // Get statistics for date range
    @GetMapping("/date-range")
    public ResponseEntity<Map<String, Object>> getStatisticsByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        Map<String, Object> statistics = statisticService.getStatisticsByDateRange(startDate, endDate);
        return ResponseEntity.ok(statistics);
    }

    // Get daily statistics for current week
    @GetMapping("/daily-week")
    public ResponseEntity<List<Map<String, Object>>> getDailyStatisticsForWeek() {
        List<Map<String, Object>> weeklyStats = statisticService.getDailyStatisticsForCurrentWeek();
        return ResponseEntity.ok(weeklyStats);
    }

    // Get daily statistics by date range 
    @GetMapping("/daily-date-range")
    public ResponseEntity<List<Map<String, Object>>> getDailyStatisticsByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        List<Map<String, Object>> dailyStats = statisticService.getDailyStatisticsByDateRange(startDate, endDate);
        return ResponseEntity.ok(dailyStats);
    }

}
