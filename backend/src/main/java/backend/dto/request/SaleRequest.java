package backend.dto.request;


import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class SaleRequest {
    private String title;
    private String description;
    private Integer discountPercentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<Long> bookIds; // Danh sách ID các cuốn sách được áp dụng sale
}