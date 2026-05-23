package backend.controller;

import backend.service.EmbeddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    @GetMapping("/books/embedding")
    public String embedding(){

        embeddingService.generateEmbeddings();

        return "Embedding generation started. Check server logs for progress.";
    }
}
