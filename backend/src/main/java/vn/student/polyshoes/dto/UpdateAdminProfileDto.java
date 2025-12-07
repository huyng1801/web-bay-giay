package vn.student.polyshoes.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAdminProfileDto {
    private String fullName;
    private String phone;
    private String address;
    private String address2;
}