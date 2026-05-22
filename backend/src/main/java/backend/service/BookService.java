package backend.service;

import backend.dto.request.CreateBookRequest;
import backend.dto.request.UpdateBookRequest;
import backend.dto.response.BookResponse;
import backend.entity.Author;
import backend.entity.Book;
import backend.entity.Category;
import backend.repository.AuthorRepository;
import backend.repository.BookRepository;
import backend.repository.CategoryRepository;
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
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

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

    @Transactional(readOnly = true)
    public List<BookResponse> getRecommend() {
        return bookRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookResponse> search(String keyword) {
        return bookRepository.findByTitleContaining(keyword)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookResponse getById(Long id) {
        Book b = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        return mapToResponse(b);
    }

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

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Book book = Book.builder()
                .title(request.getTitle())
                .price(request.getPrice())
                .previewPercentage(request.getPreviewPercentage())
                .description(request.getDescription())
                .coverImage(request.getCoverImage())
                .fileUrl(request.getFileUrl())
                .publishYear(request.getPublishYear())
                .author(author)
                .category(category)
                .build();

        return mapToResponse(bookRepository.save(book));
    }

    @Transactional
    public BookResponse updateBook(Long id, UpdateBookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(request.getTitle());
        book.setPrice(request.getPrice());
        book.setPreviewPercentage(request.getPreviewPercentage());
        book.setDescription(request.getDescription());
        book.setCoverImage(request.getCoverImage());
        book.setFileUrl(request.getFileUrl());
        book.setPublishYear(request.getPublishYear());

        return mapToResponse(bookRepository.save(book));
    }

    private BookResponse mapToResponse(Book b) {
        double avg = 0.0;

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
    public BookResponse toResponseSafe(Book b) {
        return mapToResponse(b);
    }
}
