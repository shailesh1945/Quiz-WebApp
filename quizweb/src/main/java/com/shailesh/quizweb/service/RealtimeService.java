package com.shailesh.quizweb.service;


import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RealtimeService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendLeaderboard(
            Long eventId,
            Object payload) {

        messagingTemplate.convertAndSend(
                "/topic/leaderboard/" + eventId,
                payload
        );
    }

    public void sendTimer(
            Long eventId,
            Object payload) {

        messagingTemplate.convertAndSend(
                "/topic/timer/" + eventId,
                payload
        );
    }

    public void sendStatus(
            Long eventId,
            Object payload) {

        messagingTemplate.convertAndSend(
                "/topic/status/" + eventId,
                payload
        );
    }
}
