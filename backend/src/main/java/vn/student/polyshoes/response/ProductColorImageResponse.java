package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductColorImageResponse {
    private Integer productColorImageId;
    private String imageUrl;
    private Integer productColorId; // Optionally include product color ID for reference
}
