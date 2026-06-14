package backend.repository;


import backend.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    // Lấy phần trăm giảm giá lớn nhất đang kích hoạt của một cuốn sách tại thời điểm hiện tại
    @Query(value = "SELECT MAX(s.discount_percentage) FROM Sales s " +
                   "JOIN Sale_Books sb ON s.sale_id = sb.sale_id " +
                   "WHERE sb.book_id = :bookId " +
                   "AND s.status = 'active' " +
                   "AND :now BETWEEN s.start_date AND s.end_date", nativeQuery = true)
    Optional<Integer> findCurrentDiscountByBookId(@Param("bookId") Long bookId, @Param("now") LocalDateTime now);

    // Lọc theo tên chiến dịch không phân biệt chữ hoa chữ thường
   Page<Sale> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // Các hàm đếm thời gian giữ nguyên vì nó chuẩn theo trường startDate, endDate rồi
    long countByStartDateBeforeAndEndDateAfter(LocalDateTime nowForStart, LocalDateTime nowForEnd);
    long countByStartDateAfter(LocalDateTime now);
    @Modifying
    @Query(value = "DELETE FROM Sale_Books WHERE sale_id = :saleId", nativeQuery = true)
    void deleteBookLinksBySaleId(@Param("saleId") Long saleId);

    // Hãy chắc chắn tên hàm ở đây là insertBookLink
    @Modifying
    @Query(value = "INSERT INTO Sale_Books (sale_id, book_id) VALUES (:saleId, :bookId)", nativeQuery = true)
    void insertBookLink(@Param("saleId") Long saleId, @Param("bookId") Long bookId);

    @Query("SELECT s FROM Sale s WHERE s.status = 'active' AND :now BETWEEN s.startDate AND s.endDate")
    List<Sale> findAllActiveSales(@Param("now") LocalDateTime now);
}
