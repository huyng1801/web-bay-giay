package vn.student.polyshoes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * DTO cho response lấy danh sách dịch vụ vận chuyển từ GHN API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GHNServiceDto {
    
    @JsonProperty("code")
    private Integer code;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private List<ServiceData> data;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceData {
        @JsonProperty("service_id")
        private Integer serviceId;
        
        @JsonProperty("short_name")
        private String shortName;
        
        @JsonProperty("service_type_id")
        private Integer serviceTypeId;
        
        @JsonProperty("config_fee_id")
        private String configFeeId;
        
        @JsonProperty("extra_cost_id")
        private String extraCostId;
        
        @JsonProperty("standard_config_fee_id")
        private String standardConfigFeeId;
        
        @JsonProperty("standard_extra_cost_id")
        private String standardExtraCostId;
    }
}