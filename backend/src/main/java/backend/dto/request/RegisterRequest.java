package backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String email;

    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự!")
    private String password;
}

