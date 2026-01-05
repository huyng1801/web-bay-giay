package vn.student.polyshoes.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.student.polyshoes.dto.GHNDistrictDto;
import vn.student.polyshoes.dto.GHNLeadTimeDto;
import vn.student.polyshoes.dto.GHNProvinceDto;
import vn.student.polyshoes.dto.GHNServiceDto;
import vn.student.polyshoes.dto.GHNWardDto;
import vn.student.polyshoes.response.GHNLeadTimeResponse;
import vn.student.polyshoes.service.OrderShippingService;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * Controller tính cước phí vận chuyển từ GHN API cho đơn hàng
 */
@RestController
@RequestMapping("/home/shippings")
@RequiredArgsConstructor
@Slf4j
public class OrderShippingController {
    
    private final OrderShippingService orderShippingService;
    
    /**
     * Lấy danh sách tỉnh/thành phố
     */
    @GetMapping("/provinces")
    public ResponseEntity<GHNProvinceDto> getProvinces() {
        try {
            GHNProvinceDto provinces = orderShippingService.getProvinces();
            return ResponseEntity.ok(provinces);
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách tỉnh/thành: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Lấy danh sách quận/huyện theo tỉnh/thành
     */
    @GetMapping("/districts")
    public ResponseEntity<GHNDistrictDto> getDistricts(@RequestParam Integer provinceId) {
        try {
            GHNDistrictDto districts = orderShippingService.getDistricts(provinceId);
            return ResponseEntity.ok(districts);
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách quận/huyện: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Lấy danh sách phường/xã theo quận/huyện
     */
    @GetMapping("/wards")
    public ResponseEntity<GHNWardDto> getWards(@RequestParam Integer districtId) {
        try {
            GHNWardDto wards = orderShippingService.getWards(districtId);
            return ResponseEntity.ok(wards);
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách phường/xã: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Lấy danh sách dịch vụ vận chuyển khả dụng
     */
    @GetMapping("/services")
    public ResponseEntity<GHNServiceDto> getAvailableServices(@RequestParam Integer toDistrictId) {
        try {
            GHNServiceDto services = orderShippingService.getAvailableServices(toDistrictId);
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            log.error("Lỗi khi lấy danh sách dịch vụ vận chuyển: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * Tính cước phí vận chuyển tự động (không cần chọn service)
     */
    @PostMapping("/calculate-fee")
    public ResponseEntity<Map<String, Object>> calculateShippingFee(
            @RequestParam Integer toDistrictId,
            @RequestParam String toWardCode,
            @RequestParam Long orderValue,
            @RequestParam(required = false) Integer weight,
            @RequestParam(required = false) Integer length,
            @RequestParam(required = false) Integer width,
            @RequestParam(required = false) Integer height) {
        try {
            // Tự động chọn dịch vụ vận chuyển phù hợp
            Map<String, Object> result = orderShippingService.calculateOptimalShippingFee(
                toDistrictId, toWardCode, orderValue,
                weight, length, width, height
            );
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Lỗi khi tính cước phí vận chuyển: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                "success", false,
                "shippingFee", 30000,
                "serviceName", "Giao hàng tiêu chuẩn",
                "estimatedTime", "3-5 ngày",
                "message", "Lỗi khi tính cước, sử dụng phí mặc định"
            ));
        }
    }
    
    /**
     * Tính thời gian giao hàng dự kiến
     */
    @PostMapping("/calculate-leadtime")
    public ResponseEntity<Map<String, Object>> calculateLeadTime(
            @RequestParam Integer serviceId,
            @RequestParam Integer toDistrictId,
            @RequestParam String toWardCode) {
        try {
            GHNLeadTimeDto request = new GHNLeadTimeDto();
            request.setServiceId(serviceId);
            request.setToDistrictId(toDistrictId);
            request.setToWardCode(toWardCode);
            
            GHNLeadTimeResponse response = orderShippingService.calculateLeadTime(request);
            
            if (response != null && response.getData() != null) {
                // Convert timestamp to readable format
                Long leadtime = response.getData().getLeadtime();
                String estimatedDelivery = "Liên hệ để biết thời gian giao hàng";
                
                if (leadtime != null && leadtime > 0) {
                    try {
                        LocalDateTime deliveryDateTime = LocalDateTime.ofInstant(
                            Instant.ofEpochSecond(leadtime), ZoneId.of("Asia/Ho_Chi_Minh")
                        );
                        estimatedDelivery = deliveryDateTime.format(
                            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                        );
                    } catch (Exception e) {
                        log.warn("Error parsing leadtime {}: {}", leadtime, e.getMessage());
                        // Calculate estimated delivery (2-3 days from now)
                        LocalDateTime futureDate = LocalDateTime.now().plusDays(2);
                        estimatedDelivery = futureDate.format(
                            DateTimeFormatter.ofPattern("dd/MM/yyyy")
                        ) + " - " + futureDate.plusDays(1).format(
                            DateTimeFormatter.ofPattern("dd/MM/yyyy")
                        );
                    }
                } else {
                    // Fallback: estimate 2-3 days delivery
                    LocalDateTime futureDate = LocalDateTime.now().plusDays(2);
                    estimatedDelivery = futureDate.format(
                        DateTimeFormatter.ofPattern("dd/MM/yyyy")
                    ) + " - " + futureDate.plusDays(1).format(
                        DateTimeFormatter.ofPattern("dd/MM/yyyy")
                    );
                }
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "leadtime", leadtime != null ? leadtime : 0,
                    "estimatedDelivery", estimatedDelivery,
                    "message", "Tính thời gian giao hàng thành công"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", false,
                "leadtime", 0,
                "estimatedDelivery", "Liên hệ để biết thời gian giao hàng",
                "message", "Không thể tính thời gian giao hàng"
            ));
        } catch (Exception e) {
            log.error("Lỗi khi tính thời gian giao hàng: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                "success", false,
                "leadtime", 0,
                "estimatedDelivery", "Liên hệ để biết thời gian giao hàng",
                "message", "Lỗi khi tính thời gian giao hàng"
            ));
        }
    }
}