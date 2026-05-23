package backend.controller;

import backend.dto.request.ChatRequest;
import backend.dto.response.BookResponse;
import backend.dto.response.ChatResponse;
import backend.service.BookService;
import backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ChatResponse chat(
            @RequestBody ChatRequest request
    ){

        return chatService.chat(
                request.getMessage()
        );
    }
}