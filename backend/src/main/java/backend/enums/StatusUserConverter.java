package backend.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatusUserConverter implements AttributeConverter<StatusUser, String> {

    @Override
    public String convertToDatabaseColumn(StatusUser attribute) {
        if (attribute == null) return null;
        return attribute.name().toLowerCase();
    }

    @Override
    public StatusUser convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return StatusUser.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            return StatusUser.ACTIVE;
        }
    }
}
