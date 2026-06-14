package backend.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
public class ReadingResponse {
    private Long id;
    private String title;
    private String author;
    private String coverUrl;
    private BigDecimal progressPercentage;
    private String cfiLocation;

    // Constructor thủ công chính xác theo thứ tự trong @Query
    public ReadingResponse(Long id, String title, String author, String coverUrl, 
                           BigDecimal progressPercentage, String cfiLocation) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.coverUrl = coverUrl;
        this.progressPercentage = progressPercentage;
        this.cfiLocation = cfiLocation;
    }
}