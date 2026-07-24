package com.shailesh.quizweb.dto;

import lombok.Data;

import java.util.List;

@Data
public class SubmitQuizRequest {

    private Long quizId;
    private List<AnswerRequest> answers;
}
