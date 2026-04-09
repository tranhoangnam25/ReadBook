package backend.repository;

import backend.entity.Book;
import backend.entity.User; // Hoặc Book tùy vào repository của cậu
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("""
        SELECT b FROM Book b
        ORDER BY b.previewPercentage DESC
        """)
    List<Book> findBestRatings(Pageable pageable);



    // 🔍 SEARCH TITLE
    @EntityGraph(attributePaths = {"author", "category"})
    List<Book> findByTitleContaining(String keyword);

    // 🔍 SEARCH + FILTER + PAGINATION (QUAN TRỌNG NHẤT)
    @EntityGraph(attributePaths = {"author", "category"})
    @Query("""
SELECT b FROM Book b
WHERE
(:keyword IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
AND
(:category IS NULL OR b.category.name = :category)
AND
(:minPrice IS NULL OR b.price >= :minPrice)
AND
(:maxPrice IS NULL OR b.price <= :maxPrice)
""")
Page<Book> searchBooks(
        String keyword,
        String category,
        Double minPrice,
        Double maxPrice,
        Pageable pageable
);
}
