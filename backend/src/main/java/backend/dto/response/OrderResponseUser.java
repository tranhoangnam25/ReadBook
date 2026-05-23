package backend.dto.response;

import backend.enums.StatusOrder;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class OrderResponseUser {
    private Long id;
    private String bookTitle;
    private BigDecimal price;
    private StatusOrder status;
    private LocalDateTime createdAt;

    public OrderResponseUser(
            Long id,
            String bookTitle,
            BigDecimal price,
            StatusOrder status,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.bookTitle = bookTitle;
        this.price = price;
        this.status = status;
        this.createdAt = createdAt;
    }
}
