package backend.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderAdminResponse {
    private String id;             
    private String customerName;   
    private String customerEmail;  
    private String bookTitle;      
    private LocalDateTime date;    
    private BigDecimal amount;     
    private String status;         
}