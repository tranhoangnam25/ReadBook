package backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"collectionItems"})
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "collections")
public class Collection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collection_id")
    private Long id;

    @Column(name = "name", columnDefinition = "NVARCHAR(50)", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String description;

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany (mappedBy = "collection", cascade = CascadeType.ALL)
    private List<CollectionItem> collectionItems = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
