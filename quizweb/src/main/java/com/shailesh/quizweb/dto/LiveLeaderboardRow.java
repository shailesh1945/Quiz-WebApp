package com.shailesh.quizweb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LiveLeaderboardRow {

    private String studentName;
    private Integer score;
    private Double percentage;
    private Integer rank;
}
