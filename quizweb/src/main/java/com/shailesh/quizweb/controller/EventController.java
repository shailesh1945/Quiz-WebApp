package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.User;
import com.shailesh.quizweb.repository.UserRepository;
import com.shailesh.quizweb.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    private User currentUser(
            org.springframework.security.core.userdetails.User principal
    ) {
        return userRepository
                .findByEmail(principal.getUsername())
                .orElseThrow();
    }

    @PostMapping("/teacher/events")
    public EventResponse create(
            @RequestBody EventRequest request,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {
        return eventService.create(
                request,
                currentUser(principal)
        );
    }

    @GetMapping("/teacher/events")
    public List<EventResponse> myEvents(
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {
        return eventService.myEvents(
                currentUser(principal)
        );
    }

    @PutMapping("/teacher/events/{id}/start")
    public EventResponse start(
            @PathVariable Long id,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {
        return eventService.start(
                id,
                currentUser(principal)
        );
    }

    @PutMapping("/teacher/events/{id}/end")
    public EventResponse end(
            @PathVariable Long id,
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal
    ) {
        return eventService.end(
                id,
                currentUser(principal)
        );
    }

    @PostMapping("/student/events/join")
    public EventResponse join(
            @RequestBody JoinEventRequest request
    ) {
        return eventService.join(
                request.getJoinCode()
        );
    }

    @GetMapping("/teacher/events/{id}")
    public EventResponse detail(
            @PathVariable Long id
    ){
        return eventService.getById(id);
    }

    @GetMapping("/teacher/events/{id}/participants")
    public List<StudentSummaryDto> participants(
            @PathVariable Long id
    ){
        return eventService.participants(id);
    }

    @DeleteMapping("/teacher/events/{id}")
    public void delete(
            @PathVariable Long id
    ){
        eventService.delete(id);
    }

    @PutMapping("/teacher/events/{id}")
    public EventResponse update(
            @PathVariable Long id,
            @RequestBody EventRequest request
    ){
        return eventService.update(id, request);
    }

    @GetMapping("/teacher/events/{id}/leaderboard")
    public List<LeaderboardDto> leaderboard(
            @PathVariable Long id
    ){
        return eventService.leaderboard(id);
    }
}