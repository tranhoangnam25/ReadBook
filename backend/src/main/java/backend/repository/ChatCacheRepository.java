package backend.repository;

import backend.entity.ChatCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatCacheRepository extends JpaRepository<ChatCache, Long> {
}
