package vn.student.polyshoes.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * Response cho API tính thời gian giao hàng dự kiến từ GHN
 */
@Data
public class GHNLeadTimeResponse {
    
    private Integer code;
    private String message;
    private GHNLeadTimeData data;
    
    @Data
    public static class GHNLeadTimeData {
        
        @JsonProperty("leadtime")
        private Long leadtime; // Timestamp dự kiến giao hàng
        
        @JsonProperty("order_date") 
        private Long orderDate; // Timestamp tạo đơn hàng
    }
}