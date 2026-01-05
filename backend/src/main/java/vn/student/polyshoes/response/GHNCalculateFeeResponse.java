package vn.student.polyshoes.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO cho response tính cước phí vận chuyển từ GHN API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GHNCalculateFeeResponse {
    
    @JsonProperty("code")
    private Integer code;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private FeeData data;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeeData {
        @JsonProperty("total")
        private Integer total;
        
        @JsonProperty("service_fee")
        private Integer serviceFee;
        
        @JsonProperty("insurance_fee")
        private Integer insuranceFee;
        
        @JsonProperty("pick_station_fee")
        private Integer pickStationFee;
        
        @JsonProperty("coupon_value")
        private Integer couponValue;
        
        @JsonProperty("r2s_fee")
        private Integer r2sFee;
        
        @JsonProperty("return_again")
        private Integer returnAgain;
        
        @JsonProperty("document_return")
        private Integer documentReturn;
        
        @JsonProperty("double_check")
        private Integer doubleCheck;
        
        @JsonProperty("cod_fee")
        private Integer codFee;
        
        @JsonProperty("pick_remote_areas_fee")
        private Integer pickRemoteAreasFee;
        
        @JsonProperty("deliver_remote_areas_fee")
        private Integer deliverRemoteAreasFee;
        
        @JsonProperty("cod_failed_fee")
        private Integer codFailedFee;
    }
}