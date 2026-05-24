package backend.controller;


import backend.dto.request.ReviewReplyRequest;
import backend.dto.response.ReviewAdminResponse;
import backend.dto.response.ReviewResponse;
import backend.dto.response.ReviewStatsResponse;
import backend.entity.Review;
import backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reviews")
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


        Page<ReviewResponse> response = reviews.map(r -> {

    ReviewResponse res = new ReviewResponse();

    res.id = r.getId();
    res.rating = r.getRating();
    res.comment = r.getComment();
    res.adminReply = r.getAdminReply();

    if (r.getUser() != null) {
        res.userId = r.getUser().getId();
        res.username = r.getUser().getUsername();
    }

    return res;
});

        return ResponseEntity.ok(response);
    }

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
    res.adminReply = updated.getAdminReply();

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


    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADM') or hasAuthority('GET_ALL_REVIEW')")
    public ResponseEntity<Page<ReviewAdminResponse>>
getAdminReviews(

        @RequestParam(defaultValue = "")
        String keyword,

        @RequestParam(defaultValue = "")
        String status,

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "10")
        int size
) {

    return ResponseEntity.ok(
            reviewService.getReviewsForAdmin(
                    keyword,
                    status,
                    page,
                    size
            )
    );
}

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADM') or hasAuthority('GET_ALL_REVIEW')")
public ResponseEntity<ReviewStatsResponse>
getStats() {

    return ResponseEntity.ok(
            reviewService.getReviewStats()
    );
}

    @PutMapping("/{id}/hide")
    @PreAuthorize("hasAuthority('MANAGE_REVIEW')")
    public ResponseEntity<?> hideReview(@PathVariable Long id) {
    reviewService.hideReview(id);
    return ResponseEntity.ok("Ẩn đánh giá thành công");
}
    @PutMapping("/{id}/show")
    @PreAuthorize("hasAuthority('MANAGE_REVIEW')")
    public ResponseEntity<?> showReview(
            @PathVariable Long id
    ) {

    reviewService.showReview(id);

    return ResponseEntity.ok(
            "Hiện đánh giá thành công"
    );
}

    @PostMapping("/{id}/reply")
    public ResponseEntity<?> replyReview(
        @PathVariable Long id,
        @RequestBody ReviewReplyRequest request) {

        reviewService.replyReview(
            id,
            request.getReply());

    return ResponseEntity.ok(
            "Phản hồi thành công"
    );
}
}