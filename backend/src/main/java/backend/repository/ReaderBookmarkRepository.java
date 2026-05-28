package backend.repository;

import backend.entity.ReaderBookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReaderBookmarkRepository extends JpaRepository<ReaderBookmark, Long> {
    List<ReaderBookmark> findByUser_IdAndBook_IdOrderByCreatedAtDesc(Long userId, Long bookId);
}
