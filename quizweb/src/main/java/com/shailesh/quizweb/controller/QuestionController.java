package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.repository.UserRepository;
import com.shailesh.quizweb.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/quizzes")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;
    private final UserRepository userRepository;

    private User currentUser(
            org.springframework.security.core.userdetails.User principal
    ) {
        return userRepository
                .findByEmail(principal.getUsername())
                .orElseThrow();
    }

    @PostMapping("/{quizId}/questions")
    public QuestionResponse add(
            @PathVariable Long quizId,
            @RequestBody QuestionRequest request,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {

        return questionService.addQuestion(
                quizId,
                request,
                currentUser(principal)
        );
    }

    @GetMapping("/{quizId}/questions")
    public List<QuestionResponse> list(
            @PathVariable Long quizId,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {

        return questionService.getQuestions(
                quizId,
                currentUser(principal)
        );
    }

    @PutMapping("/questions/{id}")
    public QuestionResponse update(
            @PathVariable Long id,
            @RequestBody QuestionRequest request,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {

        return questionService.updateQuestion(
                id,
                request,
                currentUser(principal)
        );
    }

    @DeleteMapping("/questions/{id}")
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {

        questionService.deleteQuestion(
                id,
                currentUser(principal)
        );
    }
}