package backend.controller;

import backend.service.EmbeddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    @GetMapping("/embedding")
    public String embedding(){

        embeddingService.generateEmbeddings();

        return "DONE";
    }
}
