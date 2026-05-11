package backend.repository;

import backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByUser_IdAndBook_IdAndStatus(
        Long userId,
        Long bookId,
        backend.enums.StatusOrder status
);
}