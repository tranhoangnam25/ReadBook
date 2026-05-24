package backend.repository;


import backend.entity.SaleBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleBookRepository extends JpaRepository<SaleBook, Long> {
    void deleteBySaleId(Long saleId);
    
}
