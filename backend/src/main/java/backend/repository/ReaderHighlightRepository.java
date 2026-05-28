package backend.repository;

import backend.entity.ReaderHighlight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReaderHighlightRepository extends JpaRepository<ReaderHighlight, Long> {
    List<ReaderHighlight> findByUser_IdAndBook_IdOrderByCreatedAtDesc(Long userId, Long bookId);
}
