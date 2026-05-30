package backend.service;

import backend.dto.response.LibraryResponse;
import backend.dto.response.ReadingResponse;
import backend.entity.ReadingProgress;
import backend.repository.ReadingProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReadingProgressService {
    @Autowired
    private ReadingProgressRepository readingProgressRepository;

    public List<LibraryResponse> getLibrary(Long userId){
        List<ReadingProgress> list = readingProgressRepository.findAllByUserIdWithBook(userId);

        return list.stream().map(rp -> LibraryResponse.builder()
                .progressId(rp.getId())
                .bookId(rp.getBook().getId())
                .title(rp.getBook().getTitle())
                .authorName(rp.getBook().getAuthor().getName())
                .coverImage(rp.getBook().getCoverImage())
                .status(rp.getStatus())
                .progress(
                        rp.getProgressPercentage() != null
                                ? rp.getProgressPercentage().multiply(new BigDecimal(100)).intValue()
                                : 0
                )
                .fiLocation(rp.getFiLocation())
                .build()
        ).collect(Collectors.toList());
    }

    public List<ReadingResponse> getHistory(Long userId) {
        List<ReadingProgress> progressList = readingProgressRepository.findReadingHistoryByUserId(userId);
        
        return progressList.stream().map(rp -> {
            // Map thủ công từ Entity sang DTO
            return new ReadingResponse(
                rp.getBook().getId(),
                rp.getBook().getTitle(),
                rp.getBook().getAuthor().getName(), // Kiểm tra đúng tên hàm getter trong Book.java
                rp.getBook().getCoverImage(),
                rp.getProgressPercentage(),
                rp.getFiLocation()
            );
        }).collect(Collectors.toList());
    }

}
