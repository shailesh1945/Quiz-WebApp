package com.shailesh.quizweb.service.impl;



import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.*;
import com.shailesh.quizweb.enums.Visibility;
import com.shailesh.quizweb.repository.*;
import com.shailesh.quizweb.service.RealtimeService;
import com.shailesh.quizweb.service.StudentQuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StudentQuizServiceImpl
        implements StudentQuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;
    private final EventRepository eventRepository;
    private final RealtimeService realtimeService;

    @Override
    public List<StudentQuestionResponse> startQuiz(
            Long quizId,
            User student) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow();

        List<Question> questions =
                questionRepository.findByQuiz(quiz);

        if (Boolean.TRUE.equals(
                quiz.getRandomQuestions())) {
            Collections.shuffle(questions);
        }

        return questions.stream()
                .map(q ->
                        StudentQuestionResponse.builder()
                                .id(q.getId())
                                .questionText(
                                        q.getQuestionText())
                                .optionA(q.getOptionA())
                                .optionB(q.getOptionB())
                                .optionC(q.getOptionC())
                                .optionD(q.getOptionD())
                                .points(q.getPoints())
                                .build()
                )
                .toList();
    }

    @Override
    public ResultResponse submitQuiz(
            SubmitQuizRequest request,
            User student) {

        Quiz quiz = quizRepository.findById(
                request.getQuizId()
        ).orElseThrow();

        List<Question> questions =
                questionRepository.findByQuiz(quiz);

        Map<Long, String> answerMap =
                new HashMap<>();

        for (AnswerRequest answer :
                request.getAnswers()) {

            answerMap.put(
                    answer.getQuestionId(),
                    answer.getSelectedAnswer()
            );
        }

        int score = 0;
        int total = 0;
        int correct = 0;
        int wrong = 0;

        for (Question q : questions) {

            total += q.getPoints();

            String selected =
                    answerMap.get(q.getId());

            if (selected != null &&
                    selected.equalsIgnoreCase(
                            q.getCorrectAnswer())) {

                score += q.getPoints();
                correct++;

            } else {
                wrong++;
            }
        }

        double percentage =
                total == 0 ? 0 :
                        (score * 100.0) / total;

        Result result = Result.builder()
                .student(student)
                .quiz(quiz)
                .score(score)
                .totalMarks(total)
                .percentage(percentage)
                .correctAnswers(correct)
                .wrongAnswers(wrong)
                .completedAt(LocalDateTime.now())
                .build();

        resultRepository.save(result);

        broadcastLeaderboard(quiz);

        return ResultResponse.builder()
                .score(score)
                .totalMarks(total)
                .percentage(percentage)
                .correctAnswers(correct)
                .wrongAnswers(wrong)
                .build();
    }

    @Override
    public List<Result> leaderboard(
            Long quizId) {

        Quiz quiz = quizRepository.findById(
                quizId
        ).orElseThrow();

        return resultRepository
                .findByQuizOrderByScoreDesc(quiz);
    }




    private void broadcastLeaderboard(
            Quiz quiz) {

        eventRepository.findByQuiz(quiz)
                .ifPresent(event -> {

                    List<Result> results =
                            resultRepository
                                    .findByQuizOrderByScoreDesc(
                                            quiz
                                    );

                    List<LiveLeaderboardRow>
                            board = new ArrayList<>();

                    int rank = 1;

                    for (Result r : results) {

                        board.add(
                                LiveLeaderboardRow
                                        .builder()
                                        .studentName(
                                                r.getStudent()
                                                        .getFullName()
                                        )
                                        .score(
                                                r.getScore()
                                        )
                                        .percentage(
                                                r.getPercentage()
                                        )
                                        .rank(rank++)
                                        .build()
                        );
                    }

                    realtimeService.sendLeaderboard(
                            event.getId(),
                            board
                    );
                });
    }
}