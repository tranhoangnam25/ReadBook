package backend.controller;

import backend.dto.request.ReaderHighlightNoteRequest;
import backend.dto.request.ReaderHighlightRequest;
import backend.dto.response.ReaderHighlightResponse;
import backend.service.ReaderHighlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reader-highlights")
@RequiredArgsConstructor
public class ReaderHighlightController {

    private final ReaderHighlightService readerHighlightService;

    @GetMapping
    public ResponseEntity<List<ReaderHighlightResponse>> getHighlights(@RequestParam Long userId, @RequestParam Long bookId) {
        return ResponseEntity.ok(readerHighlightService.getHighlights(userId, bookId));
    }

    @PostMapping
    public ResponseEntity<ReaderHighlightResponse> createHighlight(@RequestBody ReaderHighlightRequest request) {
        return ResponseEntity.ok(readerHighlightService.createHighlight(request));
    }

    @PatchMapping("/{id}/note")
    public ResponseEntity<ReaderHighlightResponse> updateNote(@PathVariable Long id, @RequestBody ReaderHighlightNoteRequest request) {
        return ResponseEntity.ok(readerHighlightService.updateNote(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHighlight(@PathVariable Long id) {
        readerHighlightService.deleteHighlight(id);
        return ResponseEntity.noContent().build();
    }
}
