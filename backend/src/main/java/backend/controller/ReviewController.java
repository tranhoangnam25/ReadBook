package backend.controller;


import backend.dto.response.ReviewResponse;
import backend.entity.Review;
import backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // GET reviews by book
    @GetMapping("/book/{bookId}")
    public ResponseEntity<Page<Review>> getAllReviewsByBook(
            @PathVariable Long bookId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "4") int size
    ) {

        Page<Review> reviews = reviewService.getByBookId(bookId, page, size);
        return ResponseEntity.ok(reviews);
    }

    // CREATE
    @PostMapping
    public Review create(
            @RequestParam Long bookId,
            @RequestParam Long userId,
            @RequestBody Review review
    ) {
        return reviewService.create(bookId, userId, review);
    }

    @PutMapping("/{id}")
    public Review update(
            @PathVariable Integer id,
            @RequestParam Long userId,
            @RequestBody Review review
    ) {
        return reviewService.update(id, userId, review);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Integer id,
            @RequestParam Long userId
    ) {
        reviewService.delete(id, userId);
    }


}