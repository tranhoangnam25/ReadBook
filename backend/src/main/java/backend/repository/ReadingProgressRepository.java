package backend.repository;

import backend.dto.response.ReadingResponse;
import backend.entity.ReadingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {

    ReadingProgress findByUser_IdAndStatus(Long userId, String status);

    List<ReadingProgress> findByUser_IdAndStatusOrderByUpdatedAtDesc(Long userId, String status);

    java.util.Optional<ReadingProgress> findByUser_IdAndBook_Id(Long userId, Long bookId);

    @Query("SELECT rp FROM ReadingProgress rp " +
            "JOIN FETCH rp.book b " +
            "LEFT JOIN FETCH b.author " +
            "WHERE rp.user.id = :userId")
    List<ReadingProgress> findAllByUserIdWithBook(@Param("userId") Long userId);

@Query("SELECT rp FROM ReadingProgress rp " +
       "JOIN FETCH rp.book b " +
       "LEFT JOIN FETCH b.author " + // 'b.author' phải khớp với tên biến trong class Book
       "WHERE rp.user.id = :userId " +
       "ORDER BY rp.updatedAt DESC")
List<ReadingProgress> findReadingHistoryByUserId(@Param("userId") Long userId);
}