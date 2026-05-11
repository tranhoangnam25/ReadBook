package backend.repository;

import backend.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndName(Long userId, String name);


}
