package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.repository.UserRepository;
import com.shailesh.quizweb.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final UserRepository userRepository;

    private User currentUser(
            org.springframework.security.core.userdetails.User principal
    ){
        return userRepository
                .findByEmail(principal.getUsername())
                .orElseThrow();
    }

    @PostMapping
    public QuizResponse create(
            @RequestBody QuizRequest request,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ){
        return quizService.createQuiz(
                request,
                currentUser(principal)
        );
    }

    @PutMapping("/{id}")
    public QuizResponse update(
            @PathVariable Long id,
            @RequestBody QuizRequest request,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ){
        return quizService.updateQuiz(
                id,
                request,
                currentUser(principal)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ){
        quizService.deleteQuiz(
                id,
                currentUser(principal)
        );
    }

    @GetMapping
    public Page<QuizResponse> myQuizzes(
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="10") int size
    ){
        return quizService.getTeacherQuizzes(
                currentUser(principal),
                page,
                size
        );
    }

    @GetMapping("/{id}")
    public QuizResponse detail(
            @PathVariable Long id
    ){
        return quizService.getQuiz(id);
    }

    @GetMapping("/student/quizzes")
    public List<QuizResponse> publicQuizzes() {
        return quizService.getPublicQuizzes();
    }
}