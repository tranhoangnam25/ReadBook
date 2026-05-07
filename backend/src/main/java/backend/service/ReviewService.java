package backend.repository;

import backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface ReviewRepository extends JpaRepository<Review, Long> {


    @Query("SELECT r FROM Review r JOIN FETCH r.user WHERE r.book.id = :bookId")
    Page<Review> findByBookId(@Param("bookId") Long bookId, Pageable pageable);
    @Query("SELECT r FROM Review r JOIN FETCH r.user WHERE r.id = :id")
Optional<Review> findByIdWithUser(@Param("id") Long id);
boolean existsByUser_IdAndBook_Id(Long userId, Long bookId);

}
