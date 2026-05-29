package backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import backend.enums.BackgroundColor;
import backend.enums.FontFamily;
import backend.enums.PageSpread;

@Entity
@Table(name = "Reader_Setting")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReaderSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reader_setting_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", unique = true, nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "font_family", length = 50)
    private FontFamily fontFamily;

    @Column(name = "font_size")
    private Integer fontSize;

    @Column(name = "line_height")
    private Double lineHeight;

    @Enumerated(EnumType.STRING)
    @Column(name = "background_color", length = 20)
    private BackgroundColor backgroundColor;

    @Enumerated(EnumType.STRING)
    @Column(name = "page_spread", length = 20)
    @Builder.Default
    private PageSpread pageSpread = PageSpread.NONE;

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
