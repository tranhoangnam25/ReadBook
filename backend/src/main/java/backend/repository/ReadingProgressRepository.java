package backend.repository;

import backend.entity.ReadingProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {

    ReadingProgress findByUser_IdAndStatus(Long userId, String status);

    List<ReadingProgress> findByUser_IdAndStatusOrderByUpdatedAtDesc(Long userId, String status);

    java.util.Optional<ReadingProgress> findByUser_IdAndBook_Id(Long userId, Long bookId);
}