package vn.student.polyshoes.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import vn.student.polyshoes.dto.GHNCalculateFeeDto;
import vn.student.polyshoes.dto.GHNDistrictDto;
import vn.student.polyshoes.dto.GHNLeadTimeDto;
import vn.student.polyshoes.dto.GHNProvinceDto;
import vn.student.polyshoes.dto.GHNServiceDto;
import vn.student.polyshoes.dto.GHNWardDto;
import vn.student.polyshoes.response.GHNCalculateFeeResponse;
import vn.student.polyshoes.response.GHNLeadTimeResponse;

/**
 * Service tích hợp với GHN (Giao Hàng Nhanh) API để tính cước phí vận chuyển
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GHNService {
    
    private final RestTemplate restTemplate;
    
    @Value("${ghn.api.base-url:https://online-gateway.ghn.vn/shiip/public-api}")
    private String baseUrl;
    
    @Value("${ghn.api.token}")
    private String token;
    
    @Value("${ghn.api.shop-id}")
    private Integer shopId;
    
    @Value("${ghn.api.from-district-id:1542}") // Mặc định là Hà Đông, Hà Nội
    private Integer fromDistrictId;
    
    @Value("${ghn.api.default-weight:1000}") // Mặc định 1000g (1kg) - GHN yêu cầu tối thiểu
    private Integer defaultWeight;
    
    /**
     * Lấy danh sách tỉnh/thành phố
     */
    public GHNProvinceDto getProvinces() {
        String url = baseUrl + "/master-data/province";
        
        HttpHeaders headers = createHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<GHNProvinceDto> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, GHNProvinceDto.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Lỗi khi gọi API lấy danh sách tỉnh/thành: {}", e.getMessage());
            throw new RuntimeException("Không thể lấy danh sách tỉnh/thành từ GHN", e);
        }
    }
    
    /**
     * Lấy danh sách quận/huyện theo tỉnh/thành
     */
    public GHNDistrictDto getDistricts(Integer provinceId) {
        String url = baseUrl + "/master-data/district";
        
        HttpHeaders headers = createHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = String.format("{\"province_id\": %d}", provinceId);
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<GHNDistrictDto> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, GHNDistrictDto.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Lỗi khi gọi API lấy danh sách quận/huyện: {}", e.getMessage());
            throw new RuntimeException("Không thể lấy danh sách quận/huyện từ GHN", e);
        }
    }
    
    /**
     * Lấy danh sách phường/xã theo quận/huyện
     */
    public GHNWardDto getWards(Integer districtId) {
        String url = baseUrl + "/master-data/ward";
        
        HttpHeaders headers = createHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = String.format("{\"district_id\": %d}", districtId);
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<GHNWardDto> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, GHNWardDto.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Lỗi khi gọi API lấy danh sách phường/xã: {}", e.getMessage());
            throw new RuntimeException("Không thể lấy danh sách phường/xã từ GHN", e);
        }
    }
    
    /**
     * Lấy danh sách dịch vụ vận chuyển khả dụng
     */
    public GHNServiceDto getAvailableServices(Integer toDistrictId) {
        String url = baseUrl + "/v2/shipping-order/available-services";
        
        HttpHeaders headers = createHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = String.format(
            "{\"shop_id\": %d, \"from_district\": %d, \"to_district\": %d}",
            shopId, fromDistrictId, toDistrictId
        );
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<GHNServiceDto> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, GHNServiceDto.class
            );
            
            GHNServiceDto body = response.getBody();
            
            // Log available services
            if (body != null && body.getData() != null && !body.getData().isEmpty()) {
                StringBuilder servicesInfo = new StringBuilder();
                for (GHNServiceDto.ServiceData service : body.getData()) {
                    servicesInfo.append(String.format("Service[id=%d, name=%s], ", 
                            service.getServiceId(), service.getShortName()));
                }
                log.info("Available GHN Services for toDistrict {}: {}", toDistrictId, servicesInfo.toString());
            } else {
                log.warn("No available GHN services for toDistrict {}", toDistrictId);
            }
            
            return body;
        } catch (Exception e) {
            log.error("Lỗi khi gọi API lấy dịch vụ vận chuyển: {}", e.getMessage());
            throw new RuntimeException("Không thể lấy danh sách dịch vụ vận chuyển từ GHN", e);
        }
    }
    
    /**
     * Tính cước phí vận chuyển
     */
    public GHNCalculateFeeResponse calculateShippingFee(GHNCalculateFeeDto request) {
        String url = baseUrl + "/v2/shipping-order/fee";
        
        HttpHeaders headers = createHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("ShopId", shopId.toString());
        
        // Validate required fields
        if (request.getServiceId() == null) {
            throw new RuntimeException("ServiceId is required for GHN API");
        }
        if (request.getToDistrictId() == null) {
            throw new RuntimeException("ToDistrictId is required for GHN API");
        }
        if (request.getToWardCode() == null || request.getToWardCode().isEmpty()) {
            throw new RuntimeException("ToWardCode is required for GHN API");
        }
        
        // Set default values if not provided
        if (request.getFromDistrictId() == null) {
            request.setFromDistrictId(fromDistrictId);
        }
        
        // Set COD values - these might be required by GHN API
        if (request.getCodValue() == null) {
            request.setCodValue(0);
        }
        if (request.getCodFailedAmount() == null) {
            request.setCodFailedAmount(0);
        }
        
        // Set default insurance value if not provided
        if (request.getInsuranceValue() == null) {
            request.setInsuranceValue(0L);
        }
        
        // Set default dimensions if not provided (before weight validation)
        if (request.getLength() == null || request.getLength() <= 0) {
            request.setLength(20);
        }
        if (request.getWidth() == null || request.getWidth() <= 0) {
            request.setWidth(15);
        }
        if (request.getHeight() == null || request.getHeight() <= 0) {
            request.setHeight(10);
        }
        
        // Validate weight - GHN has specific requirements per service
        Integer weight = request.getWeight();
        if (weight == null || weight <= 0) {
            weight = defaultWeight;
        }
        
        // Smart service handling - prioritize reliable service 53321
        if (request.getServiceId() == 53321) {
            // Service 53321 (Express) works well with lighter weights
            if (weight < 500) {
                weight = 500; // Minimum for shoes
            } else if (weight < 1000) {
                weight = 1000; // Standard minimum
            }
        } else if (request.getServiceId() == 100039) {
            // Service 100039 (Standard) is problematic, try to use 53321 instead
            log.warn("Service 100039 is problematic, consider using service 53321 for better reliability");
            if (weight < 5000) {
                weight = 5000; // Much higher minimum for this service
            }
        }
        
        request.setWeight(weight);
        
        // Log final request parameters with detailed validation info
        log.info("GHN API request - ServiceId: {}, Weight: {}g (original: {}g), Dimensions: {}x{}x{}cm, ToDistrict: {}, ToWard: {}, FromDistrict: {}, InsuranceValue: {}", 
                request.getServiceId(), request.getWeight(), 
                request.getWeight() != null ? request.getWeight() : "null",
                request.getLength(), request.getWidth(), request.getHeight(),
                request.getToDistrictId(), request.getToWardCode(),
                request.getFromDistrictId(), request.getInsuranceValue());
        
        // Validate other critical parameters
        log.debug("Validating GHN request: ShopId={}, FromDistrict={}, CodValue={}, CodFailedAmount={}, InsuranceValue={}", 
                shopId, request.getFromDistrictId(), 
                request.getCodValue(), request.getCodFailedAmount(), 
                request.getInsuranceValue());
        
        // Log curl command for debugging
        logCurlCommand(url, headers, request);
        
        HttpEntity<GHNCalculateFeeDto> entity = new HttpEntity<>(request, headers);
        
        try {
            ResponseEntity<GHNCalculateFeeResponse> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, GHNCalculateFeeResponse.class
            );
            
            GHNCalculateFeeResponse responseBody = response.getBody();
            if (responseBody != null) {
                log.info("GHN API response - Code: {}, Message: {}, Total Fee: {}", 
                        responseBody.getCode(), responseBody.getMessage(),
                        responseBody.getData() != null ? responseBody.getData().getTotal() : "N/A");
            }
            
            return responseBody;
        } catch (Exception e) {
            // Log detailed error information for debugging
            log.error("GHN API call failed for ServiceId: {}, Weight: {}, ToDistrict: {}, ToWard: {}", 
                    request.getServiceId(), request.getWeight(), 
                    request.getToDistrictId(), request.getToWardCode());
            log.error("Error message: {}", e.getMessage());
            
            // Check if error is weight-related and try with higher weight
            if (e.getMessage() != null && e.getMessage().contains("Cân nặng")) {
                Integer currentWeight = request.getWeight();
                Integer retryWeight = null;
                
                // Different retry strategies based on service
                if (request.getServiceId() == 100039) {
                    // For service 100039, try progressively higher weights
                    if (currentWeight < 5000) {
                        retryWeight = 5000;
                    } else if (currentWeight < 10000) {
                        retryWeight = 10000;
                    } else if (currentWeight < 20000) {
                        retryWeight = 20000;
                    }
                } else {
                    // For other services, try doubling the weight
                    if (currentWeight < 5000) {
                        retryWeight = Math.max(currentWeight * 2, 2000);
                    }
                }
                
                if (retryWeight != null) {
                    log.error("Weight validation failed for ServiceId: {}. Trying increased weight: {}g (was: {}g)", 
                            request.getServiceId(), retryWeight, currentWeight);
                    request.setWeight(retryWeight);
                    logCurlCommand(url, headers, request);
                    try {
                        HttpEntity<GHNCalculateFeeDto> retryEntity = new HttpEntity<>(request, headers);
                        ResponseEntity<GHNCalculateFeeResponse> retryResponse = restTemplate.exchange(
                            url, HttpMethod.POST, retryEntity, GHNCalculateFeeResponse.class
                        );
                        GHNCalculateFeeResponse retryBody = retryResponse.getBody();
                        if (retryBody != null && retryBody.getCode() == 200) {
                            log.info("Retry successful with weight {}g - Code: {}, Message: {}, Total Fee: {}", 
                                    retryWeight, retryBody.getCode(), retryBody.getMessage(),
                                    retryBody.getData() != null ? retryBody.getData().getTotal() : "N/A");
                            return retryBody;
                        }
                    } catch (Exception retryError) {
                        log.error("Retry with weight {}g also failed: {}", retryWeight, retryError.getMessage());
                    }
                }
            }
            
            log.error("Lỗi khi gọi API tính cước phí vận chuyển: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể tính cước phí vận chuyển từ GHN", e);
        }
    }
    
    /**
     * Log curl command for debugging - helps test API directly
     */
    private void logCurlCommand(String url, HttpHeaders headers, Object requestBody) {
        try {
            // Build proper JSON payload
            String jsonPayload = buildJsonPayload(requestBody);
            
            // Build curl command
            String curlCommand = String.format(
                "curl --location --request POST '%s' " +
                "--header 'Token: %s' " +
                "--header 'Content-Type: application/json' " +
                "--header 'ShopId: %s' " +
                "--data-raw '%s'",
                url,
                token,
                shopId,
                jsonPayload
            );
            
            log.debug("GHN API CURL Command:\n{}", curlCommand);
            
        } catch (Exception e) {
            log.debug("Error logging curl command: {}", e.getMessage());
        }
    }
    
    /**
     * Build JSON payload from request object
     */
    private String buildJsonPayload(Object requestBody) {
        if (requestBody instanceof GHNCalculateFeeDto) {
            GHNCalculateFeeDto dto = (GHNCalculateFeeDto) requestBody;
            StringBuilder json = new StringBuilder("{");
            
            if (dto.getServiceId() != null) {
                json.append("\"service_id\":").append(dto.getServiceId()).append(",");
            }
            if (dto.getToDistrictId() != null) {
                json.append("\"to_district_id\":").append(dto.getToDistrictId()).append(",");
            }
            if (dto.getToWardCode() != null) {
                json.append("\"to_ward_code\":\"").append(dto.getToWardCode()).append("\",");
            }
            if (dto.getFromDistrictId() != null) {
                json.append("\"from_district_id\":").append(dto.getFromDistrictId()).append(",");
            }
            if (dto.getFromWardCode() != null) {
                json.append("\"from_ward_code\":\"").append(dto.getFromWardCode()).append("\",");
            }
            if (dto.getWeight() != null) {
                json.append("\"weight\":").append(dto.getWeight()).append(",");
            }
            if (dto.getLength() != null) {
                json.append("\"length\":").append(dto.getLength()).append(",");
            }
            if (dto.getWidth() != null) {
                json.append("\"width\":").append(dto.getWidth()).append(",");
            }
            if (dto.getHeight() != null) {
                json.append("\"height\":").append(dto.getHeight()).append(",");
            }
            if (dto.getInsuranceValue() != null) {
                json.append("\"insurance_value\":").append(dto.getInsuranceValue()).append(",");
            }
            if (dto.getCodValue() != null) {
                json.append("\"cod_value\":").append(dto.getCodValue()).append(",");
            }
            if (dto.getCodFailedAmount() != null) {
                json.append("\"cod_failed_amount\":").append(dto.getCodFailedAmount()).append(",");
            }
            if (dto.getCoupon() != null && !dto.getCoupon().isEmpty()) {
                json.append("\"coupon\":\"").append(dto.getCoupon()).append("\",");
            }
            
            // Remove last comma if exists
            if (json.toString().endsWith(",")) {
                json.deleteCharAt(json.length() - 1);
            }
            json.append("}");
            
            return json.toString();
        }
        return "{}";
    }
    
    /**
     * Tính thời gian giao hàng dự kiến
     */
    public GHNLeadTimeResponse calculateLeadTime(GHNLeadTimeDto request) {
        String url = baseUrl + "/v2/shipping-order/leadtime";
        
        HttpHeaders headers = createHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("ShopId", shopId.toString());
        
        // Set default from_district_id if not provided
        if (request.getFromDistrictId() == null) {
            request.setFromDistrictId(fromDistrictId);
        }
        
        HttpEntity<GHNLeadTimeDto> entity = new HttpEntity<>(request, headers);
        
        try {
            ResponseEntity<GHNLeadTimeResponse> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, GHNLeadTimeResponse.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Lỗi khi gọi API tính thời gian giao hàng: {}", e.getMessage());
            throw new RuntimeException("Không thể tính thời gian giao hàng từ GHN", e);
        }
    }
    
    /**
     * Tạo headers cho request tới GHN API
     */
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Token", token);
        return headers;
    }
}