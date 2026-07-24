package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.enums.Role;
import com.shailesh.quizweb.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
public class TeacherController {

    UserRepository userRepository;

    @GetMapping("/home")
    public String dashboard() {
        return "Teacher Dashboard Access Granted";
    }

//    @GetMapping("/students")
//    public List<User> students() {
//        return userRepository.findByRole(Role.STUDENT);
//    }
}