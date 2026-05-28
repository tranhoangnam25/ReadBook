package backend.service;

import backend.entity.Book;
import backend.exception.AppException;
import backend.exception.ErrorCode;
import backend.repository.BookRepository;
import backend.utils.VectorUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmbeddingService {

    private final BookRepository bookRepository;

    private final GeminiService geminiService;

    @Async
    @Transactional
    public void generateEmbedding(Long bookId){
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        log.info("Processing: {}", book.getTitle());
        processBookEmbedding(book);
    }


    @Async
    public void generateEmbeddings(){
        log.info("START EMBEDDING...");


        List<Book> books =
                bookRepository.findAll();

        for(Book book : books){
            log.info("Processing: {}", book.getTitle());
            processBookEmbedding(book);
            try { Thread.sleep(4500); } catch (InterruptedException ignored) {
                Thread.currentThread().interrupt();
            }

        }
    }
    @Transactional
    public void processBookEmbedding(Book book){
        try{
            String text = String.format("%s %s %s",
                    book.getTitle() != null ? book.getTitle() : "",
                    book.getDescription() != null ? book.getDescription() : "",
                    book.getSummaryContent() != null ? book.getSummaryContent() : ""
                    ).trim();

            if (text.isEmpty()) return;
            List<Double> embedding = geminiService.createEmbedding(text);

            if (embedding != null && !embedding.isEmpty()){
                book.setEmbedding(VectorUtils.toBytes(embedding));
                bookRepository.save(book);
                log.info("Embedded successfully: {}", book.getTitle());
            }
        } catch (Exception e){
            log.error("Error processing book: {}", book.getTitle(), e);
        }
    }

}