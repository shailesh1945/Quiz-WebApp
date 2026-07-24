package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.dto.DashboardStatsResponse;
import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.repository.UserRepository;
import com.shailesh.quizweb.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    private User currentUser(
            org.springframework.security.core.userdetails.User principal
    ){
        return userRepository
                .findByEmail(principal.getUsername())
                .orElseThrow();
    }

    @GetMapping
    public DashboardStatsResponse dashboard(
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ){
        return dashboardService.getTeacherDashboard(
                currentUser(principal)
        );
    }
}