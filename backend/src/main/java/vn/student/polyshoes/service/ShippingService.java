package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.dto.ShippingDto;
import vn.student.polyshoes.model.Shipping;
import vn.student.polyshoes.repository.ShippingRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShippingService {

    @Autowired
    private ShippingRepository shippingRepository;

    public List<ShippingDto> getAllShippings() {
        return shippingRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ShippingDto> getActiveShippings() {
        return shippingRepository.findByIsActiveTrue().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ShippingDto> getShippingsByType(String shippingType) {
        try {
            vn.student.polyshoes.enums.ShippingType type = vn.student.polyshoes.enums.ShippingType.valueOf(shippingType);
            return shippingRepository.findByShippingTypeAndIsActiveTrue(type).stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Loại vận chuyển không hợp lệ: " + shippingType);
        }
    }



    public Optional<ShippingDto> getShippingById(Integer shippingId) {
        return shippingRepository.findById(shippingId).map(this::convertToDto);
    }

    public Optional<ShippingDto> getShippingByCode(String shippingCode) {
        return shippingRepository.findByShippingCode(shippingCode).map(this::convertToDto);
    }

    public ShippingDto createShipping(ShippingDto shippingDto) {
        if (shippingRepository.findByShippingCode(shippingDto.getShippingCode()).isPresent()) {
            throw new RuntimeException("Mã vận chuyển đã tồn tại");
        }
        Shipping shipping = convertToEntity(shippingDto);
        return convertToDto(shippingRepository.save(shipping));
    }

    public ShippingDto updateShipping(Integer shippingId, ShippingDto shippingDto) {
        Shipping shipping = shippingRepository.findById(shippingId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức vận chuyển"));
        if (!shipping.getShippingCode().equals(shippingDto.getShippingCode())) {
            Optional<Shipping> duplicateCode = shippingRepository.findByShippingCode(shippingDto.getShippingCode());
            if (duplicateCode.isPresent() && !duplicateCode.get().getShippingId().equals(shippingId)) {
                throw new RuntimeException("Mã vận chuyển đã tồn tại");
            }
        }
        shipping.setShippingCode(shippingDto.getShippingCode());
        shipping.setShippingName(shippingDto.getShippingName());
        shipping.setShippingFee(shippingDto.getShippingFee());
        shipping.setDeliveryTime(shippingDto.getDeliveryTime());
        shipping.setShippingType(shippingDto.getShippingType());
        // Chỉ update isActive nếu có giá trị từ DTO, ngược lại giữ nguyên
        if (shippingDto.getIsActive() != null) {
            shipping.setIsActive(shippingDto.getIsActive());
        }
        return convertToDto(shippingRepository.save(shipping));
    }

    public void deleteShipping(Integer shippingId) {
        if (!shippingRepository.existsById(shippingId)) {
            throw new RuntimeException("Không tìm thấy phương thức vận chuyển");
        }
        shippingRepository.deleteById(shippingId);
    }

    public ShippingDto toggleShippingStatus(Integer shippingId) {
        Shipping shipping = shippingRepository.findById(shippingId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức vận chuyển"));
        shipping.setIsActive(!shipping.getIsActive());
        return convertToDto(shippingRepository.save(shipping));
    }

    public List<ShippingDto> searchShippingsByName(String name) {
        return shippingRepository.findByShippingNameContainingAndIsActiveTrue(name).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ShippingDto convertToDto(Shipping shipping) {
        ShippingDto dto = new ShippingDto();
        dto.setShippingId(shipping.getShippingId());
        dto.setShippingCode(shipping.getShippingCode());
        dto.setShippingName(shipping.getShippingName());
        dto.setShippingFee(shipping.getShippingFee());
        dto.setDeliveryTime(shipping.getDeliveryTime());
        dto.setShippingType(shipping.getShippingType());
        dto.setIsActive(shipping.getIsActive());
        return dto;
    }

    private Shipping convertToEntity(ShippingDto dto) {
        Shipping shipping = new Shipping();
        shipping.setShippingCode(dto.getShippingCode());
        shipping.setShippingName(dto.getShippingName());
        shipping.setShippingFee(dto.getShippingFee());
        shipping.setDeliveryTime(dto.getDeliveryTime());
        shipping.setShippingType(dto.getShippingType());
        shipping.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return shipping;
    }
}
