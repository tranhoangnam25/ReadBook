package backend.service;

import backend.dto.response.HistoryResponse;
import backend.dto.response.ReadingResponse;
import backend.entity.Book;
import backend.entity.ReadingProgress;
import backend.entity.User;
import backend.repository.ReadingProgressRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class UserService {

    private final UserRepository userRepository;
    private final ReadingProgressRepository repo;

    // ================= USER CRUD =================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ================= 📖 READING =================
    public ReadingResponse getReading(Long userId) {

        ReadingProgress p = repo.findByUser_IdAndStatus(userId, "reading");

        if (p == null) return null;

        Book b = p.getBook();

        int progress = (p.getTotalPages() == 0)
                ? 0
                : (p.getCurrentPage() * 100) / p.getTotalPages();

        return ReadingResponse.builder()
                .id(b.getId())
                .title(b.getTitle())
                .author(
                        b.getAuthor() != null ? b.getAuthor().getName() : "Unknown"
                )
                .coverUrl(
                        b.getCoverImage() != null
                                ? b.getCoverImage()
                                : "https://picsum.photos/200/300"
                )
                .progress(progress)
                .currentPage(p.getCurrentPage())
                .totalPages(p.getTotalPages())
                .build();
    }

    // ================= 📜 HISTORY =================
    public List<HistoryResponse> getHistory(Long userId) {

        List<ReadingProgress> list =
                repo.findByUser_IdAndStatusOrderByUpdatedAtDesc(userId, "completed");

        return list.stream()
                .map(p -> HistoryResponse.builder()
                        .id(p.getBook().getId())
                        .title(p.getBook().getTitle())
                        .finishedAt(p.getUpdatedAt().toString())
                        .build())
                .toList();
    }
}
