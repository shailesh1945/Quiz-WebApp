package com.shailesh.quizweb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecentAttemptResponse {

    private String studentName;
    private String quizTitle;
    private Integer score;
    private Double percentage;
    private String completedAt;
}
