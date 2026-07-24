package com.shailesh.quizweb.service;

import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QuizService {

    QuizResponse createQuiz(
            QuizRequest request,
            User teacher
    );

    QuizResponse updateQuiz(
            Long id,
            QuizRequest request,
            User teacher
    );

    void deleteQuiz(Long id, User teacher);

    Page<QuizResponse> getTeacherQuizzes(
            User teacher,
            int page,
            int size
    );

    QuizResponse getQuiz(Long id);

    List<QuizResponse> getPublicQuizzes();
}