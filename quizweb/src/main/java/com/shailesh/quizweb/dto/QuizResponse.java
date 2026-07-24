package com.shailesh.quizweb.dto;


import com.shailesh.quizweb.enums.Visibility;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuizResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private Integer timeLimit;
    private Integer passingScore;
    private String status;
    private Visibility visibility;
}
