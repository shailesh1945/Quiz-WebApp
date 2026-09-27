package com.shailesh.quizweb.service.impl;


import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.*;
import com.shailesh.quizweb.repository.*;
import com.shailesh.quizweb.service.EventService;
import com.shailesh.quizweb.service.RealtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EventServiceImpl
        implements EventService {

    private final EventRepository eventRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final RealtimeService realtimeService;
    private final ResultRepository resultRepository;

    @Override
    public EventResponse getById(Long id) {

        Event event =
                eventRepository
                        .findById(id)
                        .orElseThrow();

        return map(event);
    }

    @Override
    public List<StudentSummaryDto>
    participants(Long id) {

        return new ArrayList<>();
    }

    @Override
    public void delete(Long id) {

        eventRepository.deleteById(id);
    }

    @Override
    public EventResponse update(
            Long id,
            EventRequest request
    ) {

        Event event =
                eventRepository
                        .findById(id)
                        .orElseThrow();

        event.setTitle(
                request.getTitle()
        );

        eventRepository.save(event);

        return map(event);
    }

    @Override
    public EventResponse create(
            EventRequest request,
            User teacher) {

        Quiz quiz = quizRepository.findById(
                request.getQuizId()).orElseThrow();

        if(!quiz.getTeacher().getId()
                .equals(teacher.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .joinCode(generateCode())
                .status("SCHEDULED")
                .startTime(
                        LocalDateTime.parse(
                                request.getStartTime()))
                .quiz(quiz)
                .teacher(teacher)
                .build();

        eventRepository.save(event);

        return map(event);
    }

    @Override
    public List<LeaderboardDto> leaderboard(Long id) {

        Event event = eventRepository
                .findById(id)
                .orElseThrow();

        Quiz quiz = event.getQuiz();

        return resultRepository
                .findByQuizOrderByScoreDesc(quiz)
                .stream()
                .map(r -> new LeaderboardDto(
                        r.getStudent().getFullName(),
                        r.getScore()
                ))
                .toList();
    }

    @Override
    public EventResponse getStudentEvent(Long id) {

        Event event = eventRepository
                .findById(id)
                .orElseThrow();

        if (!"LIVE".equals(event.getStatus())) {
            throw new RuntimeException(
                    "Event is not live"
            );
        }

        return mapForStudent(event);
    }

    @Override
    public List<EventResponse> studentEvents() {

        return eventRepository
                .findByStatusIn(
                        List.of(
                                "SCHEDULED",
                                "LIVE"
                        )
                )
                .stream()
                .map(this::mapForStudent)
                .toList();
    }

    @Override
    public List<EventResponse> myEvents(
            User teacher) {

        return eventRepository.findByTeacher(teacher)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public EventResponse start(
            Long id,
            User teacher) {

        Event event = ownedEvent(id,teacher);

        event.setStatus("LIVE");

        eventRepository.save(event);

        realtimeService.sendStatus(
                event.getId(),
                "LIVE"
        );

        realtimeService.sendTimer(
                event.getId(),
                Map.of(
                        "seconds",
                        event.getQuiz().getTimeLimit() * 60
                )
        );

        return map(event);
    }

    @Override
    public EventResponse end(
            Long id,
            User teacher) {

        Event event = ownedEvent(id, teacher);

        event.setStatus("ENDED");
        event.setEndTime(LocalDateTime.now());

        eventRepository.save(event);

        realtimeService.sendStatus(
                event.getId(),
                "ENDED"
        );

        return map(event);
    }

    @Override
    public EventResponse join(String code) {

        Event event = eventRepository
                .findByJoinCode(code)
                .orElseThrow();

        if(!event.getStatus().equals("LIVE")){
            throw new RuntimeException(
                    "Event not live");
        }

        return map(event);
    }

    @Override
    public List<StudentQuestionDto> studentQuestions(Long id) {

        Event event = eventRepository
                .findById(id)
                .orElseThrow();

        if (!"LIVE".equals(event.getStatus())) {
            throw new RuntimeException(
                    "Event is not live"
            );
        }

        Quiz quiz = event.getQuiz();

        return questionRepository
                .findByQuiz(quiz)
                .stream()
                .map(this::mapQuestion)
                .toList();
    }

    @Override
    public EventResponse joinEvent(Long id) {

        Event event = eventRepository
                .findById(id)
                .orElseThrow();

        if (!"LIVE".equals(event.getStatus())) {
            throw new RuntimeException(
                    "Event is not live"
            );
        }

        return mapForStudent(event);
    }

    private Event ownedEvent(
            Long id,
            User teacher){

        Event event = eventRepository
                .findById(id)
                .orElseThrow();

        if(!event.getTeacher().getId()
                .equals(teacher.getId())) {
            throw new RuntimeException(
                    "Unauthorized");
        }

        return event;
    }

    private String generateCode(){
        return UUID.randomUUID()
                .toString()
                .substring(0,6)
                .toUpperCase();
    }

    private EventResponse mapForStudent(Event e) {

        return EventResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .status(e.getStatus())
                .startTime(
                        e.getStartTime() != null
                                ? e.getStartTime().toString()
                                : null
                )
                .build();
    }

    private EventResponse map(Event e){
        return EventResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .joinCode(e.getJoinCode())
                .status(e.getStatus())
                .startTime(
                        e.getStartTime().toString())
                .build();
    }

    private StudentQuestionDto mapQuestion(Question q) {
        return StudentQuestionDto.builder()
                .id(q.getId())
                .questionText(q.getQuestionText())
                .optionA(q.getOptionA())
                .optionB(q.getOptionB())
                .optionC(q.getOptionC())
                .optionD(q.getOptionD())
                .points(q.getPoints())
                .build();
    }
}
