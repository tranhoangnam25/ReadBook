package backend.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatsResponse {
    private BigDecimal totalRevenue;
    private long totalOrdersCount;
}