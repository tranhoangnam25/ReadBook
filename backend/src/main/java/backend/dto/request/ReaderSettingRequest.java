package backend.dto.request;

import backend.enums.BackgroundColor;
import backend.enums.FontFamily;
import lombok.Data;

@Data
public class ReaderSettingRequest {
    private Long userId;
    private FontFamily fontFamily;
    private Integer fontSize;
    private Double lineHeight;
    private BackgroundColor backgroundColor;
}
