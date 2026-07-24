package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.Result;
import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.repository.UserRepository;
import com.shailesh.quizweb.service.QuizService;
import com.shailesh.quizweb.service.StudentQuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/quizzes")
@RequiredArgsConstructor
public class StudentQuizController {

    private final StudentQuizService service;
    private final UserRepository userRepository;
    private final QuizService quizService;

    private User currentUser(
            org.springframework.security.core.userdetails.User principal
    ) {
        return userRepository
                .findByEmail(principal.getUsername())
                .orElseThrow();
    }

    @GetMapping
    public List<QuizResponse> getPublicQuizzes() {
        return quizService.getPublicQuizzes();
    }

    @GetMapping("/{quizId}/start")
    public List<StudentQuestionResponse> start(
            @PathVariable Long quizId,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {
        return service.startQuiz(
                quizId,
                currentUser(principal)
        );
    }

    @PostMapping("/submit")
    public ResultResponse submit(
            @RequestBody SubmitQuizRequest request,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {
        return service.submitQuiz(
                request,
                currentUser(principal)
        );
    }

    @GetMapping("/{quizId}/leaderboard")
    public List<Result> leaderboard(
            @PathVariable Long quizId
    ) {
        return service.leaderboard(quizId);
    }
}