package backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReaderHighlightRequest {
    private Long userId;
    private Long bookId;
    private String cfiRange;
    private String text;
    private String color;
}
