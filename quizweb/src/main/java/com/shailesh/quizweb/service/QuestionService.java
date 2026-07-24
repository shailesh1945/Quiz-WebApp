package com.shailesh.quizweb.service;


import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.User;

import java.util.List;

public interface QuestionService {

    QuestionResponse addQuestion(
            Long quizId,
            QuestionRequest request,
            User teacher
    );

    List<QuestionResponse> getQuestions(
            Long quizId,
            User teacher
    );

    QuestionResponse updateQuestion(
            Long id,
            QuestionRequest request,
            User teacher
    );

    void deleteQuestion(
            Long id,
            User teacher
    );

    void bulkAdd(
            Long quizId,
            BulkQuestionRequest request,
            User teacher
    );
}
