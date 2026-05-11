package backend.dto.response;

import backend.entity.Book;
import jakarta.persistence.*;
import lombok.Builder;

import java.time.LocalDateTime;

public class ChapterResponse {
    private Long id;
    private Integer chapterNumber;
    private String chapterTitle;
    private String url;
}
