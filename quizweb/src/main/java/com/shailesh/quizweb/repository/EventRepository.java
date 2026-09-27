package com.shailesh.quizweb.repository;


import com.shailesh.quizweb.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository
        extends JpaRepository<Event, Long> {


    List<Event> findByStatusIn(List<String> statuses);

    List<Event> findByTeacher(User teacher);

    Optional<Event> findByJoinCode(String joinCode);

    Optional<Event> findByQuiz(Quiz quiz);
}
