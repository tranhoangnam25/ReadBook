package backend.service;

import backend.dto.request.LoginRequest;
import backend.dto.response.AuthResponse;
import backend.dto.response.PermissionResponse;
import backend.dto.response.RoleResponse;
import backend.dto.response.UserResponseDTO;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.repository.UserRepository;
import com.nimbusds.jose.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor

public class AuthService {



    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    public AuthResponse authenticate(LoginRequest request){
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_EXISTED));

        boolean authenticated =  passwordEncoder.matches( request.getPassword(), user.getPassword());
        if(!authenticated){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String token = jwtService.generateToken(user);


        Set<RoleResponse> roleResponses = user.getRoles().stream()
                .map(role -> RoleResponse.builder()
                        .name(role.getName())
                        .description(role.getDescription())
                        .permissions(
                                role.getPermissions().stream()
                                        .map(permission -> PermissionResponse.builder()
                                                .name(permission.getName())
                                                .description(permission.getDescription())
                                                .build())
                                        .collect(Collectors.toSet())
                        )
                        .build())
                .collect(Collectors.toSet());

        UserResponseDTO userDTO = UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();

        return AuthResponse.builder()
                .token(token)
                .authenticated(true)
                .user(userDTO)
                .build();
    }

}
