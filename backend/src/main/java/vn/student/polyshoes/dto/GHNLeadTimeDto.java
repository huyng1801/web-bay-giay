package vn.student.polyshoes.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO cho request tính thời gian giao hàng dự kiến từ GHN API
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GHNLeadTimeDto {
    
    @JsonProperty("from_district_id")
    private Integer fromDistrictId;
    
    @JsonProperty("from_ward_code")
    private String fromWardCode;
    
    @JsonProperty("to_district_id")
    private Integer toDistrictId;
    
    @JsonProperty("to_ward_code")
    private String toWardCode;
    
    @JsonProperty("service_id")
    private Integer serviceId;
}