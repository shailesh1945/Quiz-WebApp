package com.shailesh.quizweb.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentResultHistoryDto {

    private String quizTitle;
    private Integer score;
    private Double percentage;
    private String attemptedAt;
}