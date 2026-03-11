package backend.repository;

import backend.entity.Book;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    //find best seller
    @Query("""
        SELECT b FROM Book b
        ORDER BY b.previewPercentage DESC
        """)
    List<Book> findBestRatings(Pageable pageable);
}
