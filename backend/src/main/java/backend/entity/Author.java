package backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@ToString(exclude = {"cart", "book"})
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "authors")
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "author_id")
    private Long id;

    @Column(name = "name", columnDefinition = "NVARCHAR", nullable = false)
    private String name;

    @Column(name = "biography", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String biography;

    @Column(name = "avatar_url", columnDefinition = "VARCHAR(MAX)", nullable = false)
    private String avatarUrl;

    @Column(name = "awards", columnDefinition = "VARCHAR(MAX)")
    private String awards;

//    @Column(name = "updated_at", nullable = false)
//    @Builder.Default
//    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();


}
