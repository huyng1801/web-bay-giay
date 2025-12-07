package vn.student.polyshoes.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import vn.student.polyshoes.dto.LoginUserDto;
import vn.student.polyshoes.model.AdminUser;
import vn.student.polyshoes.repository.AdminUserRepository;

@Service
public class AuthenticationService {
    private final AdminUserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
        AdminUserRepository userRepository,
        AuthenticationManager authenticationManager
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

   public AdminUser authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                input.getEmail(),
                input.getPassword()
            )
        );

        AdminUser user = userRepository.findByEmail(input.getEmail()).get();
        return user;
    }
}
