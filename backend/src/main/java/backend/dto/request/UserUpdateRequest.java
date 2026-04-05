package backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    @Size(min = 8, message = "Mật khẩu phải ít nhất 8 ký tự")
    private String password;

    private String username;

    private String phone;

}
