package backend.controller;

import backend.dto.request.ReaderBookmarkNoteRequest;
import backend.dto.request.ReaderBookmarkRequest;
import backend.dto.response.ReaderBookmarkResponse;
import backend.service.ReaderBookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reader-bookmarks")
@RequiredArgsConstructor
public class ReaderBookmarkController {

    private final ReaderBookmarkService readerBookmarkService;

    @GetMapping
    public ResponseEntity<List<ReaderBookmarkResponse>> getBookmarks(@RequestParam Long userId, @RequestParam Long bookId) {
        return ResponseEntity.ok(readerBookmarkService.getBookmarks(userId, bookId));
    }

    @PostMapping
    public ResponseEntity<ReaderBookmarkResponse> createBookmark(@RequestBody ReaderBookmarkRequest request) {
        return ResponseEntity.ok(readerBookmarkService.createBookmark(request));
    }

    @PatchMapping("/{id}/note")
    public ResponseEntity<ReaderBookmarkResponse> updateNote(@PathVariable Long id, @RequestBody ReaderBookmarkNoteRequest request) {
        return ResponseEntity.ok(readerBookmarkService.updateNote(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookmark(@PathVariable Long id) {
        readerBookmarkService.deleteBookmark(id);
        return ResponseEntity.noContent().build();
    }
}
