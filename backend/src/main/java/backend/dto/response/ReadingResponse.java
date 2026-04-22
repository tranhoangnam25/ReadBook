// File: ReadingResponse.java
package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder           // Thêm cái này để hết lỗi .builder()
@AllArgsConstructor // Cần thiết cho Builder
@NoArgsConstructor  // Cần thiết cho Jackson (JSON)
public class ReadingResponse {
    private Long id;
    private String title;
    private String author;
    private String coverUrl;
    private java.math.BigDecimal progressPercentage;
    private String cfiLocation;
}