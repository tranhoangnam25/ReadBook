package backend.repository;

import backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    
    Optional<Payment> findByOrder_Id(Long orderId);


    Optional<Payment> findById(Long id);
}