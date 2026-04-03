package backend.dto.response;
import backend.entity.*;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ReviewResponse {
    public Long id;
    public BigDecimal rating;
    public String comment;
    public Long userId;

    public ReviewResponse(Review r) {
        this.id = r.getId();
        this.rating = r.getRating();
        this.comment = r.getComment();
        this.userId = r.getUser().getId();
    }
}

