package backend.dto.response;

import backend.entity.Review;
import java.math.BigDecimal;

public class ReviewResponse {

    public Long id;
    public BigDecimal rating;
    public String comment;

    public Long userId;
    public String username;
    public String fullName;

    public ReviewResponse(Review r) {
        this.id = r.getId();
        this.rating = r.getRating();
        this.comment = r.getComment();

        if (r.getUser() != null) {
            this.userId = r.getUser().getId();
            this.username = r.getUser().getUsername();
        }
    }
}
