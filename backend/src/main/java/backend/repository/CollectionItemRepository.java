package backend.repository;

import backend.entity.CollectionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CollectionItemRepository extends JpaRepository<CollectionItem, Long> {
    boolean existsByCollectionIdAndBookId(Long collectionId, Long bookId);

    @Query("SELECT ci FROM CollectionItem ci " +
            "JOIN FETCH ci.book b " +
            "JOIN FETCH b.author a " +
            "WHERE ci.collection.id = :collectionId")
    List<CollectionItem> findAllByCollectionId(@Param("collectionId") Long collectionId);
    void deleteByCollectionId(Long collectionId);

}
