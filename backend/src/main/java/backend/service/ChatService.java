package backend.service;

import backend.dto.response.BookResponse;
import backend.dto.response.ChatResponse;
import backend.entity.Book;
import backend.entity.ChatCache;
import backend.entity.Sale;
import backend.repository.BookRepository;
import backend.repository.ChatCacheRepository;
import backend.repository.SaleRepository;
import backend.utils.VectorUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    private final SaleRepository saleRepository;

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
                    .filter(obj -> (double)obj[1] > 0.95) // Tăng độ chính xác cache để ưu tiên dữ liệu mới
                    .map(obj -> (ChatCache)obj[0])
                    .findFirst();

            if (cachedResult.isPresent()) {
                System.out.println("--- [DEBUG] SEMANTIC CACHE HIT! ---");
                ChatCache cache = cachedResult.get();
                List<BookResponse> books = List.of();
                
                if (cache.getBookIds() != null && !cache.getBookIds().isEmpty()) {
                    List<Long> ids = Arrays.stream(cache.getBookIds().split(","))
                            .map(Long::parseLong).toList();
                    books = bookRepository.findAllById(ids).stream()
                            .map(b -> {
                                Integer discount = saleRepository.findCurrentDiscountByBookId(b.getId(), LocalDateTime.now()).orElse(0);
                                BigDecimal salePrice = b.getPrice().multiply(BigDecimal.valueOf(100 - discount)).divide(BigDecimal.valueOf(100));
                                return BookResponse.builder()
                                        .id(b.getId()).title(b.getTitle()).price(b.getPrice())
                                        .coverImage(b.getCoverImage()).description(b.getDescription())
                                        .discountPercentage(discount)
                                        .salePrice(salePrice)
                                        .build();
                            }).toList();
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

            List<BookScore> scoredBooks = allBooks.parallelStream()
                    .filter(b -> b.getEmbedding() != null && b.getEmbedding().length > 0)
                    .map(b -> {
                        double[] bookVector = VectorUtils.fromBytes(b.getEmbedding());
                        double score = VectorUtils.cosineSimilarity(userVector, bookVector);
                        return new BookScore(b, score);
                    })
                    .filter(bs -> bs.score > 0.6)
                    .sorted((bs1, bs2) -> Double.compare(bs2.score, bs1.score))
                    .limit(4)
                    .toList();

            List<Book> recommendedBooks = scoredBooks.stream().map(bs -> bs.book).toList();

            // Lấy thông tin các đợt giảm giá đang diễn ra
            List<Sale> activeSales = saleRepository.findAllActiveSales(LocalDateTime.now());
            System.out.println("--- [DEBUG] Found " + activeSales.size() + " active sales ---");

            StringBuilder saleInfo = new StringBuilder();
            if (!activeSales.isEmpty()) {
                saleInfo.append("THÔNG TIN KHUYẾN MÃI HIỆN TẠI (HÃY ƯU TIÊN GIỚI THIỆU):\n");
                for (Sale s : activeSales) {
                    saleInfo.append(String.format("- Chiến dịch: %s, Giảm giá: %d%%, Ngày kết thúc: %s\n", 
                            s.getTitle(), s.getDiscountPercentage(), s.getEndDate().toString()));
                }
                saleInfo.append("\n");
            } else {
                saleInfo.append("Hiện tại không có chương trình giảm giá lớn nào.\n\n");
            }

            StringBuilder prompt = new StringBuilder();
            prompt.append(saleInfo);

            if (!recommendedBooks.isEmpty()) {
                prompt.append("Dưới đây là danh sách các cuốn sách phù hợp nhất với yêu cầu của người dùng.\n");
                prompt.append("HÃY PHÂN TÍCH GIÁ CẢ THẬT KỸ: Nếu sách có khuyến mãi, hãy giới thiệu cả giá gốc và giá sau giảm để thu hút khách hàng. So sánh ưu đãi giữa các sách nếu cần.\n\n");

                for(Book b : recommendedBooks){
                    Integer discount = saleRepository.findCurrentDiscountByBookId(b.getId(), LocalDateTime.now()).orElse(0);
                    double originalPrice = b.getPrice().doubleValue();
                    double finalPrice = originalPrice * (100 - discount) / 100.0;
                    
                    if (discount > 0) {
                        prompt.append(String.format("ID: %d\nTên: %s\nGiá gốc: %,.0f VNĐ\nƯU ĐÃI: GIẢM %d%%\nGiá hiện tại: %,.0f VNĐ\nMô tả: %s\n\n",
                                b.getId(), b.getTitle(), originalPrice, discount, finalPrice, b.getDescription()));
                    } else {
                        prompt.append(String.format("ID: %d\nTên: %s\nGiá: %,.0f VNĐ\nMô tả: %s\n\n",
                                b.getId(), b.getTitle(), originalPrice, b.getDescription()));
                    }
                }
            } else {
                prompt.append("Người dùng đang hỏi về hệ thống hoặc tìm kiếm sách nhưng không có kết quả phù hợp.\n");
                prompt.append("Nếu người dùng hỏi về khuyến mãi, hãy dựa vào danh sách khuyến mãi ở trên để trả lời.\n\n");
            }
            
            prompt.append("CÂU HỎI NGƯỜI DÙNG: " + userMessage + "\n\n");
            prompt.append("HƯỚNG DẪN TRẢ LỜI: Hãy trả lời thân thiện, nhiệt tình. Nếu có khuyến mãi, hãy nhắc đến nó như một tin vui cho người dùng.");

            System.out.println("--- [DEBUG] FINAL PROMPT TO AI ---\n" + prompt.toString());
            System.out.println("-----------------------------------");

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
                            .map(b -> {
                                Integer discount = saleRepository.findCurrentDiscountByBookId(b.getId(), LocalDateTime.now()).orElse(0);
                                BigDecimal salePrice = b.getPrice().multiply(BigDecimal.valueOf(100 - discount)).divide(BigDecimal.valueOf(100));
                                return BookResponse.builder()
                                        .id(b.getId())
                                        .title(b.getTitle())
                                        .price(b.getPrice())
                                        .salePrice(salePrice)
                                        .discountPercentage(discount)
                                        .coverImage(b.getCoverImage())
                                        .description(b.getDescription())
                                        .build();
                            })
                            .toList())
                    .build();

        }catch (Exception e){
            e.printStackTrace();
            return ChatResponse.builder().message("Đã có lỗi xảy ra khi xử lý yêu cầu của bạn.").books(List.of()).build();
        }
    }
}
