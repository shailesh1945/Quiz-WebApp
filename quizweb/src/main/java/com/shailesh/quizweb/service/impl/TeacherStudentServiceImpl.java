package com.shailesh.quizweb.service.impl;

import com.shailesh.quizweb.dto.ResultResponse;
import com.shailesh.quizweb.dto.StudentResultHistoryDto;
import com.shailesh.quizweb.dto.StudentSummaryDto;
import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.enums.Role;
import com.shailesh.quizweb.repository.ResultRepository;
import com.shailesh.quizweb.repository.UserRepository;
import com.shailesh.quizweb.service.TeacherStudentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherStudentServiceImpl
        implements TeacherStudentService {

    private final UserRepository userRepository;
    private final ResultRepository resultRepository;

    @Override
    public List<StudentSummaryDto> getStudents() {

        List<User> students =
                userRepository.findByRole(Role.STUDENT);

        return students.stream()
                .map(student -> {

                    Long attempts =
                            resultRepository.countByStudent(student);

                    Double avg =
                            resultRepository
                                    .findAverageScoreByStudent(student);

                    return StudentSummaryDto.builder()
                            .id(student.getId())
                            .fullName(student.getFullName())
                            .email(student.getEmail())
                            .quizzesTaken(attempts)
                            .averageScore(avg == null ? 0 : avg)
                            .lastActive("Today")
                            .active(student.getActive())
                            .build();

                }).toList();
    }
    @Override
    public void toggleActive(Long id) {

        User user =
                userRepository.findById(id)
                        .orElseThrow();

        Boolean current =
                user.getActive();

        if(current == null){
            current = true;
        }

        user.setActive(!current);

        userRepository.save(user);
    }

    @Override
    public StudentSummaryDto getStudent(Long id) {

        User student =
                userRepository
                        .findById(id)
                        .orElseThrow();

        Long attempts =
                resultRepository
                        .countByStudent(student);

        Double avg =
                resultRepository
                        .findAverageScoreByStudent(student);

        return StudentSummaryDto.builder()
                .id(student.getId())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .quizzesTaken(attempts)
                .averageScore(avg == null ? 0 : avg)
                .active(student.getActive())
                .lastActive("Today")
                .build();
    }

    @Override
    public List<StudentResultHistoryDto>
    getStudentResults(Long id) {

        User student =
                userRepository.findById(id)
                        .orElseThrow();

        return resultRepository
                .findByStudentOrderByIdDesc(student)
                .stream()
                .map(r ->
                        StudentResultHistoryDto
                                .builder()
                                .quizTitle(
                                        r.getQuiz().getTitle()
                                )
                                .score(
                                        r.getScore()
                                )
                                .percentage(
                                        r.getPercentage()
                                )
                                .attemptedAt(
                                        r.getCompletedAt()
                                                .format(
                                                        DateTimeFormatter.ofPattern(
                                                                "dd MMM yyyy hh:mm a"
                                                        )
                                                )
                                )
                                .build()
                )
                .toList();
    }

}