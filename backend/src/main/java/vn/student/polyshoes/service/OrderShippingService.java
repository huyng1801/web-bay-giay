package vn.student.polyshoes.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import vn.student.polyshoes.dto.GHNCalculateFeeDto;
import vn.student.polyshoes.dto.GHNDistrictDto;
import vn.student.polyshoes.dto.GHNLeadTimeDto;
import vn.student.polyshoes.dto.GHNProvinceDto;
import vn.student.polyshoes.dto.GHNServiceDto;
import vn.student.polyshoes.dto.GHNWardDto;
import vn.student.polyshoes.response.GHNCalculateFeeResponse;
import vn.student.polyshoes.response.GHNLeadTimeResponse;

import java.util.Map;
import java.util.HashMap;

/**
 * Service tính cước phí vận chuyển từ GHN API và cập nhật vào Order
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderShippingService {
    
    private final GHNService ghnService;
    
    /**
     * Tự động tính cước phí vận chuyển tối ưu dựa trên trọng lượng
     */
    public Map<String, Object> calculateOptimalShippingFee(
            Integer toDistrictId, 
            String toWardCode,
            Long orderValue,
            Integer weight,
            Integer length,
            Integer width,
            Integer height) {
        
        try {
            // Validate and set weight
            Integer finalWeight = weight != null && weight > 0 ? weight : 1000;
            if (finalWeight < 500) {
                finalWeight = 500; // Minimum 500g for shoes
            }
            log.info("Auto shipping calculation: weight={}g for order value={}", finalWeight, orderValue);
            
            // Always use service 53321 (Hàng nhẹ) as it's more reliable
            Integer ghnServiceId = 53321;
            String serviceName = "Giao hàng nhanh";
            String estimatedTime = "2-3 ngày";
            
            Integer fee = calculateShippingFee(
                ghnServiceId, toDistrictId, toWardCode, orderValue,
                finalWeight, length, width, height
            );
            
            return Map.of(
                "success", true,
                "shippingFee", fee,
                "serviceName", serviceName,
                "estimatedTime", estimatedTime,
                "serviceId", ghnServiceId,
                "actualWeight", finalWeight,
                "message", "Tính cước thành công"
            );
            
        } catch (Exception e) {
            log.error("Lỗi khi tính cước phí vận chuyển tự động: {}", e.getMessage());
            return Map.of(
                "success", false,
                "shippingFee", 30000,
                "serviceName", "Giao hàng tiêu chuẩn",
                "estimatedTime", "3-5 ngày",
                "serviceId", 53321,
                "actualWeight", weight != null ? weight : 1000,
                "message", "Lỗi khi tính cước, sử dụng phí mặc định"
            );
        }
    }

    /**
     * Tính cước phí vận chuyển cho đơn hàng
     */
    public Integer calculateShippingFee(
            Integer ghnServiceId,
            Integer toDistrictId, 
            String toWardCode,
            Long orderValue,
            Integer weight,
            Integer length,
            Integer width,
            Integer height) {
        
        try {
            // Validate and set weight with detailed logging
            Integer finalWeight = weight != null && weight > 0 ? weight : 1000;
            if (finalWeight < 1000) {
                finalWeight = 1000;
            }
            log.info("Weight calculation: input={}, final={}", weight, finalWeight);
            
            GHNCalculateFeeDto request = new GHNCalculateFeeDto();
            request.setServiceId(ghnServiceId);
            request.setToDistrictId(toDistrictId);
            request.setToWardCode(toWardCode);
            request.setInsuranceValue(0L); // Không bảo hiểm để giảm phí vận chuyển
            request.setWeight(finalWeight); // Ensure minimum 1kg
            request.setLength(length != null ? length : 20);   // Default 20cm
            request.setWidth(width != null ? width : 15);      // Default 15cm
            request.setHeight(height != null ? height : 10);   // Default 10cm
            request.setCoupon(null);
            request.setCodValue(0); // Default COD value
            request.setCodFailedAmount(0); // Default COD failed amount
            
            log.info("Sending GHN request - serviceId: {}, weight: {}, dimensions: {}x{}x{}, insurance: {}", 
                    ghnServiceId, finalWeight, request.getLength(), request.getWidth(), request.getHeight(), 0);
            
            GHNCalculateFeeResponse response = ghnService.calculateShippingFee(request);
            
            if (response.getCode() == 200 && response.getData() != null) {
                return response.getData().getTotal();
            } else {
                log.warn("GHN API trả về lỗi: {} - {}", response.getCode(), response.getMessage());
                return 30000; // Phí mặc định 30k
            }
            
        } catch (Exception e) {
            log.error("Lỗi khi tính cước phí vận chuyển: {}", e.getMessage());
            return 30000; // Phí mặc định 30k khi có lỗi
        }
    }
    
    /**
     * Lấy danh sách tỉnh/thành phố
     */
    public GHNProvinceDto getProvinces() {
        return ghnService.getProvinces();
    }
    
    /**
     * Lấy danh sách quận/huyện theo tỉnh/thành
     */
    public GHNDistrictDto getDistricts(Integer provinceId) {
        return ghnService.getDistricts(provinceId);
    }
    
    /**
     * Lấy danh sách phường/xã theo quận/huyện
     */
    public GHNWardDto getWards(Integer districtId) {
        return ghnService.getWards(districtId);
    }
    
    /**
     * Lấy danh sách dịch vụ vận chuyển khả dụng
     */
    public GHNServiceDto getAvailableServices(Integer toDistrictId) {
        return ghnService.getAvailableServices(toDistrictId);
    }
    
    /**
     * Tính thời gian giao hàng dự kiến
     */
    public GHNLeadTimeResponse calculateLeadTime(GHNLeadTimeDto request) {
        return ghnService.calculateLeadTime(request);
    }
}