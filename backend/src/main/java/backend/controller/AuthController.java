package backend.controller;

import backend.dto.request.RegisterRequest;
import backend.dto.request.LoginRequest;
import backend.dto.request.SocialLoginRequest;
import backend.dto.request.VerifyEmailRequest;
import backend.dto.response.ApiResponse;
import backend.dto.response.AuthResponse;
import backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok(Map.of("success", true, "message", "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác nhận."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody @Valid VerifyEmailRequest request) {
        try {
            authService.verifyEmail(request);
            return ResponseEntity.ok(Map.of("success", true, "message", "Xác thực email thành công!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> authenticate(@RequestBody LoginRequest request){
        var result = authService.authenticate(request);
        return ApiResponse.<AuthResponse>builder()
                .data(result)
                .success(true)
                .build();
    }

    @PostMapping("/social-login")
    public ApiResponse<AuthResponse> socialLogin(@RequestBody @Valid SocialLoginRequest request) {
        var result = authService.socialLogin(request);
        return ApiResponse.<AuthResponse>builder()
                .data(result)
                .success(true)
                .build();
    }
}