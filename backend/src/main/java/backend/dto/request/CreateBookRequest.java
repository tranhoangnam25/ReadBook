package backend.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBookRequest {
    private String title;
    private BigDecimal price;
    private BigDecimal previewPercentage;
    private String description;
    private String coverImage;
    private String fileUrl;
    private Integer publishYear;
    private Long authorId;
    private Long categoryId;
}
