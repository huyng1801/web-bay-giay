package vn.student.polyshoes.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// DTO dùng để nhận dữ liệu tạo mới màu và hình ảnh của sản phẩm
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColorImageDto {

    // ID của màu sản phẩm
    @NotNull(message = "ID màu sản phẩm không được để trống")
    private Integer productColorId;

    // Danh sách hình ảnh của màu đó (có thể up nhiều hình)
    @NotNull(message = "Danh sách hình ảnh không được để trống")
    private List<MultipartFile> imageFiles;  // Allows multiple images
}
