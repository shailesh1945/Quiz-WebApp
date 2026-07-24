package com.shailesh.quizweb.repository;

import com.shailesh.quizweb.entity.Quiz;
import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.enums.Visibility;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository
        extends JpaRepository<Quiz, Long> {

    Page<Quiz> findByTeacher(User teacher, Pageable pageable);

    Page<Quiz> findByTitleContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    long countByTeacher(User teacher);

    long countByTeacherAndStatus(User teacher, String status);

    List<Quiz> findTop5ByTeacher(User teacher);

    long count();

    List<Quiz> findByVisibility(Visibility visibility);
}
