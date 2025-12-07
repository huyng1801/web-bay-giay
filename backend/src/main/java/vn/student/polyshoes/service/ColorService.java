package vn.student.polyshoes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.dto.ColorDto;
import vn.student.polyshoes.model.Color;
import vn.student.polyshoes.repository.ColorRepository;
import vn.student.polyshoes.response.ColorResponse;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ColorService {
    
    @Autowired
    private ColorRepository colorRepository;
    
    // Lấy tất cả màu sắc
    public List<ColorResponse> getAllColors() {
        return colorRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    // Lấy tất cả màu sắc đang hoạt động
    public List<ColorResponse> getActiveColors() {
        return colorRepository.findByIsActiveTrueOrderByColorNameAsc().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    
    // Phân trang với tìm kiếm
    public Page<ColorResponse> getColorsWithFilters(String colorName, Boolean isActive, Pageable pageable) {
        Page<Color> colorPage = colorRepository.findWithFilters(colorName, isActive, pageable);
        return colorPage.map(this::convertToResponseDTO);
    }
    
    // Lấy màu sắc theo ID
    public Optional<ColorResponse> getColorById(Integer id) {
        return colorRepository.findById(id)
                .map(this::convertToResponseDTO);
    }
    
    // Tạo màu sắc mới
    public ColorResponse createColor(ColorDto requestDTO) {
        // Kiểm tra tên màu đã tồn tại
        if (colorRepository.existsByColorNameIgnoreCase(requestDTO.getColorName())) {
            throw new RuntimeException("Tên màu đã tồn tại");
        }
        
        Color color = new Color();
        color.setColorName(requestDTO.getColorName());
        color.setIsActive(requestDTO.getIsActive());
        color.setCreatedAt(new Date());
        color.setUpdatedAt(new Date());
        
        Color savedColor = colorRepository.save(color);
        return convertToResponseDTO(savedColor);
    }
    
    // Cập nhật màu sắc
    public ColorResponse updateColor(Integer id, ColorDto requestDTO) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc"));
        
        // Kiểm tra tên màu đã tồn tại (trừ màu hiện tại)
        if (colorRepository.existsByColorNameIgnoreCaseAndColorIdNot(requestDTO.getColorName(), id)) {
            throw new RuntimeException("Tên màu đã tồn tại");
        }
        
        color.setColorName(requestDTO.getColorName());
        color.setIsActive(requestDTO.getIsActive());
        color.setUpdatedAt(new Date());
        
        Color updatedColor = colorRepository.save(color);
        return convertToResponseDTO(updatedColor);
    }
    
    // Xóa màu sắc
    public void deleteColor(Integer id) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc"));
        colorRepository.delete(color);
    }
    
    // Chuyển đổi Entity sang ResponseDTO
    private ColorResponse convertToResponseDTO(Color color) {
        return new ColorResponse(
                color.getColorId(),
                color.getColorName(),
                color.getIsActive(),
                color.getCreatedAt(),
                color.getUpdatedAt()
        );
    }
}