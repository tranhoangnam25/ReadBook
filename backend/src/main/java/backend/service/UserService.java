package backend.service;

import backend.dto.request.ChangePasswordRequest;
import backend.dto.request.UserUpdateRequest;
import backend.dto.response.HistoryResponse;
import backend.dto.response.ReadingResponse;
import backend.entity.Book;
import backend.entity.ReadingProgress;
import backend.entity.User;
import backend.repository.ReadingProgressRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class UserService {
    @Autowired
    private final UserRepository userRepository;
    private final backend.repository.BookRepository bookRepository;
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

        return ReadingResponse.builder()
                .id(b.getId())
                .title(b.getTitle())
                .author(b.getAuthor() != null ? b.getAuthor().getName() : "Unknown")
                .coverUrl(b.getCoverImage() != null ? b.getCoverImage() : "https://picsum.photos/200/300")
                .progressPercentage(p.getProgressPercentage())
                .cfiLocation(p.getFiLocation())
                .build();
    }

    public ReadingResponse getReadingProgress(Long userId, Long bookId) {
        return repo.findByUser_IdAndBook_Id(userId, bookId).map(p -> {
            Book b = p.getBook();
            return ReadingResponse.builder()
                .id(b.getId())
                .title(b.getTitle())
                .author(b.getAuthor() != null ? b.getAuthor().getName() : "Unknown")
                .coverUrl(b.getCoverImage() != null ? b.getCoverImage() : "https://picsum.photos/200/300")
                .progressPercentage(p.getProgressPercentage())
                .cfiLocation(p.getFiLocation())
                .build();
        }).orElse(null);
    }

    public void saveReadingProgress(Long userId, Long bookId, String cfiLocation, java.math.BigDecimal progressPercentage) {
        ReadingProgress p = repo.findByUser_IdAndBook_Id(userId, bookId).orElse(new ReadingProgress());
        
        if (p.getId() == null) {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));
            p.setUser(user);
            p.setBook(book);
        }
        
        p.setFiLocation(cfiLocation);
        p.setProgressPercentage(progressPercentage);
        p.setStatus("reading");
        p.setUpdatedAt(java.time.LocalDateTime.now());
        
        repo.save(p);
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

    public User updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID:" + userId));

        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            user.setUsername(request.getUsername());
        }

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            user.setEmail(request.getEmail());
        }

        return userRepository.save(user);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID:" + userId));

        if (request.getCurrentPassword() == null) {
            throw new RuntimeException("Phải nhập mật khẩu hiện tại!");
        }
        if (!request.getCurrentPassword().equals(user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng!");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("Mật khẩu mới phải >= 6 ký tự");
        }
        if (request.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Mật khẩu mới không được trùng mật khẩu cũ");
        }
        user.setPassword(request.getPassword());
        userRepository.save(user);
    }
}

