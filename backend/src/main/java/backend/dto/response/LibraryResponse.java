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
    private Long progressId;      // ID của bảng ReadingProgress
    private Long bookId;          // ID của sách để điều hướng sang trang chi tiết
    private String title;
    private String authorName;
    private String coverImage;
    private String status;        // "reading" | "completed" | "to_read"
    private BigDecimal progress;  // % tiến độ
    private String lastLocation;  // Vị trí đọc cuối cùng (fiLocation)
}