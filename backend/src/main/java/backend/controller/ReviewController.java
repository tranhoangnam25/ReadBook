package backend.controller;


import backend.dto.response.ReviewResponse;
import backend.entity.Review;
import backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

        // 👉 map sang DTO
        Page<ReviewResponse> response = reviews.map(r -> {

    ReviewResponse res = new ReviewResponse();

    res.id = r.getId();
    res.rating = r.getRating();
    res.comment = r.getComment();

    if (r.getUser() != null) {
        res.userId = r.getUser().getId();
        res.username = r.getUser().getUsername();
    }

    return res;
});

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

    ReviewResponse res = new ReviewResponse();

    res.id = r.getId();
    res.rating = r.getRating();
    res.comment = r.getComment();
    res.userId = r.getUser().getId();
    res.username = r.getUser().getUsername();

    return res;
}

   
    
  @PutMapping("/{id}")
public ReviewResponse update(
        @PathVariable Long id,
        @RequestParam Long userId,
        @RequestBody Review review
) {

    Review updated =
            reviewService.update(id, userId, review);

    ReviewResponse res = new ReviewResponse();

    res.id = updated.getId();
    res.rating = updated.getRating();
    res.comment = updated.getComment();

    // dùng existing user đã load
    res.userId = updated.getUser().getId();
    res.username = updated.getUser().getUsername();

    return res;
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
