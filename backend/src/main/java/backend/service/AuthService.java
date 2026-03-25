package backend.service;

import backend.dto.request.RegisterRequest;
import backend.entity.User;
import backend.enums.Role;
import backend.enums.StatusUser;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@Service
@RequiredArgsConstructor

public class AuthService {
//    private final UserRepository userRepository;
//
//    public void register(@RequestBody RegisterRequest request) {
//        if (userRepository.existsByUsername(request.getUsername())) {
//            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại"));
//        }
//        if (userRepository.existsByEmail(request.getEmail())) {
//            return ResponseEntity.badRequest().body(Map.of("message", "Email đã được sử dụng"));
//        }
//        User user = User.builder()
//                .username(request.getUsername())
//                .email(request.getEmail())
//                .password(request.getPassword()) // Nhớ mã hóa BCrypt sau này nhé
//                .phone("N/A")
//                .role(Role.USR)
//                .status(StatusUser.ACTIVE)
//                .createdAt(LocalDateTime.now())
//                .updatedAt(LocalDateTime.now())
//                .build();
//        userRepository.save(user);
//        return ResponseEntity.ok(Map.of("success", true, "message", "Đăng ký thành công!"));
//    }
}
