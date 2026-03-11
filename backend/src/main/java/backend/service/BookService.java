package backend.service;

import backend.dto.response.BookResponse;
import backend.entity.Book;
import backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
                .map(b -> BookResponse.builder()
                        .id(b.getId())
                        .title(b.getTitle())
                        .price(b.getPrice())
                        .previewPercentage(b.getPreviewPercentage())
                        .description(b.getDescription())
                        .coverImage(b.getCoverImage())
                        .publishYear(b.getPublishYear())
                        .category(b.getCategory().getName())
                        .build())
                .collect(Collectors.toList());
    }
}