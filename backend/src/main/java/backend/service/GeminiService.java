package backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final RestTemplate restTemplate =
            new RestTemplate();

    public String askGemini(String prompt){
        // Chuyển hẳn sang dùng Groq vì tốc độ và độ ổn định cao hơn
        return askGroq(prompt);
    }

    public String askGroq(String prompt) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        Map<String, Object> body = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of("role", "system", "content",
                                "Bạn là chatbot hỗ trợ khách hàng của hệ thống ReadBook. " +
                                "Nhiệm vụ của bạn là tư vấn sách và hướng dẫn người dùng sử dụng các chức năng của hệ thống. " +
                                "Thông tin hướng dẫn: " +
                                "1. Đăng ký: Nhấn nút 'Đăng ký' trên thanh Navbar, điền email, tên và mật khẩu. " +
                                "2. Đăng nhập: Nhấn nút 'Đăng nhập', nhập tài khoản và mật khẩu đã đăng ký. " +
                                "3. Đổi mật khẩu: Sau khi đăng nhập, vào trang cá nhân (Profile) hoặc nhấn vào Avatar, chọn 'Đổi mật khẩu'. " +
                                "4. Mua sách: Chọn sách muốn mua, nhấn 'Mua ngay' hoặc 'Thanh toán' và làm theo hướng dẫn thanh toán QR. " +
                                "Hãy trả lời bằng tiếng Việt thân thiện, ngắn gọn và hữu ích."),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7
        );

        try {
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            List choices = (List) response.getBody().get("choices");
            Map choice = (Map) choices.get(0);
            Map message = (Map) choice.get("message");

            return message.get("content").toString();
        } catch (Exception e) {
            System.err.println("Groq Error: " + e.getMessage());
            return "Xin lỗi, hệ thống tư vấn đang bận. Vui lòng thử lại sau giây lát.";
        }
    }

    public List<Double> createEmbedding(String text) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            System.err.println("ERROR: Gemini API Key is missing. Please check your environment variables or .env file.");
            return List.of();
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        Map<String, Object> body = Map.of(
                "content", Map.of(
                        "parts", List.of(
                                Map.of("text", text)
                        )
                )
        );

        try {
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("embedding")) {
                Map embedding = (Map) response.getBody().get("embedding");
                return (List<Double>) embedding.get("values");
            }
            return List.of();
        } catch (Exception e) {
            System.err.println("Gemini Embedding Error: " + e.getMessage());
            return List.of();
        }
    }
}
