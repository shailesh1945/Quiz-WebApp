package com.shailesh.quizweb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuizPerformanceResponse {

    private String quizTitle;
    private long attempts;
    private double averageScore;
}
