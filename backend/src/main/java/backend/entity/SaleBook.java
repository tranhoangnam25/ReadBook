package backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "Sale_Books", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"sale_id", "book_id"})
})
@Getter
@Setter
@NoArgsConstructor  // Bắt buộc phải có khi dùng @Builder kết hợp với JPA Entity
@AllArgsConstructor // Bắt buộc phải có để @Builder có thể hoạt động đúng
@Builder
public class SaleBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_book_id")
    private Long id;

    @Column(name = "sale_id", nullable = false)
    private Long saleId;

    @Column(name = "book_id", nullable = false)
    private Long bookId;

    @Column(name = "added_at", insertable = false, updatable = false)
    private LocalDateTime addedAt;
}
