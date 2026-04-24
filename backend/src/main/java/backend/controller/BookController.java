package backend.controller;

import backend.dto.response.BookResponse;
import backend.entity.Book;
import backend.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "API quản lý sách")
public class BookController {
    private final BookService bookService;

    @GetMapping("/{id}")
    public BookResponse getBook(@PathVariable Long id) {
    return bookService.getById(id);
}

    @GetMapping("/bestRatings")
    public ResponseEntity<List<BookResponse>> getBestsellers(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(bookService.getBestRating(limit));
    }

    @GetMapping("/bestSellers")
    public ResponseEntity<List<BookResponse>> getBestSellingBooks(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(bookService.getBestSellers(limit));
    }
    @GetMapping("/recommends")
    public List<BookResponse> getRecommend() {
    return bookService.getRecommend();
}

    @GetMapping("/search")
    public List<BookResponse> search(@RequestParam String keyword) {
        return bookService.search(keyword);
    }

    @GetMapping
    public Page<BookResponse> searchBooks(@RequestParam(required = false) String keyword,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {
    return bookService.searchBooks(keyword, category, minPrice, maxPrice, page, size);
}
}
