package backend.dto.request;

import lombok.Data;

@Data
public class AddBookRequest {
    private Long collectionId;
    private Long bookId;
}
