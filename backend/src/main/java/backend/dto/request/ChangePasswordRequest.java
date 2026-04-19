package backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {
    private String currentPassword;

    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 kí tự!")
    private String password;
}
