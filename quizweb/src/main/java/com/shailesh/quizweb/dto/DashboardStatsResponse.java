package com.shailesh.quizweb.dto;



import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsResponse {

    private long totalQuizzes;
    private long publishedQuizzes;
    private long draftQuizzes;

    private long totalAttempts;
    private long uniqueStudents;

    private double averageScore;

    private List<RecentAttemptResponse> recentAttempts;

    private List<QuizPerformanceResponse> topQuizzes;
}
