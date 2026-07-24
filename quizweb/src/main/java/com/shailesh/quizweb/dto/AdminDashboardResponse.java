package com.shailesh.quizweb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalTeachers;
    private long totalStudents;
    private long totalQuizzes;
    private long totalAttempts;
}