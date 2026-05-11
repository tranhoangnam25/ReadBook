package backend.service;

import backend.dto.request.ReaderSettingRequest;
import backend.dto.response.ReaderSettingResponse;
import backend.entity.ReaderSetting;
import backend.entity.User;
import backend.enums.BackgroundColor;
import backend.enums.FontFamily;
import backend.repository.ReaderSettingRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReaderSettingService {

    private final ReaderSettingRepository readerSettingRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReaderSettingResponse getByUserId(Long userId) {
        try {
            ReaderSetting settings = readerSettingRepository.findByUser_Id(userId)
                    .orElseGet(() -> createDefault(userId));
            return mapToResponse(settings);
        } catch (Exception e) {
            log.warn("Invalid reader settings for userId={}, resetting to default. Cause: {}", userId, e.getMessage());
            return resetToDefault(userId);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ReaderSettingResponse resetToDefault(Long userId) {
        readerSettingRepository.forceDeleteByUserId(userId);
        return mapToResponse(createDefault(userId));
    }

    @Transactional
    public ReaderSettingResponse saveSettings(ReaderSettingRequest request) {
        try {
            ReaderSetting settings = readerSettingRepository.findByUser_Id(request.getUserId())
                    .orElseGet(() -> {
                        User user = userRepository.findById(request.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));
                        return ReaderSetting.builder().user(user).build();
                    });

            settings.setFontFamily(request.getFontFamily());
            settings.setFontSize(request.getFontSize());
            settings.setLineHeight(request.getLineHeight());
            settings.setBackgroundColor(request.getBackgroundColor());

            return mapToResponse(readerSettingRepository.save(settings));
        } catch (Exception e) {
            log.warn("Corrupt settings for userId={}, recreating. Cause: {}", request.getUserId(), e.getMessage());
            return resetAndSave(request);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ReaderSettingResponse resetAndSave(ReaderSettingRequest request) {
        readerSettingRepository.forceDeleteByUserId(request.getUserId());
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));
        ReaderSetting fresh = ReaderSetting.builder()
                .user(user)
                .fontFamily(request.getFontFamily())
                .fontSize(request.getFontSize())
                .lineHeight(request.getLineHeight())
                .backgroundColor(request.getBackgroundColor())
                .build();
        return mapToResponse(readerSettingRepository.save(fresh));
    }

    private ReaderSetting createDefault(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return readerSettingRepository.save(ReaderSetting.builder()
                .user(user)
                .fontFamily(FontFamily.DEFAULT)
                .fontSize(18)
                .lineHeight(1.8)
                .backgroundColor(BackgroundColor.WHITE)
                .build());
    }

    private ReaderSettingResponse mapToResponse(ReaderSetting entity) {
        return ReaderSettingResponse.builder()
                .fontFamily(entity.getFontFamily())
                .fontSize(entity.getFontSize())
                .lineHeight(entity.getLineHeight())
                .backgroundColor(entity.getBackgroundColor())
                .build();
    }
}
