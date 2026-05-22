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
                        Map.of("role", "system", "content", "Bạn là chatbot tư vấn sách chuyên nghiệp. Hãy trả lời bằng tiếng Việt thân thiện."),
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

        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key="
                        + apiKey;

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        Map<String, Object> body =
                Map.of(
                        "content",
                        Map.of(
                                "parts",
                                List.of(
                                        Map.of(
                                                "text",
                                                text
                                        )
                                )
                        )
                );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(
                        body,
                        headers
                );

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        url,
                        request,
                        Map.class
                );

        Map embedding =
                (Map) response.getBody()
                        .get("embedding");

        return (List<Double>) embedding.get("values");
    }
}