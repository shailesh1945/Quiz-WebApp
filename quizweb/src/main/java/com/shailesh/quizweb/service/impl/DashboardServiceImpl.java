package com.shailesh.quizweb.service.impl;


import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.*;
import com.shailesh.quizweb.repository.*;
import com.shailesh.quizweb.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {

    private final QuizRepository quizRepository;
    private final ResultRepository resultRepository;

    @Override
    public DashboardStatsResponse getTeacherDashboard(
            User teacher) {

        long totalQuizzes =
                quizRepository.countByTeacher(teacher);

        long published =
                quizRepository.countByTeacherAndStatus(
                        teacher, "PUBLISHED");

        long draft =
                quizRepository.countByTeacherAndStatus(
                        teacher, "DRAFT");

        long totalAttempts =
                resultRepository.countByQuizTeacher(teacher);

        long uniqueStudents =
                resultRepository.countUniqueStudents(
                        teacher);

        List<Result> allResults =
                resultRepository.findByQuizTeacher(
                        teacher);

        double avgScore = allResults.stream()
                .mapToInt(Result::getScore)
                .average()
                .orElse(0);

        List<RecentAttemptResponse> recent =
                resultRepository
                        .findTop5ByQuizTeacherOrderByCompletedAtDesc(
                                teacher)
                        .stream()
                        .map(r -> RecentAttemptResponse.builder()
                                .studentName(
                                        r.getStudent().getFullName())
                                .quizTitle(
                                        r.getQuiz().getTitle())
                                .score(r.getScore())
                                .percentage(r.getPercentage())
                                .completedAt(
                                        r.getCompletedAt().toString())
                                .build())
                        .toList();

        List<QuizPerformanceResponse> top =
                quizRepository.findTop5ByTeacher(teacher)
                        .stream()
                        .map(q -> {

                            List<Result> quizResults =
                                    resultRepository
                                            .findByQuiz(q);

                            double average =
                                    quizResults.stream()
                                            .mapToInt(Result::getScore)
                                            .average()
                                            .orElse(0);

                            return QuizPerformanceResponse
                                    .builder()
                                    .quizTitle(q.getTitle())
                                    .attempts(
                                            quizResults.size())
                                    .averageScore(average)
                                    .build();
                        })
                        .sorted((a,b) ->
                                Double.compare(
                                        b.getAverageScore(),
                                        a.getAverageScore()))
                        .toList();

        return DashboardStatsResponse.builder()
                .totalQuizzes(totalQuizzes)
                .publishedQuizzes(published)
                .draftQuizzes(draft)
                .totalAttempts(totalAttempts)
                .uniqueStudents(uniqueStudents)
                .averageScore(avgScore)
                .recentAttempts(recent)
                .topQuizzes(top)
                .build();
    }
}
