package backend.dto.request;

import lombok.Data;

@Data
public class CollectionRequest {
    private Long userId;
    private String name;
}
