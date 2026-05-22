package backend.service;

import backend.configuration.R2Properties;
import backend.dto.response.FileUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadService {
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final Set<String> ALLOWED_BOOK_TYPES = Set.of("application/epub+zip", "application/octet-stream");

    private final S3Client r2S3Client;
    private final R2Properties r2Properties;

    public FileUploadResponse upload(MultipartFile file, String type) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống.");
        }

        String normalizedType = type == null ? "" : type.toLowerCase(Locale.ROOT);
        String contentType = file.getContentType() == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE
                : file.getContentType();
        String originalFileName = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
        String extension = getExtension(originalFileName);

        validateFile(normalizedType, contentType, extension);

        String safeName = sanitizeFileName(stripExtension(originalFileName));
        String key = String.format("books/%s/%s/%s-%s%s", normalizedType, LocalDate.now(), UUID.randomUUID(), safeName,
                extension);

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(r2Properties.bucket())
                .key(key)
                .contentType(contentType)
                .contentLength(file.getSize())
                .build();

        r2S3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return FileUploadResponse.builder()
                .url(buildPublicUrl(key))
                .key(key)
                .fileName(originalFileName)
                .contentType(contentType)
                .size(file.getSize())
                .build();
    }

    private void validateFile(String type, String contentType, String extension) {
        if ("cover".equals(type)) {
            if (!ALLOWED_IMAGE_TYPES.contains(contentType)) {
                throw new IllegalArgumentException("Ảnh bìa chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF.");
            }
            return;
        }

        if ("book".equals(type)) {
            if (!".epub".equals(extension) || !ALLOWED_BOOK_TYPES.contains(contentType)) {
                throw new IllegalArgumentException("File sách chỉ hỗ trợ EPUB.");
            }
            return;
        }

        throw new IllegalArgumentException("Loại upload không hợp lệ.");
    }

    private String buildPublicUrl(String key) {
        String baseUrl = r2Properties.publicUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            return key;
        }
        return baseUrl.replaceAll("/+$", "") + "/" + key;
    }

    private String getExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex < 0) {
            return "";
        }
        return fileName.substring(dotIndex).toLowerCase(Locale.ROOT);
    }

    private String stripExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return dotIndex < 0 ? fileName : fileName.substring(0, dotIndex);
    }

    private String sanitizeFileName(String fileName) {
        String normalized = Normalizer.normalize(fileName, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return normalized.isBlank() ? "file" : normalized;
    }
}
