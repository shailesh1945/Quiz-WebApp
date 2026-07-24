package com.shailesh.quizweb.entity;


import com.shailesh.quizweb.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1500)
    private String description;

    private String category;

    private String difficulty;

    private Integer timeLimit;

    private Integer passingScore;

    private Boolean randomQuestions;

    private Boolean instantResults;

    private String status; // DRAFT / PUBLISHED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private Visibility visibility;
}