package vn.student.polyshoes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * DTO cho response lấy danh sách phường/xã từ GHN API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GHNWardDto {
    
    @JsonProperty("code")
    private Integer code;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private List<WardData> data;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WardData {
        @JsonProperty("WardCode")
        private String wardCode;
        
        @JsonProperty("DistrictID")
        private Integer districtId;
        
        @JsonProperty("WardName")
        private String wardName;
        
        @JsonProperty("CanUpdateCOD")
        private Boolean canUpdateCod;
        
        @JsonProperty("SupportType")
        private Integer supportType;
        
        @JsonProperty("PickType")
        private Integer pickType;
        
        @JsonProperty("DeliveryType")
        private Integer deliveryType;
    }
}