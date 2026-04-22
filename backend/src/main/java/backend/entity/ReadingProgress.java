package backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Reading_Progress")
@Data
public class ReadingProgress {

    @Id
    @Column(name = "progress_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(name = "fi_location", length = 255, nullable = false)
    private String fiLocation;

    @Column(name = "progress_percentage")
    private java.math.BigDecimal progressPercentage;

    private String status; // reading | completed

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}