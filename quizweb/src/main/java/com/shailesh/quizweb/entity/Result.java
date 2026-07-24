package com.shailesh.quizweb.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer score;

    private Integer totalMarks;

    private Double percentage;

    private Integer correctAnswers;

    private Integer wrongAnswers;

    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name="student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name="quiz_id")
    private Quiz quiz;
}
