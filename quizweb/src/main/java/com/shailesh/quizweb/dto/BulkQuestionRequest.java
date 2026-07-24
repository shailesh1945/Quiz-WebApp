package com.shailesh.quizweb.dto;

import lombok.Data;
import java.util.List;

@Data
public class BulkQuestionRequest {

    private List<QuestionRequest> questions;
}