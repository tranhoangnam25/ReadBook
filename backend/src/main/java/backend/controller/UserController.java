package backend.controller;

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
    @GetMapping("/me") // Lấy thông tin người dùng hiện tại
    public User getMe(@RequestParam Long id) {
        return userService.getUserById(id);
    }
    @GetMapping("/me/reading")
    public ReadingResponse getReading(@RequestParam Long id) {
        return userService.getReading(id); // test user id = 1
    }

    // 📜 lịch sử
    @GetMapping("/me/history")
    public List<HistoryResponse> getHistory() {
        return userService.getHistory(1L);
    }
    @PutMapping("/me/update/{userId}")
    User updateUser(
            @PathVariable("userId") Long userId,
            @RequestBody UserUpdateRequest request){
        return userService.updateUser(userId  ,request);
    }
}