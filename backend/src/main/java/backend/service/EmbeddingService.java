package backend.service;

import backend.entity.Book;
import backend.repository.BookRepository;
import backend.utils.VectorUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmbeddingService {

    private final BookRepository bookRepository;

    private final GeminiService geminiService;


    @Transactional
    public void generateEmbeddings(){
        System.out.println("START EMBEDDING...");


        ObjectMapper mapper =
                new ObjectMapper();

        List<Book> books =
                bookRepository.findAll();

        for(Book book : books){
            System.out.println("Processing: " + book.getTitle());

            try{
                String text = book.getTitle() + " " +
                                book.getDescription() + " " +
                                book.getSummaryContent();

                List<Double> embedding = geminiService.createEmbedding(text);

                book.setEmbedding(VectorUtils.toBytes(embedding));
                bookRepository.save(book);


                System.out.println("Done: " + book.getTitle());

                Thread.sleep(4500); 

            }catch (Exception e){
                System.err.println("Error at book: " + book.getTitle());
                e.printStackTrace();
                // If it's a rate limit error, wait longer
                try { Thread.sleep(10000); } catch (InterruptedException ignored) {}
            }
        }
    }
}