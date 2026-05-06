package backend.service;

import backend.dto.response.LibraryResponse;
import backend.entity.*;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;

    private final CollectionItemRepository itemRepository;

    private final UserRepository userRepository;

    private final BookRepository bookRepository;

    private final ReadingProgressRepository readingProgressRepository;

    
    @Transactional
    public Collection createCollection(Long userId, String name){
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_EXISTED));

        Collection collection = Collection.builder()
                .name(name)
                .description("Bo sưu tập mới")
                .user(user)
                .build();
        return collectionRepository.save(collection);
    }

    
    public List<LibraryResponse> getBooksInCollection(Long collectionId){
        Collection collection = collectionRepository.findById(collectionId).orElseThrow(()-> new AppException(ErrorCode.COLLECTION_NOT_FOUND));

        Long userId = collection.getUser().getId();
        List<CollectionItem> items = itemRepository.findAllByCollectionId(collectionId);

        return items.stream().map(item -> {
            Book book = item.getBook();

            ReadingProgress rp = readingProgressRepository
                    .findByUser_IdAndBook_Id(userId, book.getId())
                    .orElse(null);

            return LibraryResponse.builder()
                    .bookId(book.getId())
                    .title(book.getTitle())
                    .authorName(book.getAuthor() != null ? book.getAuthor().getName() : "Unknown")
                    .coverImage(book.getCoverImage())
                    .status(rp != null ? rp.getStatus() : "to_read")
                    .progress(
                            rp != null && rp.getProgressPercentage() != null
                                    ? rp.getProgressPercentage().multiply(new BigDecimal(100)).intValue()
                                    : 0
                    )
                    .fiLocation(rp != null ? rp.getFiLocation() : null)
                    .build();
        }).toList();
    }
    private LibraryResponse toLibraryResponse(ReadingProgress rp) {
        return LibraryResponse.builder()
                .progressId(rp.getId())
                .bookId(rp.getBook().getId())
                .title(rp.getBook().getTitle())
                .authorName(rp.getBook().getAuthor().getName())
                .coverImage(rp.getBook().getCoverImage())
                .status(rp.getStatus())
                .progress(
                        rp.getProgressPercentage() != null
                                ? rp.getProgressPercentage().multiply(new BigDecimal(100)).intValue()
                                : 0
                )
                .fiLocation(rp.getFiLocation())
                .build();
    }

    
    public void addBookToCollection(Long collectionId, Long bookId){
        if(itemRepository.existsByCollectionIdAndBookId(collectionId, bookId)){
            return;
        }
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new AppException(ErrorCode.COLLECTION_NOT_FOUND));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        CollectionItem newItem = CollectionItem.builder()
                .collection(collection)
                .book(book)
                .build();

        itemRepository.save(newItem);

    }

    public List<Collection> getCollectionsByUserId(Long userId){
        return collectionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void deleteCollection(Long id) {
        if (!collectionRepository.existsById(id)) {
            throw new RuntimeException("Collection not found");
        }

        
        itemRepository.deleteByCollectionId(id);

        
        collectionRepository.deleteById(id);
    }
}
