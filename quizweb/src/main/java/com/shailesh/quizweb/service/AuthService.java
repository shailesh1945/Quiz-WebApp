package com.shailesh.quizweb.service;

import com.shailesh.quizweb.dto.AuthResponse;
import com.shailesh.quizweb.dto.LoginRequest;
import com.shailesh.quizweb.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    Object me(String email);
}