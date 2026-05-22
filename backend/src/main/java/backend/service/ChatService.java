package backend.service;

import backend.dto.response.BookResponse;
import backend.dto.response.ChatResponse;
import backend.entity.Book;
import backend.entity.ChatCache;
import backend.repository.BookRepository;
import backend.repository.ChatCacheRepository;
import backend.utils.VectorUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final GeminiService geminiService;
    private final BookRepository bookRepository;
    private final ChatCacheRepository chatCacheRepository;

    public ChatResponse chat(String userMessage){
        try{
            // 1. Lấy embedding của câu hỏi người dùng
            List<Double> userEmbeddingList = geminiService.createEmbedding(userMessage);
            double[] userVector = userEmbeddingList.stream().mapToDouble(Double::doubleValue).toArray();

            // 2. KIỂM TRA SEMANTIC CACHE
            List<ChatCache> allCaches = chatCacheRepository.findAll();
            Optional<ChatCache> cachedResult = allCaches.parallelStream()
                    .filter(c -> c.getEmbedding() != null)
                    .map(c -> {
                        double score = VectorUtils.cosineSimilarity(userVector, VectorUtils.fromBytes(c.getEmbedding()));
                        return new Object[]{c, score};
                    })
                    .filter(obj -> (double)obj[1] > 0.90)
                    .map(obj -> (ChatCache)obj[0])
                    .findFirst();

            if (cachedResult.isPresent()) {
                System.out.println("--- SEMANTIC CACHE HIT! ---");
                ChatCache cache = cachedResult.get();
                List<BookResponse> books = List.of();
                
                if (cache.getBookIds() != null && !cache.getBookIds().isEmpty()) {
                    List<Long> ids = Arrays.stream(cache.getBookIds().split(","))
                            .map(Long::parseLong).toList();
                    books = bookRepository.findAllById(ids).stream()
                            .map(b -> BookResponse.builder()
                                    .id(b.getId()).title(b.getTitle()).price(b.getPrice())
                                    .coverImage(b.getCoverImage()).description(b.getDescription())
                                    .build()).toList();
                }

                return ChatResponse.builder()
                        .message(cache.getAiResponse())
                        .books(books)
                        .build();
            }

            // 3. Nếu không có cache, tiến hành tìm sách
            List<Book> allBooks = bookRepository.findAll();
            
            class BookScore {
                Book book;
                double score;
                BookScore(Book book, double score) { this.book = book; this.score = score; }
            }

            List<Book> recommendedBooks = allBooks.parallelStream()
                    .filter(b -> b.getEmbedding() != null && b.getEmbedding().length > 0)
                    .map(b -> {
                        double[] bookVector = VectorUtils.fromBytes(b.getEmbedding());
                        double score = VectorUtils.cosineSimilarity(userVector, bookVector);
                        return new BookScore(b, score);
                    })
                    .filter(bs -> bs.score > 0.6)
                    .sorted((bs1, bs2) -> Double.compare(bs2.score, bs1.score))
                    .limit(4)
                    .map(bs -> bs.book)
                    .toList();

            if (recommendedBooks.isEmpty()) {
                return ChatResponse.builder()
                        .message("Xin lỗi, tôi không tìm thấy sách nào phù hợp.")
                        .books(List.of())
                        .build();
            }

            StringBuilder prompt = new StringBuilder();
            prompt.append("Bạn là chatbot tư vấn sách chuyên nghiệp. Dưới đây là danh sách các cuốn sách phù hợp nhất với yêu cầu của người dùng.\n");
            prompt.append("Hãy phân tích giá cả và mô tả để đưa ra lời khuyên chính xác. Nếu người dùng hỏi về giá, hãy ưu tiên so sánh giá giữa các cuốn sách này.\n\n");

            for(Book b : recommendedBooks){
                prompt.append(String.format("ID: %d\nTên: %s\nGiá: %,.0f VNĐ\nMô tả: %s\n\n", 
                    b.getId(), b.getTitle(), b.getPrice(), b.getDescription()));
            }
            prompt.append("Yêu cầu của người dùng: " + userMessage);

            String aiMessage = geminiService.askGemini(prompt.toString());

            // 4. LƯU VÀO CACHE (Bao gồm cả ID sách)
            String bookIds = recommendedBooks.stream()
                    .map(b -> b.getId().toString())
                    .collect(Collectors.joining(","));

            ChatCache newCache = ChatCache.builder()
                    .userQuery(userMessage)
                    .embedding(VectorUtils.toBytes(userEmbeddingList))
                    .aiResponse(aiMessage)
                    .bookIds(bookIds)
                    .build();
            chatCacheRepository.save(newCache);

            return ChatResponse.builder()
                    .message(aiMessage)
                    .books(recommendedBooks.stream()
                            .map(b -> BookResponse.builder()
                                    .id(b.getId())
                                    .title(b.getTitle())
                                    .price(b.getPrice())
                                    .coverImage(b.getCoverImage())
                                    .description(b.getDescription())
                                    .build())
                            .toList())
                    .build();

        }catch (Exception e){
            e.printStackTrace();
            return ChatResponse.builder().message("Đã có lỗi xảy ra khi xử lý yêu cầu của bạn.").books(List.of()).build();
        }
    }
}
