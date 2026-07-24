package com.shailesh.quizweb.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
@RequestMapping("/api/student")
public class StudentController {

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Student Dashboard Access Granted";
    }
}
