package com.shailesh.quizweb.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentSummaryDto {

    private Long id;
    private String fullName;
    private String email;
    private Long quizzesTaken;
    private Double averageScore;
    private String lastActive;
    private Boolean active;
}
