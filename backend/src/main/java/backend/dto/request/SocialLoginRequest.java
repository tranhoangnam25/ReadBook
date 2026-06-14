package backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SocialLoginRequest {
    @NotBlank
    private String provider; // "GOOGLE" or "FACEBOOK"
    
    @NotBlank
    private String token; // idToken for Google, accessToken for Facebook
}
