package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.dto.ResultResponse;
import com.shailesh.quizweb.dto.StudentResultHistoryDto;
import com.shailesh.quizweb.dto.StudentSummaryDto;
import com.shailesh.quizweb.service.TeacherStudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/students")
@RequiredArgsConstructor
public class TeacherStudentController {

    private final TeacherStudentService service;

    @GetMapping
    public List<StudentSummaryDto> all() {
        return service.getStudents();
    }

    @PutMapping("/{id}/toggle")
    public void toggle(
            @PathVariable Long id
    ) {
        service.toggleActive(id);
    }

    @GetMapping("/{id}")
    public StudentSummaryDto detail(
            @PathVariable Long id
    ){
        return service.getStudent(id);
    }

    @GetMapping("/{id}/results")
    public List<StudentResultHistoryDto> results(
            @PathVariable Long id
    ){
        return service.getStudentResults(id);
    }
}
