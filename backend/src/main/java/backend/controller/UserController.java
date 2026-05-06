package backend.controller;

import backend.dto.request.ChangePasswordRequest;
import backend.dto.request.UserUpdateRequest;
import backend.dto.response.BookResponse;
import backend.dto.response.HistoryResponse;
import backend.dto.response.ReadingResponse;
import backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import backend.entity.User;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}") 
    public User getMe(@RequestParam Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/me/reading")
    public ReadingResponse getReading(@RequestParam Long id) {
        return userService.getReading(id); 
    }

    @GetMapping("/me/reading/progress")
    public ReadingResponse getReadingProgress(@RequestParam Long userId, @RequestParam Long bookId) {
        return userService.getReadingProgress(userId, bookId);
    }

    @PostMapping("/me/reading/progress")
    public ResponseEntity<Void> saveReadingProgress(@RequestBody backend.dto.request.ReadingProgressRequest request) {
        userService.saveReadingProgress(
                request.getUserId(), 
                request.getBookId(), 
                request.getCfiLocation(), 
                request.getProgressPercentage());
        return ResponseEntity.ok().build();
    }

    
    @GetMapping("/me/history")
    public List<HistoryResponse> getHistory(@RequestParam Long userId) {
        return userService.getHistory(userId);
    }

    @PutMapping("/{id}")
    User updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request) {
        return userService.updateUser(id, request);
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam Long id,
            @RequestBody ChangePasswordRequest request
    ) {
        try {
            userService.changePassword(id, request);
            return ResponseEntity.ok("Đổi mật khẩu thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}