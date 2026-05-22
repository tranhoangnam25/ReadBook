package backend.dto.response;

import backend.entity.Candidate;
import lombok.Data;

import java.util.List;

@Data
public class GeminiResponse {

    private List<Candidate> candidates;
}