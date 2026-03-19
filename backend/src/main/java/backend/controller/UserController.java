package backend.controller;

import backend.dto.response.BookResponse;
import backend.dto.response.HistoryResponse;
import backend.dto.response.ReadingResponse;
import backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import backend.entity.User;
import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }
    @GetMapping("/me") // Lấy thông tin người dùng hiện tại
    public User getMe() {
        return userService.getUserById(1L);
    }
    @GetMapping("/me/reading")
    public ReadingResponse getReading() {
        return userService.getReading(1L); // test user id = 1
    }

    // 📜 lịch sử
    @GetMapping("/me/history")
    public List<HistoryResponse> getHistory() {
        return userService.getHistory(1L);
    }

}