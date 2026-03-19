package backend.controller;

import backend.dto.request.RegisterRequest;
import backend.dto.request.LoginRequest;
import backend.dto.response.AuthResponse;
import backend.dto.response.UserResponseDTO;
import backend.entity.User;
import backend.enums.Role;
import backend.enums.StatusUser;
import backend.repository.UserRepository;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã được sử dụng"));
        }
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword()) // Nhớ mã hóa BCrypt sau này nhé
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
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        // Tìm user theo email
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);

        // So sánh mật khẩu
        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {

            // Tạo thông tin user an toàn để trả về
            UserResponseDTO userDto = new UserResponseDTO(user.getId(), user.getUsername(), user.getEmail());

            // Token ảo (Sau này thay bằng JWT thực tế)
            String token = "dummy-jwt-token-123";

            return ResponseEntity.ok(new AuthResponse(true, "Đăng nhập thành công", token, userDto));
        }
        return ResponseEntity.status(401).body(new AuthResponse(false, "Sai tài khoản hoặc mật khẩu", null, null));
    }
}