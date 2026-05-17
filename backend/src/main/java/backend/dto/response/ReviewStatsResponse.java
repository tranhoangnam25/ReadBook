package backend.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewStatsResponse {

    private Long totalReviews;

    private Long fiveStarReviews;
}