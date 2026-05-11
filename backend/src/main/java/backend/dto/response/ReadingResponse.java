
package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder           
@AllArgsConstructor 
@NoArgsConstructor  
public class ReadingResponse {
    private Long id;
    private String title;
    private String author;
    private String coverUrl;
    private java.math.BigDecimal progressPercentage;
    private String cfiLocation;
}