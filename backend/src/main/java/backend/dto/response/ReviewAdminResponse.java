package backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReviewAdminResponse {

    private Long id;

    private String customerName;

    private String customerId;

    private String bookTitle;

    private BigDecimal rating;

    private String comment;

    private LocalDateTime date;

    private String status;

    private String replyAdmin;

    public ReviewAdminResponse(
            Long id,
            String customerName,
            String customerId,
            String bookTitle,
            BigDecimal rating,
            String comment,
            LocalDateTime date,
            String status,
            String replyAdmin
    ) {
        this.id = id;
        this.customerName = customerName;
        this.customerId = customerId;
        this.bookTitle = bookTitle;
        this.rating = rating;
        this.comment = comment;
        this.date = date;
        this.status = status;
        this.replyAdmin = replyAdmin;
    }

    // ================= GETTER / SETTER =================

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public String getStatus() {
        return status;
    }

    public String getReplyAdmin() {
        return replyAdmin;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setReplyAdmin(String replyAdmin) {
        this.replyAdmin = replyAdmin;
    }
}