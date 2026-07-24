package com.shailesh.quizweb.dto;

import lombok.Data;

@Data
public class EventRequest {

    private String title;
    private Long quizId;
    private String startTime;
}