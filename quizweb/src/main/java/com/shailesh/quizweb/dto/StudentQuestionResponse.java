package com.shailesh.quizweb.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentQuestionResponse {

    private Long id;
    private String questionText;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    private Integer points;
}
