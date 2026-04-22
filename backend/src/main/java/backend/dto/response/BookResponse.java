package backend.dto.response;

import backend.entity.*;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {
    private Long id;
    private String title;
    private BigDecimal price;
    private BigDecimal previewPercentage;
    private String description;
    private String coverImage;
    private String fileUrl;
    private Integer publishYear;
    private String authorName;
    private String category;
}
