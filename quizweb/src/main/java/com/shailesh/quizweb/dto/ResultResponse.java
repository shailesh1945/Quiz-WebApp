package com.shailesh.quizweb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResultResponse {

    private Integer score;
    private Integer totalMarks;
    private Double percentage;
    private Integer correctAnswers;
    private Integer wrongAnswers;
}
