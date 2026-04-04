package backend.dto.response;

import lombok.*;

import java.math.BigDecimal;

import backend.entity.Book;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long orderId;
    private BigDecimal price;
    private String status;

    private Long userId;
    private Long bookId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "book_id",
            nullable = false
    )
    private Book book;
    
}
