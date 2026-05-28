package backend.service;

import backend.dto.request.PermissionRequest;
import backend.dto.response.PermissionResponse;
import backend.entity.Permissions;
import backend.entity.Role;
import backend.repository.PermissionRepository;
import backend.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;

    RoleRepository roleRepository;

    private PermissionResponse toPermissionResponse(Permissions permission){
        return PermissionResponse.builder()
                .name(permission.getName())
                .description(permission.getDescription())
                .build();
    }
    public PermissionResponse create(PermissionRequest request){
        Permissions permission = Permissions.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        permission = permissionRepository.save(permission);
        return toPermissionResponse(
                permissionRepository.save(permission)
        );
    }

    public List<PermissionResponse> getAll(){
        var permissions = permissionRepository.findAll();
        return permissions.stream()
                .map(permission -> PermissionResponse.builder()
                    .name(permission.getName())
                    .description(permission.getDescription())
                    .build())
                .toList();
    }

    @Transactional
    public void delete(String permissionName) {

        Permissions permission = permissionRepository.findById(permissionName)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        for (Role role : roleRepository.findAll()) {
            role.getPermissions().remove(permission);
        }

        roleRepository.flush();

        permissionRepository.delete(permission);
    }
}
