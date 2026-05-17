package backend.repository;

import backend.dto.response.ReviewAdminResponse;
import backend.dto.response.ReviewStatsResponse;
import backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface ReviewRepository extends JpaRepository<Review, Long> {


    @Query("""
SELECT r
FROM Review r
JOIN FETCH r.user
WHERE r.book.id = :bookId
AND r.status = backend.enums.StatusReview.VISIBLE
""")
Page<Review> findByBookId(
        @Param("bookId") Long bookId,
        Pageable pageable
);
boolean existsByUser_IdAndBook_Id(Long userId, Long bookId);
   @Query("""
    SELECT r
    FROM Review r
    JOIN FETCH r.user
    WHERE r.id = :id
""")
Optional<Review> findByIdWithUser(@Param("id") Long id);


  @Query("""
SELECT new backend.dto.response.ReviewAdminResponse(
    r.id,
    u.username,
    CONCAT('#C00', u.id),
    b.title,
    r.rating,
    r.comment,
    r.createdAt,
    CASE
        WHEN r.status = backend.enums.StatusReview.VISIBLE
        THEN 'visible'
        ELSE 'hidden'
    END,
    r.adminReply
)
FROM Review r
JOIN r.user u
JOIN r.book b
WHERE
(
    :keyword = ''
    OR LOWER(u.username)
        LIKE LOWER(CONCAT('%', :keyword, '%'))
    OR LOWER(b.title)
        LIKE LOWER(CONCAT('%', :keyword, '%'))
)
AND
(
    :status = ''
    OR (:status = 'visible'
        AND r.status = backend.enums.StatusReview.VISIBLE)
    OR (:status = 'hidden'
        AND r.status = backend.enums.StatusReview.HIDDEN)
)
""")
Page<ReviewAdminResponse> getReviewsForAdmin(
        String keyword,
        String status,
        Pageable pageable
);

    @Query("""
SELECT new backend.dto.response.ReviewStatsResponse(
    COUNT(r),
    SUM(
        CASE
            WHEN r.rating = 5 THEN 1
            ELSE 0
        END
    )
)
FROM Review r
""")
ReviewStatsResponse getReviewStats();
}