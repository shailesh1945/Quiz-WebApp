package com.shailesh.quizweb.dto;

import com.shailesh.quizweb.enums.Visibility;
import lombok.Data;

@Data
public class QuizRequest {

    private String title;
    private String description;
    private String category;
    private String difficulty;
    private Integer timeLimit;
    private Integer passingScore;
    private Boolean randomQuestions;
    private Boolean instantResults;
    private String status;
    private Visibility visibility;
}
