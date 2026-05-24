package backend.controller;

import backend.dto.request.RoleRequest;
import backend.dto.response.ApiResponse;
import backend.dto.response.RoleResponse;
import backend.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @PostMapping
    @PreAuthorize("hasRole('ADM')")
    ApiResponse<RoleResponse> create(@RequestBody RoleRequest request){
        return ApiResponse.<RoleResponse>builder()
                .success(true)
                .data(roleService.create(request))
                .code(201)
                .build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADM')")
    ApiResponse<List<RoleResponse>> getAll(){
        return ApiResponse.<List<RoleResponse>>builder()
                .success(true)
                .code(200)
                .data(roleService.getAll())
                .build();
    }

    @GetMapping("/{role}")
    @PreAuthorize("hasRole('ADM')")
    ApiResponse<RoleResponse> getById(@PathVariable String role){
        return ApiResponse.<RoleResponse>builder()
                .success(true)
                .data(roleService.getById(role))
                .build();
    }

    @PutMapping("/{role}")
    @PreAuthorize("hasRole('ADM')")
    ApiResponse<RoleResponse> update(@PathVariable String role, @RequestBody RoleRequest request){
        return ApiResponse.<RoleResponse>builder()
                .success(true)
                .data(roleService.update(role, request))
                .build();
    }

    @DeleteMapping("/{role}")
    @PreAuthorize("hasRole('ADM')")
    ApiResponse<Void> delete(@PathVariable String role){
        roleService.delete(role);
        return ApiResponse.<Void>builder()
                .success(true)
                .code(204)
                .build();
    }
}
