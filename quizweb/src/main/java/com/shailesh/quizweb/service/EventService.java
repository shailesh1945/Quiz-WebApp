package com.shailesh.quizweb.service;


import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.User;

import java.util.List;

public interface EventService {

    EventResponse create(
            EventRequest request,
            User teacher
    );

    List<EventResponse> myEvents(User teacher);

    EventResponse start(Long id, User teacher);

    EventResponse end(Long id, User teacher);

    EventResponse join(String code);

    EventResponse getById(Long id);

    List<StudentSummaryDto> participants(Long id);

    void delete(Long id);

    EventResponse update(
            Long id,
            EventRequest request
    );

    List<LeaderboardDto> leaderboard(Long id);
}
