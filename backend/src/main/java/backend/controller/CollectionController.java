package backend.controller;

import backend.dto.request.AddBookRequest;
import backend.dto.request.CollectionRequest;
import backend.dto.response.LibraryResponse;
import backend.entity.Collection;

import backend.service.CollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    @Autowired
    private CollectionService collectionService;

    @PostMapping("/create")
    public ResponseEntity<Collection> create(@RequestBody CollectionRequest request){
        return ResponseEntity.ok(collectionService.createCollection(
                request.getUserId(),
                request.getName()
        ));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Collection>> getCollectionsByUser(@PathVariable Long userId){
        return ResponseEntity.ok(collectionService.getCollectionsByUserId(userId));
    }

    @GetMapping("/{collectionId}/books")
    public ResponseEntity<List<LibraryResponse>> getBooks(@PathVariable Long collectionId){
        return ResponseEntity.ok(collectionService.getBooksInCollection(collectionId));
    }

    @PostMapping("/add-item")
    public ResponseEntity<?> addItem (@RequestBody AddBookRequest request){
        collectionService.addBookToCollection(
                request.getCollectionId(),
                request.getBookId()
        );
        return ResponseEntity.ok().build();
    }
}
