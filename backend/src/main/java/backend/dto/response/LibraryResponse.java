package backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LibraryResponse {
    private Long progressId;      
    private Long bookId;          
    private String title;
    private String authorName;
    private String coverImage;
    private String status;        
    private Integer progress;  
    private String fiLocation;  
}