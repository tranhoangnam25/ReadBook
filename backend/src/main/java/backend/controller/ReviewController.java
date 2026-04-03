package backend.controller;



import backend.dto.response.ReviewResponse;
import backend.entity.Review;
import backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // GET reviews by book
    @GetMapping("/book/{bookId}")
public List<ReviewResponse> getByBook(@PathVariable Long bookId) {
    return reviewService.getByBookId(bookId)
            .stream()
            .map(ReviewResponse::new)
            .toList();
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