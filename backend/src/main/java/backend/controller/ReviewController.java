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

    @GetMapping("/book/{bookId}")
    public ResponseEntity<Page<ReviewResponse>> getAllReviewsByBook(
            @PathVariable Long bookId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "4") int size
    ) {

        Page<Review> reviews = reviewService.getByBookId(bookId, page, size);

       
        Page<ReviewResponse> response = reviews.map(ReviewResponse::new);

        return ResponseEntity.ok(response);
    }

    // CREATE
    @PostMapping
    public ReviewResponse create(
            @RequestParam Long bookId,
            @RequestParam Long userId,
            @RequestBody Review review
    ) {
        Review r = reviewService.create(bookId, userId, review);
        return new ReviewResponse(r);
    }

   @PutMapping("/{id}")
public ReviewResponse update(
        @PathVariable Long id,
        @RequestParam Long userId,
        @RequestBody Review review
) {
    Review r = reviewService.update(id, userId, review); 
    return new ReviewResponse(r); 
}


    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        reviewService.delete(id, userId);
        return ResponseEntity.ok().build();
    }
}
