package backend.controller;

import backend.dto.request.PermissionRequest;
import backend.dto.response.PermissionResponse;
import backend.dto.response.ApiResponse;
import backend.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    @PreAuthorize("hasRole('ADM')")
    ApiResponse<PermissionResponse> create(@RequestBody PermissionRequest request){
        return ApiResponse.<PermissionResponse>builder()
                .success(true)
                .data(permissionService.create(request))
                .code(201)
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADM')")
    ApiResponse<List<PermissionResponse>> getAll(){
        return ApiResponse.<List<PermissionResponse>>builder()
                .success(true)
                .code(200)
                .data(permissionService.getAll())
                .build();
    }

    @DeleteMapping("/{permission}")
    @PreAuthorize("hasRole('ADM')")
    ApiResponse<Void> delete(@PathVariable String permission){
        permissionService.delete(permission);
        return ApiResponse.<Void>builder()
                .success(true)
                .code(204)
                .build();
    }
}
