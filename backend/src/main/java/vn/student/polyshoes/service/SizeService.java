package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.dto.SizeDto;
import vn.student.polyshoes.model.Size;
import vn.student.polyshoes.repository.SizeRepository;
import vn.student.polyshoes.response.SizeResponse;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SizeService {
    
    @Autowired
    private SizeRepository sizeRepository;
    
    // Lấy tất cả size
    public List<SizeResponse> getAllSizes() {
        return sizeRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    // Lấy tất cả size đang hoạt động
    public List<SizeResponse> getActiveSizes() {
        return sizeRepository.findByIsActiveTrueOrderBySizeValue().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    // Phân trang với tìm kiếm
    public Page<SizeResponse> getSizesWithFilters(String sizeValue, Boolean isActive, Pageable pageable) {
        Page<Size> sizePage = sizeRepository.findWithFilters(sizeValue, isActive, pageable);
        return sizePage.map(this::convertToResponseDTO);
    }
    
    // Lấy size theo ID
    public Optional<SizeResponse> getSizeById(Integer id) {
        return sizeRepository.findById(id)
                .map(this::convertToResponseDTO);
    }
    
    // Tạo size mới
    public SizeResponse createSize(SizeDto requestDTO) {
        // Kiểm tra size đã tồn tại
        if (sizeRepository.existsBySizeValue(requestDTO.getSizeValue())) {
            throw new RuntimeException("Size đã tồn tại");
        }
        
        // Validate size value là số
        try {
            Double.parseDouble(requestDTO.getSizeValue());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Giá trị size phải là số");
        }
        
        Size size = new Size();
        size.setSizeValue(requestDTO.getSizeValue());
        size.setIsActive(requestDTO.getIsActive());
        size.setCreatedAt(new Date());
        size.setUpdatedAt(new Date());
        
        Size savedSize = sizeRepository.save(size);
        return convertToResponseDTO(savedSize);
    }
    
    // Cập nhật size
    public SizeResponse updateSize(Integer id, SizeDto requestDTO) {
        Size size = sizeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy size"));
        
        // Kiểm tra size đã tồn tại (trừ size hiện tại)
        if (sizeRepository.existsBySizeValueAndSizeIdNot(requestDTO.getSizeValue(), id)) {
            throw new RuntimeException("Size đã tồn tại");
        }
        
        // Validate size value là số
        try {
            Double.parseDouble(requestDTO.getSizeValue());
        } catch (NumberFormatException e) {
            throw new RuntimeException("Giá trị size phải là số");
        }
        
        size.setSizeValue(requestDTO.getSizeValue());
        size.setIsActive(requestDTO.getIsActive());
        size.setUpdatedAt(new Date());
        
        Size updatedSize = sizeRepository.save(size);
        return convertToResponseDTO(updatedSize);
    }
    
    // Xóa size
    public void deleteSize(Integer id) {
        Size size = sizeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy size"));
        sizeRepository.delete(size);
    }
    
    // Chuyển đổi Entity sang ResponseDTO
    private SizeResponse convertToResponseDTO(Size size) {
        return new SizeResponse(
                size.getSizeId(),
                size.getSizeValue(),
                size.getIsActive(),
                size.getCreatedAt(),
                size.getUpdatedAt()
        );
    }
}