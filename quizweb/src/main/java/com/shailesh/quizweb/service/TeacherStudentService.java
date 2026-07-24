package com.shailesh.quizweb.service;

import com.shailesh.quizweb.dto.ResultResponse;
import com.shailesh.quizweb.dto.StudentResultHistoryDto;
import com.shailesh.quizweb.dto.StudentSummaryDto;
import java.util.List;

public interface TeacherStudentService {

    List<StudentSummaryDto> getStudents();

    void toggleActive(Long id);

    StudentSummaryDto getStudent(Long id);

    List<StudentResultHistoryDto> getStudentResults(Long id);
}