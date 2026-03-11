package backend.controller;

import backend.dto.response.BookResponse;
import backend.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "API quản lý sách")
public class BookController {
    private final BookService bookService;

    @GetMapping("/bestRatings")
    @Operation()
    public ResponseEntity<List<BookResponse>> getBestsellers(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(bookService.getBestRating(limit));
    }
}
