package vn.student.polyshoes.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.student.polyshoes.enums.Role;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    
    private String adminUserId;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String address2;
    private Role role;
    private Boolean isActive;
    private Date createdAt;
    private Date updatedAt;
}
