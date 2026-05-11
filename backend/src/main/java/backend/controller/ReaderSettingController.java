package backend.controller;

import backend.dto.request.ReaderSettingRequest;
import backend.dto.response.ReaderSettingResponse;
import backend.service.ReaderSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reader-settings")
@RequiredArgsConstructor
public class ReaderSettingController {

    private final ReaderSettingService readerSettingService;

    @GetMapping
    public ResponseEntity<ReaderSettingResponse> getSettings(@RequestParam Long userId) {
        return ResponseEntity.ok(readerSettingService.getByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<ReaderSettingResponse> saveSettings(@RequestBody ReaderSettingRequest request) {
        return ResponseEntity.ok(readerSettingService.saveSettings(request));
    }
}
