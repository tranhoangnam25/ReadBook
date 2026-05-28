package backend.service;

import backend.dto.request.ReaderHighlightRequest;
import backend.dto.response.ReaderHighlightResponse;
import backend.entity.Book;
import backend.entity.ReaderHighlight;
import backend.entity.User;
import backend.repository.BookRepository;
import backend.repository.ReaderHighlightRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReaderHighlightService {

    private final ReaderHighlightRepository readerHighlightRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public List<ReaderHighlightResponse> getHighlights(Long userId, Long bookId) {
        return readerHighlightRepository.findByUser_IdAndBook_IdOrderByCreatedAtDesc(userId, bookId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ReaderHighlightResponse createHighlight(ReaderHighlightRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found: " + request.getBookId()));

        ReaderHighlight highlight = ReaderHighlight.builder()
                .user(user)
                .book(book)
                .cfiRange(request.getCfiRange())
                .text(request.getText())
                .color(request.getColor() == null || request.getColor().isBlank() ? "#facc15" : request.getColor())
                .build();

        return mapToResponse(readerHighlightRepository.save(highlight));
    }

    @Transactional
    public void deleteHighlight(Long id) {
        readerHighlightRepository.deleteById(id);
    }

    private ReaderHighlightResponse mapToResponse(ReaderHighlight highlight) {
        return ReaderHighlightResponse.builder()
                .id(highlight.getId())
                .bookId(highlight.getBook().getId())
                .cfiRange(highlight.getCfiRange())
                .text(highlight.getText())
                .color(highlight.getColor())
                .createdAt(highlight.getCreatedAt())
                .build();
    }
}
