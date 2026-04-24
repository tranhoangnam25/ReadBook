package backend.service;

import backend.dto.response.BookResponse;
import backend.entity.Book;
import backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    private final BookRepository bookRepository;

    
    @Transactional(readOnly = true)
    public List<BookResponse> getBestRating(int limit) {
        Pageable pageable = PageRequest.of(0, limit);

        return bookRepository.findBestRatings(pageable)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getBestSellers(int limit) {
        Pageable pageable = PageRequest.of(0, limit);

        return bookRepository.findBestSellers(pageable)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // RECOMMEND
    @Transactional(readOnly = true)
    public List<BookResponse> getRecommend() {
        return bookRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // SEARCH
    @Transactional(readOnly = true)
    public List<BookResponse> search(String keyword) {
        return bookRepository.findByTitleContaining(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID 
    @Transactional(readOnly = true)
    public BookResponse getById(Long id) {
        Book b = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        return mapToResponse(b);
    }

    // SEARCH
    @Transactional(readOnly = true)
    public Page<BookResponse> searchBooks(String keyword,
                                          String category,
                                          Double minPrice,
                                          Double maxPrice,
                                          int page,
                                          int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Book> books = bookRepository.searchBooks(
                keyword, category, minPrice, maxPrice, pageable
        );

        return books.map(this::mapToResponse);
    }

    // MAP ENTITY → DTO 
    private BookResponse mapToResponse(Book b) {
        double avg = 0.0;
        if (b.getReviews() != null && !b.getReviews().isEmpty()) {
            avg = b.getReviews().stream()
                    .mapToDouble(r -> r.getRating().doubleValue())
                    .average()
                    .orElse(0.0);
        }
        avg = Math.round(avg * 10.0) / 10.0;

        return BookResponse.builder()
                .id(b.getId())
                .title(b.getTitle())
                .price(b.getPrice())
                .previewPercentage(b.getPreviewPercentage())
                .description(b.getDescription())
                .coverImage(b.getCoverImage())
                .fileUrl(b.getFileUrl())
                .publishYear(b.getPublishYear())
                .authorName(
                        b.getAuthor() != null ? b.getAuthor().getName() : null
                )
                .category(
                        b.getCategory() != null ? b.getCategory().getName() : null
                )
                .averageRating(avg)
                .build();
    }
}
