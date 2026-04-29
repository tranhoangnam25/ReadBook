package backend.service;

import backend.dto.response.LibraryResponse;
import backend.entity.Book;
import backend.entity.Collection;
import backend.entity.CollectionItem;
import backend.entity.User;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.repository.BookRepository;
import backend.repository.CollectionItemRepository;
import backend.repository.CollectionRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;

    private final CollectionItemRepository itemRepository;

    private final UserRepository userRepository;

    private final BookRepository bookRepository;

    // tao collection trống
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

    //lay danh sach 1 col cu the
    public List<LibraryResponse> getBooksInCollection(Long collectionId){
        List<CollectionItem> items = itemRepository.findAllByCollectionId(collectionId);

        return items.stream().map(item -> {
            Book book = item.getBook();
            return LibraryResponse.builder()
                    .bookId(book.getId())
                    .title(book.getTitle())
                    .authorName(book.getAuthor() != null ? book.getAuthor().getName() : "Unknown")
                    .coverImage(book.getCoverImage())
                    .build();
        }).collect(Collectors.toList());
    }

    // them sach vao bo suu tap
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
}
