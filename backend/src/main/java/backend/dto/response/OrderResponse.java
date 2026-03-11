package backend.dto.response;

import backend.entity.Book;
import backend.entity.User;
import backend.enums.StatusOrder;
import jakarta.persistence.*;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderResponse {
    private Long id;
    private BigDecimal price;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "book_id",
            nullable = false
    )
    private Book book;
}
