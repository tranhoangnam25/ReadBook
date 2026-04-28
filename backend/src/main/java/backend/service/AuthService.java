package backend.service;

import backend.dto.request.LoginRequest;
import backend.dto.response.AuthResponse;
import backend.dto.response.UserResponseDTO;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.repository.UserRepository;
import com.nimbusds.jose.*;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        String token = jwtService.generateToken(request.getEmail());


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
