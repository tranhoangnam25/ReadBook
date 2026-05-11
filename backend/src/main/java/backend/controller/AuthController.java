package backend.controller;

import backend.dto.request.RegisterRequest;
import backend.dto.request.LoginRequest;
import backend.dto.response.ApiResponse;
import backend.dto.response.AuthResponse;
import backend.dto.response.UserResponseDTO;
import backend.entity.User;
import backend.enums.Role;
import backend.enums.StatusUser;
import backend.repository.UserRepository;
import backend.service.AuthService;
import backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã được sử dụng"));
        }
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone("N/A")
                .role(Role.USR)
                .status(StatusUser.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "Đăng ký thành công!"));
    }
    @PostMapping("/login")
    ApiResponse<AuthResponse> authenticate(@RequestBody LoginRequest request){
        var result = authService.authenticate(request);
        return ApiResponse.<AuthResponse>builder()
                .data(result)
                .success(true)
                .build();
    }
}