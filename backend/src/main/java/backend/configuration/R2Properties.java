package backend.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "r2")
public record R2Properties(
        String endpoint,
        String publicUrl,
        String accessKey,
        String secretKey,
        String bucket,
        String region) {
    public String resolvedRegion() {
        return region == null || region.isBlank() ? "auto" : region;
    }
}
