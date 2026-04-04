package backend.service;

import backend.entity.*;
import backend.enums.StatusReview;
import backend.repository.BookRepository;
import backend.repository.ReviewRepository;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy review theo book
    public List<Review> getByBookId(Long bookId) {
        return reviewRepository.findByBookId(bookId);
    }

    // CREATE
    public Review create(Long bookId, Long userId, Review review) {

    Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    review.setBook(book);
    review.setUser(user);

    // FIX NULL
    if (review.getCreatedAt() == null) {
        review.setCreatedAt(LocalDateTime.now());
    }

    if (review.getStatus() == null) {
        review.setStatus(StatusReview.visible);
    }

    return reviewRepository.save(review);
}

    // UPDATE
    public Review update(Integer id, Long userId, Review newData) {

    Review existing = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));

    // CHECK OWNER
    if (!existing.getUser().getId().equals(userId)) {
        throw new RuntimeException("You can only edit your own review");
    }

    if (newData.getRating() != null) {
        existing.setRating(newData.getRating());
    }

    if (newData.getComment() != null) {
        existing.setComment(newData.getComment());
    }

    return reviewRepository.save(existing);
}

    //DELETE
    public void delete(Integer id, Long userId) {

    Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));

  
    if (!review.getUser().getId().equals(userId)) {
        throw new RuntimeException("You can only delete your own review");
    }

    reviewRepository.delete(review);
}
}
