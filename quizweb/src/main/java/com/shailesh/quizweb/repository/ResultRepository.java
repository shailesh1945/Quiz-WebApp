package com.shailesh.quizweb.repository;


import com.shailesh.quizweb.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ResultRepository
        extends JpaRepository<Result, Long> {

    List<Result> findByQuizOrderByScoreDesc(Quiz quiz);

    List<Result> findByStudent(User student);

    Optional<Result> findByStudentAndQuiz(User student, Quiz quiz);

    long countByQuizTeacher(User teacher);

    Long countByStudent(User student);

    List<Result> findByStudentOrderByIdDesc(User student);

    @Query("""
select avg(r.percentage)
from Result r
where r.student = :student
""")
    Double findAverageScoreByStudent(User student);

    @Query("""
SELECT COUNT(DISTINCT r.student.id)
FROM Result r
WHERE r.quiz.teacher = :teacher
""")
    long countUniqueStudents(User teacher);

    List<Result> findTop5ByQuizTeacherOrderByCompletedAtDesc(User teacher);

    List<Result> findByQuizTeacher(User teacher);

    List<Result> findByQuiz(Quiz quiz);

    long count();
}
