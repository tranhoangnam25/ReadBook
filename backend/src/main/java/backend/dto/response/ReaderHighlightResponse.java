package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReaderHighlightResponse {
    private Long id;
    private Long bookId;
    private String cfiRange;
    private String text;
    private String note;
    private String color;
    private LocalDateTime createdAt;
}
