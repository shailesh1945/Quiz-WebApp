package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.dto.JoinLiveRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class LiveEventController {

    private final SimpMessagingTemplate socket;

    @MessageMapping("/join")
    public void join(JoinLiveRequest req){

        socket.convertAndSend(
                "/topic/event/" + req.getEventId(),
                req.getName() + " joined"
        );
    }
}
