package backend.service;

import backend.dto.response.ReviewResponse;
import backend.entity.*;
import backend.enums.StatusReview;
import backend.repository.BookRepository;
import backend.repository.OrderRepository;
import backend.repository.ReviewRepository;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

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
    @Autowired
    private OrderRepository orderRepo;
    
    public Page<Review> getByBookId(Long bookId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reviewRepository.findByBookId(bookId, pageable);
    }

    private boolean hasPurchased(Long userId, Long bookId) {
        System.out.println("CHECK PURCHASE REVIEW: user=" + userId + " book=" + bookId);
    return orderRepo.existsByUser_IdAndBook_IdAndStatus(
            userId,
            bookId,
            backend.enums.StatusOrder.PAID
    );
}
    public Review create(Long bookId, Long userId, Review review) {

    // CHECK ĐÃ MUA CHƯA
    if (!hasPurchased(userId, bookId)) {
        throw new RuntimeException("Bạn phải mua sách trước khi review");
    }

    Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    review.setBook(book);
    review.setUser(user);

    if (review.getCreatedAt() == null) {
        review.setCreatedAt(LocalDateTime.now());
    }

    if (review.getStatus() == null) {
        review.setStatus(StatusReview.VISIBLE);
    }

    return reviewRepository.save(review);
}
    
    
    
   public void delete(Long id, Long userId) {

    Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));

    // check chủ review
    if (!review.getUser().getId().equals(userId)) {
        throw new RuntimeException("You can only delete your own review");
    }

    // CHECK ĐÃ MUA CHƯA
    if (!hasPurchased(userId, review.getBook().getId())) {
        throw new RuntimeException("Bạn chưa mua sách này");
    }

    reviewRepository.delete(review);
}

       public Review update(Long id, Long userId, Review review) {
    Review existing = reviewRepository.findByIdWithUser(id)
        .orElseThrow(() -> new RuntimeException("Review not found"));

    if (!existing.getUser().getId().equals(userId)) {
        throw new RuntimeException("Không có quyền sửa");
    }

    existing.setRating(review.getRating());
    existing.setComment(review.getComment());

    return reviewRepository.save(existing);
}
}
