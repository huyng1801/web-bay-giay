package vn.student.polyshoes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * DTO cho response lấy danh sách tỉnh/thành phố từ GHN API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GHNProvinceDto {
    
    @JsonProperty("code")
    private Integer code;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("data")
    private List<ProvinceData> data;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProvinceData {
        @JsonProperty("ProvinceID")
        private Integer provinceId;
        
        @JsonProperty("ProvinceName")
        private String provinceName;
        
        @JsonProperty("CountryID")
        private Integer countryId;
        
        @JsonProperty("Code")
        private String code;
    }
}