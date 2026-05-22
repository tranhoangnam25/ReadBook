package backend.dto.response;

import lombok.Builder;

@Builder
public record FileUploadResponse(
        String url,
        String key,
        String fileName,
        String contentType,
        long size) {
}
