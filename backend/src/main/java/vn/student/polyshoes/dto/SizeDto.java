package vn.student.polyshoes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SizeDto {
    
    @NotBlank(message = "Giá trị size không được để trống")
    @Size(max = 20, message = "Giá trị size không được vượt quá 20 ký tự")
    private String sizeValue;
    
    private Boolean isActive = true;
}