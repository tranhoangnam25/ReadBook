package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReaderBookmarkResponse {
    private Long id;
    private Long bookId;
    private String cfiLocation;
    private BigDecimal progressPercentage;
    private String label;
    private String note;
    private LocalDateTime createdAt;
}
