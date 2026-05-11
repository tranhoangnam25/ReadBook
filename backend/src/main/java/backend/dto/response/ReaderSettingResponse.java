package backend.dto.response;

import backend.enums.BackgroundColor;
import backend.enums.FontFamily;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReaderSettingResponse {
    private FontFamily fontFamily;
    private Integer fontSize;
    private Double lineHeight;
    private BackgroundColor backgroundColor;
}
