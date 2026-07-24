package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.dto.AuthResponse;
import com.shailesh.quizweb.dto.LoginRequest;
import com.shailesh.quizweb.dto.RegisterRequest;
import com.shailesh.quizweb.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {
        return ResponseEntity.ok(
                authService.me(principal.getUsername())
        );
    }
}