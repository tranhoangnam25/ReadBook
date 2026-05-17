package backend.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class OrderExportResponse {

    private Long orderId;

    private String customerName;

    private String customerEmail;

    private String bookTitle;

    private BigDecimal amount;

    private String status;

    private LocalDateTime createdAt;

    // =========================
    // CONSTRUCTOR CHO JPQL
    // =========================

    public OrderExportResponse(
            Long orderId,
            String customerName,
            String customerEmail,
            String bookTitle,
            BigDecimal amount,
            Object status,
            LocalDateTime createdAt
    ) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.bookTitle = bookTitle;
        this.amount = amount;
        this.status = status.toString();
        this.createdAt = createdAt;
    }
}