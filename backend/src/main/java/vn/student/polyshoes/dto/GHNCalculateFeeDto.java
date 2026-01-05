package vn.student.polyshoes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO cho request tính cước phí vận chuyển từ GHN API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GHNCalculateFeeDto {
    
    @JsonProperty("service_id")
    private Integer serviceId;
    
    @JsonProperty("service_type_id")
    private Integer serviceTypeId;
    
    @JsonProperty("insurance_value")
    private Long insuranceValue;
    
    @JsonProperty("coupon")
    private String coupon;
    
    @JsonProperty("from_district_id")
    private Integer fromDistrictId;
    
    @JsonProperty("to_district_id")
    private Integer toDistrictId;
    
    @JsonProperty("to_ward_code")
    private String toWardCode;
    
    @JsonProperty("weight")
    private Integer weight;
    
    @JsonProperty("length")
    private Integer length;
    
    @JsonProperty("width")
    private Integer width;
    
    @JsonProperty("height")
    private Integer height;
    
    @JsonProperty("cod_failed_amount")
    private Integer codFailedAmount;
    
    @JsonProperty("cod_value")
    private Integer codValue;
    
    @JsonProperty("from_ward_code")
    private String fromWardCode;
}