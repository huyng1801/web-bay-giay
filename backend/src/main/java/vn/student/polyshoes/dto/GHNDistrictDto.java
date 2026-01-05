package vn.student.polyshoes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * DTO cho response lấy danh sách quận/huyện từ GHN API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GHNDistrictDto {
    
    @JsonProperty("code")
    private Integer code;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private List<DistrictData> data;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DistrictData {
        @JsonProperty("DistrictID")
        private Integer districtId;
        
        @JsonProperty("ProvinceID")
        private Integer provinceId;
        
        @JsonProperty("DistrictName")
        private String districtName;
        
        @JsonProperty("Code")
        private String code;
        
        @JsonProperty("Type")
        private Integer type;
        
        @JsonProperty("SupportType")
        private Integer supportType;
    }
}