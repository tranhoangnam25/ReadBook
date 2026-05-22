package backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chat_cache")
public class ChatCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_query", columnDefinition = "NVARCHAR(MAX)")
    private String userQuery;

    @Column(name = "embedding", columnDefinition = "VARBINARY(MAX)")
    private byte[] embedding;

    @Column(name = "ai_response", columnDefinition = "NVARCHAR(MAX)")
    private String aiResponse;

    @Column(name = "book_ids")
    private String bookIds;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
