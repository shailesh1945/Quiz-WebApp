package com.shailesh.quizweb.service;



import com.shailesh.quizweb.dto.DashboardStatsResponse;
import com.shailesh.quizweb.entity.User;

public interface DashboardService {

    DashboardStatsResponse getTeacherDashboard(User teacher);
}