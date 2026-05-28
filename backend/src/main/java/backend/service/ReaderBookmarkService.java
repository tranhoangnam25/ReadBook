package backend.service;

import backend.dto.request.ReaderBookmarkNoteRequest;
import backend.dto.request.ReaderBookmarkRequest;
import backend.dto.response.ReaderBookmarkResponse;
import backend.entity.Book;
import backend.entity.ReaderBookmark;
import backend.entity.User;
import backend.repository.BookRepository;
import backend.repository.ReaderBookmarkRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReaderBookmarkService {

    private final ReaderBookmarkRepository readerBookmarkRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public List<ReaderBookmarkResponse> getBookmarks(Long userId, Long bookId) {
        return readerBookmarkRepository.findByUser_IdAndBook_IdOrderByCreatedAtDesc(userId, bookId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ReaderBookmarkResponse createBookmark(ReaderBookmarkRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getUserId()));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found: " + request.getBookId()));

        ReaderBookmark bookmark = ReaderBookmark.builder()
                .user(user)
                .book(book)
                .cfiLocation(request.getCfiLocation())
                .progressPercentage(request.getProgressPercentage())
                .label(request.getLabel())
                .note(request.getNote())
                .build();

        return mapToResponse(readerBookmarkRepository.save(bookmark));
    }

    @Transactional
    public ReaderBookmarkResponse updateNote(Long id, ReaderBookmarkNoteRequest request) {
        ReaderBookmark bookmark = readerBookmarkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bookmark not found: " + id));
        bookmark.setNote(request.getNote());
        return mapToResponse(readerBookmarkRepository.save(bookmark));
    }

    @Transactional
    public void deleteBookmark(Long id) {
        readerBookmarkRepository.deleteById(id);
    }

    private ReaderBookmarkResponse mapToResponse(ReaderBookmark bookmark) {
        return ReaderBookmarkResponse.builder()
                .id(bookmark.getId())
                .bookId(bookmark.getBook().getId())
                .cfiLocation(bookmark.getCfiLocation())
                .progressPercentage(bookmark.getProgressPercentage())
                .label(bookmark.getLabel())
                .note(bookmark.getNote())
                .createdAt(bookmark.getCreatedAt())
                .build();
    }
}
