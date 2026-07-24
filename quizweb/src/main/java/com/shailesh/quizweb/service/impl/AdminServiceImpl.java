package com.shailesh.quizweb.service.impl;


import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.enums.Role;
import com.shailesh.quizweb.repository.*;
import com.shailesh.quizweb.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl
        implements AdminService {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final ResultRepository resultRepository;

    @Override
    public AdminDashboardResponse dashboard() {

        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalTeachers(
                        userRepository.countByRole(Role.TEACHER))
                .totalStudents(
                        userRepository.countByRole(Role.STUDENT))
                .totalQuizzes(
                        quizRepository.count())
                .totalAttempts(
                        resultRepository.count())
                .build();
    }

    @Override
    public List<UserRowResponse> users() {

        return userRepository.findAll()
                .stream()
                .map(u ->
                        UserRowResponse.builder()
                                .id(u.getId())
                                .fullName(u.getFullName())
                                .email(u.getEmail())
                                .role(u.getRole().name())
                                .active(u.getActive())
                                .build()
                ).toList();
    }

    @Override
    public void toggleUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setActive(!user.getActive());

        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {

        userRepository.deleteById(id);
    }
}
