import BaseService from './BaseService';

const API_URL = '/statistics';

const StatisticService = {
  async getStatisticsToday() {
    try {
      const response = await BaseService.get(`${API_URL}/today`);
      return response;
    } catch (error) {
      console.error('Error fetching statistics for today:', error);
      throw error;
    }
  },

  async getStatisticsThisMonth() {
    try {
      const response = await BaseService.get(`${API_URL}/this-month`);
      return response;
    } catch (error) {
      console.error('Error fetching statistics for this month:', error);
      throw error;
    }
  },

  async getStatisticsThisYear() {
    try {
      const response = await BaseService.get(`${API_URL}/this-year`);
      return response;
    } catch (error) {
      console.error('Error fetching statistics for this year:', error);
      throw error;
    }
  },

  async getItemQuantityByCategory() {
    try {
      const response = await BaseService.get(`${API_URL}/item-quantity-by-category`);
      return response;
    } catch (error) {
      console.error('Error fetching item quantity by category:', error);
      throw error;
    }
  },

  async getMonthlyStatisticsForYear() {
    try {
      const response = await BaseService.get(`${API_URL}/monthly`);
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error fetching monthly statistics for the year:', error);
      throw error;
    }
  },

  async getDailyStatisticsForMonth(year, month) {
    try {
      const response = await BaseService.get(`${API_URL}/daily`, {
        params: { year, month }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching daily statistics for ${month}/${year}:`, error);
      throw error;
    }
  },

  async getStatisticsByDay(year, month, day) {
    try {
      const response = await BaseService.get(`${API_URL}/by-day`, {
        params: { year, month, day }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching statistics for ${day}/${month}/${year}:`, error);
      throw error;
    }
  },

  async getRevenueByDateRange(startDate, endDate, viewType = 'day') {
    try {
      const response = await BaseService.get(`${API_URL}/revenue`, {
        params: {
          startDate,
          endDate,
          viewType
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching revenue by date range:', error);
      throw error;
    }
  },

  async getDailyRevenue(year, month) {
    try {
      const response = await BaseService.get(`${API_URL}/daily-revenue`, {
        params: { year, month }
      });
      return response;
    } catch (error) {
      console.error('Error fetching daily revenue:', error);
      throw error;
    }
  },

  async getMonthlyRevenue(year) {
    try {
      const response = await BaseService.get(`${API_URL}/monthly-revenue`, {
        params: { year }
      });
      return response;
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      throw error;
    }
  },

  // New methods for dashboard statistics
  async getHourlyStatisticsForToday() {
    try {
      const response = await BaseService.get(`${API_URL}/hourly-today`);
      return response;
    } catch (error) {
      console.error('Error fetching hourly statistics for today:', error);
      // Fallback to empty array
      return [];
    }
  },

  async getDailyStatisticsForWeek() {
    try {
      const response = await BaseService.get(`${API_URL}/daily-week`);
      return response;
    } catch (error) {
      console.error('Error fetching daily statistics for week:', error);
      // Fallback to empty array
      return [];
    }
  },

  async getStatisticsForMonth(year, month) {
    try {
      const response = await BaseService.get(`${API_URL}/month`, {
        params: { year, month }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching statistics for month ${month}/${year}:`, error);
      // Fallback to today's statistics
      return this.getStatisticsToday();
    }
  },

  async getStatisticsForYear(year) {
    try {
      const response = await BaseService.get(`${API_URL}/year`, {
        params: { year }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching statistics for year ${year}:`, error);
      // Fallback to this year's statistics
      return this.getStatisticsThisYear();
    }
  },

  async getMonthlyStatisticsForSpecificYear(year) {
    try {
      const response = await BaseService.get(`${API_URL}/monthly-year`, {
        params: { year }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching monthly statistics for year ${year}:`, error);
      // Fallback to existing method
      return this.getMonthlyStatisticsForYear();
    }
  },

  async getStatisticsByDateRange(startDate, endDate) {
    try {
      const response = await BaseService.get(`${API_URL}/date-range`, {
        params: { startDate, endDate }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching statistics for date range ${startDate} to ${endDate}:`, error);
      // Fallback to today's statistics
      return this.getStatisticsToday();
    }
  },

  async getDailyStatisticsByDateRange(startDate, endDate) {
    try {
      const response = await BaseService.get(`${API_URL}/daily-date-range`, {
        params: { startDate, endDate }
      });
      return response;
    } catch (error) {
      console.error(`Error fetching daily statistics for date range ${startDate} to ${endDate}:`, error);
      // Fallback to empty array
      return [];
    }
  }
};

export default StatisticService;