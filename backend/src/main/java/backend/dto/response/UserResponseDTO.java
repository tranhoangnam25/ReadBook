package backend.dto.response;

import backend.entity.Role;
import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private Set<RoleResponse> roles;
}
