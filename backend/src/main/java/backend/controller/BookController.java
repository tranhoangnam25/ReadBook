package backend.controller;

import backend.dto.request.CreateBookRequest;
import backend.dto.request.UpdateBookRequest;
import backend.dto.response.BookResponse;
import backend.service.BookService;
import backend.service.EmbeddingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "API quản lý sách")
public class BookController {
    private final BookService bookService;
    private final EmbeddingService embeddingService;

    @GetMapping("/{id}")
    public BookResponse getBook(@PathVariable Long id) {
    return bookService.getById(id);
}

    @PostMapping
    public BookResponse createBook(@RequestBody CreateBookRequest request) {
        return bookService.createBook(request);
    }

    @PutMapping("/{id}")
    public BookResponse updateBook(@PathVariable Long id, @RequestBody UpdateBookRequest request) {
        return bookService.updateBook(id, request);
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
    @PostMapping("/embedding")
    public String generateEmbeddings() {

        embeddingService.generateEmbeddings();

        return "Generated embeddings successfully";
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
