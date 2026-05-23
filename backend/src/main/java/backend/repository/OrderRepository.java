package backend.repository;

import backend.dto.response.OrderAdminResponse;
import backend.dto.response.OrderExportResponse;
import backend.dto.response.OrderResponseUser;
import backend.dto.response.OrderStatsResponse;
import backend.entity.Order;
import backend.enums.StatusOrder;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
SELECT new backend.dto.response.OrderResponseUser(
    o.id,
    o.book.title,
    o.price,
    o.status,
    o.createdAt
)
FROM Order o
WHERE o.user.id = :userId
""")
    List<OrderResponseUser> findOrderDTOByUserId(Long userId);

    boolean existsByUser_IdAndBook_IdAndStatus(
        Long userId,
        Long bookId,
        backend.enums.StatusOrder status
);

   
    @Query("SELECT new backend.dto.response.OrderAdminResponse(" +
           "CONCAT('#BK-', o.id), o.user.username, o.user.email, o.book.title, o.createdAt, o.price, 'paid') " +
           "FROM Order o " +
           "WHERE o.status = :status AND (" +
           "CONCAT('#BK-', o.id) LIKE %:keyword% OR " +
           "o.user.username LIKE %:keyword% OR " +
           "o.user.email LIKE %:keyword% OR " +
           "o.book.title LIKE %:keyword%)")
    Page<OrderAdminResponse> findAdminOrdersByStatus(
            @Param("status") StatusOrder status, 
            @Param("keyword") String keyword, 
            Pageable pageable);

    
    @Query("SELECT new backend.dto.response.OrderStatsResponse(COALESCE(SUM(o.price), 0), COUNT(o.id)) " +
           "FROM Order o WHERE o.status = :status")
    OrderStatsResponse getAdminStatsByStatus(@Param("status") StatusOrder status);

    
    @Query("SELECT new backend.dto.response.OrderAdminResponse(" +
           "CONCAT('#BK-', o.id), o.user.username, o.user.email, o.book.title, o.createdAt, o.price, 'paid') " +
           "FROM Order o WHERE o.id = :orderId")
    Optional<OrderAdminResponse> findAdminOrderDetailsById(@Param("orderId") Long orderId);

    @Query("""
    SELECT new backend.dto.response.OrderExportResponse(
        o.id,
        u.username,
        u.email,
        b.title,
        o.price,
        o.status,
        o.createdAt
    )
    FROM Order o
    JOIN o.user u
    JOIN o.book b
    WHERE o.status = backend.enums.StatusOrder.PAID
    ORDER BY o.createdAt DESC
""")
List<OrderExportResponse> exportOrders();
    
}