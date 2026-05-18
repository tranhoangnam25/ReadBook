package backend.service;

import backend.dto.request.RoleRequest;
import backend.dto.response.PermissionResponse;
import backend.dto.response.RoleResponse;
import backend.entity.Role;
import backend.repository.PermissionRepository;
import backend.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;

    public RoleResponse create(RoleRequest request){
        Role role = Role.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        var permissions = permissionRepository.findAllById(request.getPermissions());

        role.setPermissions(new HashSet<>(permissions));

        roleRepository.save(role);

        return RoleResponse.builder()
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
                .build();
    }

    public List<RoleResponse> getAll(){
        return roleRepository.findAll()
                .stream()
                .map(role -> RoleResponse.builder()
                        .name(role.getName())
                        .description(role.getDescription())
                        .permissions(role.getPermissions().stream()
                                .map(permission -> PermissionResponse.builder()
                                        .name(permission.getName())
                                        .description(permission.getDescription())
                                        .build())
                                .collect(Collectors.toSet())
                        )
                        .build())
                .toList();
    }

    public void delete(String role){
        roleRepository.deleteById(role);
    }
}
