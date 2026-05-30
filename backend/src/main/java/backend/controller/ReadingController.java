package backend.controller;

import backend.dto.response.ReadingResponse;
import backend.repository.ReadingProgressRepository; // Giả sử bạn có class này để lấy userId
import jakarta.servlet.http.HttpSession;
import backend.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class ReadingController {

    @Autowired private ReadingProgressService readingService;

@GetMapping("/me/reading-history")
public ResponseEntity<List<ReadingResponse>> getHistory(@RequestParam Long userId) {
    return ResponseEntity.ok(readingService.getHistory(userId));
}
}
