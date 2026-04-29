package backend.controller;

import backend.dto.response.LibraryResponse;
import backend.service.ReadingProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@Tag(name = "Library", description = "Quản lý thư viện sách của người dùng") // Thêm tag cho Swagger
public class LibraryController {
    @Autowired
    private ReadingProgressService readingProgressService;

    @Operation(summary = "Lấy danh sách sách trong thư viện theo userId")
    @GetMapping(value = "/{userId}", produces = "application/json") // Chỉ định rõ trả về JSON
    public ResponseEntity<List<LibraryResponse>> getLibrary(@PathVariable Long userId){
        return ResponseEntity.ok(readingProgressService.getLibrary(userId));
    }
}
