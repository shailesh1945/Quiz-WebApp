package com.shailesh.quizweb.service;


import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.Result;
import com.shailesh.quizweb.entity.User;

import java.util.List;

public interface StudentQuizService {

    List<StudentQuestionResponse> startQuiz(
            Long quizId,
            User student
    );

    ResultResponse submitQuiz(
            SubmitQuizRequest request,
            User student
    );

//    List<QuizResponse> getPublicQuizzes();

    List<Result> leaderboard(Long quizId);
}