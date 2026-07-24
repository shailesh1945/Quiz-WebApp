package com.shailesh.quizweb.service.impl;

import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.*;
import com.shailesh.quizweb.enums.Visibility;
import com.shailesh.quizweb.repository.QuizRepository;
import com.shailesh.quizweb.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;

    @Override
    public QuizResponse createQuiz(
            QuizRequest request,
            User teacher) {

        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .visibility(request.getVisibility())
                .category(request.getCategory())
                .difficulty(request.getDifficulty())
                .timeLimit(request.getTimeLimit())
                .passingScore(request.getPassingScore())
                .randomQuestions(request.getRandomQuestions())
                .instantResults(request.getInstantResults())
                .status(request.getStatus())
                .teacher(teacher)
                .createdAt(LocalDateTime.now())
                .build();

        quizRepository.save(quiz);

        return map(quiz);
    }

    @Override
    public QuizResponse updateQuiz(
            Long id,
            QuizRequest request,
            User teacher) {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow();

        if(!quiz.getTeacher().getId().equals(teacher.getId()))
            throw new RuntimeException("Unauthorized");

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setVisibility(request.getVisibility());
        quiz.setCategory(request.getCategory());
        quiz.setDifficulty(request.getDifficulty());
        quiz.setTimeLimit(request.getTimeLimit());
        quiz.setPassingScore(request.getPassingScore());
        quiz.setStatus(request.getStatus());

        quizRepository.save(quiz);

        return map(quiz);
    }

    @Override
    public void deleteQuiz(Long id, User teacher) {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow();

        if(!quiz.getTeacher().getId().equals(teacher.getId()))
            throw new RuntimeException("Unauthorized");

        quizRepository.delete(quiz);
    }

    @Override
    public Page<QuizResponse> getTeacherQuizzes(
            User teacher,
            int page,
            int size) {

        return quizRepository.findByTeacher(
                teacher,
                PageRequest.of(page,size)
        ).map(this::map);
    }

    @Override
    public QuizResponse getQuiz(Long id) {

        return map(
                quizRepository.findById(id).orElseThrow()
        );
    }

    private QuizResponse map(Quiz quiz) {
        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .category(quiz.getCategory())
                .difficulty(quiz.getDifficulty())
                .timeLimit(quiz.getTimeLimit())
                .passingScore(quiz.getPassingScore())
                .visibility(quiz.getVisibility())
                .status(quiz.getStatus())
                .build();
    }


    @Override
    public List<QuizResponse> getPublicQuizzes() {

        return quizRepository
                .findByVisibility(Visibility.PUBLIC)
                .stream()
                .map(this::map)
                .toList();
    }
}
