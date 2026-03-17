package backend.controller;

import backend.dto.request.RegisterRequest;
import backend.entity.User;
import backend.enums.Role;
import backend.enums.StatusUser;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // 1. Kiểm tra tồn tại
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã được sử dụng"));
        }

        // 2. Tạo đối tượng User từ Builder (Entity cậu rất xịn nên dùng Builder là chuẩn bài)
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password_hash(request.getPassword()) // Nhớ mã hóa BCrypt sau này nhé
                .phone("N/A") // Vì DB bắt buộc nullable = false, tạm thời để giá trị mặc định
                .role(Role.USR)
                .status(StatusUser.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("success", true, "message", "Đăng ký thành công!"));
    }
}
