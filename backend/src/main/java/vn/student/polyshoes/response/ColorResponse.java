package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColorResponse {
    
    private Integer colorId;
    private String colorName;
    private Boolean isActive;
    private Date createdAt;
    private Date updatedAt;
}