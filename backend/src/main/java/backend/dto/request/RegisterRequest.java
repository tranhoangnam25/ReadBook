package backend.dto.request;

import backend.entity.Collection;
import backend.enums.Role;
import backend.enums.StatusUser;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
public class RegisterRequest {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String password;
}

