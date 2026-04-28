package backend.controller;

import backend.dto.response.LibraryResponse;
import backend.entity.ReadingProgress;
import backend.repository.ReadingProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/library")
public class LibraryController {
    @Autowired
    private ReadingProgressRepository readingProgressRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<LibraryResponse>> getMyLibrary(@PathVariable Long userId) {
        List<ReadingProgress> progressList = readingProgressRepository.findLibraryByUserId(userId);

        List<LibraryResponse> response = progressList.stream().map(rp -> LibraryResponse.builder()
                .progressId(rp.getId())
                .bookId(rp.getBook().getId())
                .title(rp.getBook().getTitle())
                .coverImage(rp.getBook().getCoverImage())
                .status(rp.getStatus())
                .progress(rp.getProgressPercentage())
                .lastLocation(rp.getFiLocation())
                .build()
        ).toList();

        return ResponseEntity.ok(response);
    }
}
