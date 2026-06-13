package backend.service;

import backend.dto.request.LoginRequest;
import backend.dto.request.RegisterRequest;
import backend.dto.request.SocialLoginRequest;
import backend.dto.request.VerifyEmailRequest;
import backend.dto.response.AuthResponse;
import backend.dto.response.PermissionResponse;
import backend.dto.response.RoleResponse;
import backend.dto.response.UserResponseDTO;
import backend.entity.User;
import backend.enums.AuthProvider;
import backend.enums.StatusUser;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.repository.RoleRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${app.oauth2.google.client-id}")
    private String googleClientId;

    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        var userRole = roleRepository.findById("USR")
                .orElseThrow(() -> new RuntimeException("Default role USR not found"));

        String otp = String.format("%06d", new Random().nextInt(1000000));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone("N/A")
                .roles(Set.of(userRole))
                .status(StatusUser.ACTIVE)
                .authProvider(AuthProvider.LOCAL)
                .isVerified(false)
                .verificationCode(otp)
                .verificationExpiry(LocalDateTime.now().plusMinutes(5))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    public void verifyEmail(VerifyEmailRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy email"));
        
        if (user.isVerified()) {
            throw new RuntimeException("Tài khoản đã được xác thực");
        }
        if (user.getVerificationExpiry() == null || user.getVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn");
        }
        if (!user.getVerificationCode().equals(request.getOtp())) {
            throw new RuntimeException("Mã OTP không hợp lệ");
        }

        user.setVerified(true);
        user.setVerificationCode(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);
    }

    public AuthResponse authenticate(LoginRequest request){
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_EXISTED));

        boolean authenticated =  passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!authenticated){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if(user.getStatus() == StatusUser.LOCKED){
            throw new AppException(ErrorCode.ACC_WAS_LOCKED);
        }
        if(!user.isVerified()){
            throw new RuntimeException("Tài khoản chưa được xác thực email. Vui lòng kiểm tra email.");
        }
        
        return buildAuthResponse(user);
    }

    public AuthResponse socialLogin(SocialLoginRequest request) {
        String email = null;
        String name = null;
        String providerId = null;

        RestTemplate restTemplate = new RestTemplate();

        if ("GOOGLE".equals(request.getProvider())) {
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getToken();
            try {
                var response = restTemplate.getForObject(url, Map.class);
                if (response != null && response.containsKey("email")) {
                    email = (String) response.get("email");
                    name = (String) response.get("name");
                    providerId = (String) response.get("sub");
                    String aud = (String) response.get("aud");
                    if (!googleClientId.equals(aud)) {
                        throw new AppException(ErrorCode.UNAUTHENTICATED); // invalid client
                    }
                } else {
                    throw new AppException(ErrorCode.UNAUTHENTICATED);
                }
            } catch (Exception e) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
        } else if ("FACEBOOK".equals(request.getProvider())) {
            String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + request.getToken();
            try {
                var response = restTemplate.getForObject(url, Map.class);
                if (response != null && response.containsKey("email")) {
                    email = (String) response.get("email");
                    name = (String) response.get("name");
                    providerId = (String) response.get("id");
                } else {
                    throw new AppException(ErrorCode.UNAUTHENTICATED);
                }
            } catch (Exception e) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
        } else {
            throw new RuntimeException("Provider không hợp lệ");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            var userRole = roleRepository.findById("USR")
                    .orElseThrow(() -> new RuntimeException("Role USR not found"));
            String randomUsername = email.split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 5);
            user = User.builder()
                    .username(randomUsername)
                    .email(email)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .authProvider(AuthProvider.valueOf(request.getProvider()))
                    .providerId(providerId)
                    .isVerified(true)
                    .roles(Set.of(userRole))
                    .status(StatusUser.ACTIVE)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
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
                .avatarUrl(user.getAvatarUrl())
                .roles(roleResponses)
                .build();

        return AuthResponse.builder()
                .token(token)
                .authenticated(true)
                .user(userDTO)
                .build();
    }
}
