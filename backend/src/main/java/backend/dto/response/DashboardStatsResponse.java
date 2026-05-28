package backend.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private BigDecimal totalRevenue;
    private long newUsersCount;
    private long totalOrdersCount;
}
