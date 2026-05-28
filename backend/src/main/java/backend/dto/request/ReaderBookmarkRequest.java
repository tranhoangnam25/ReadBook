package backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReaderBookmarkRequest {
    private Long userId;
    private Long bookId;
    private String cfiLocation;
    private BigDecimal progressPercentage;
    private String label;
    private String note;
}
