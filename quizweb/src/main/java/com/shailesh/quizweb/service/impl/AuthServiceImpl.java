package com.shailesh.quizweb.service.impl;

import com.shailesh.quizweb.dto.AuthResponse;
import com.shailesh.quizweb.dto.LoginRequest;
import com.shailesh.quizweb.dto.RegisterRequest;
import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.enums.Role;
import com.shailesh.quizweb.repository.UserRepository;
import com.shailesh.quizweb.security.JwtService;
import com.shailesh.quizweb.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse register(
            RegisterRequest request
    ) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(
                        Role.valueOf(
                                request.getRole()
                        )
                )
                .active(true)
                .build();

        userRepository.save(user);

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new AuthResponse(token);
    }

    @Override
    public AuthResponse login(
            LoginRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if(Boolean.FALSE.equals(
                user.getActive()
        )){
            throw new RuntimeException(
                    "Account disabled by teacher"
            );
        }

        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )){
            throw new RuntimeException(
                    "Invalid password"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return new AuthResponse(
                token
        );
    }

    @Override
    public Object me(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow();

        return Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole()
        );
    }
}