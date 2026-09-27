package com.shailesh.quizweb.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentQuestionDto {

    private Long id;
    private String questionText;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    private Integer points;
}