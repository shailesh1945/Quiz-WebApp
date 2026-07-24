package com.shailesh.quizweb.repository;


import com.shailesh.quizweb.entity.Question;
import com.shailesh.quizweb.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository
        extends JpaRepository<Question, Long> {

    List<Question> findByQuiz(Quiz quiz);

    long countByQuiz(Quiz quiz);

    void deleteByQuiz(Quiz quiz);
}