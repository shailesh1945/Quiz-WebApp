package com.shailesh.quizweb.service.impl;


import com.shailesh.quizweb.dto.*;
import com.shailesh.quizweb.entity.*;
import com.shailesh.quizweb.repository.*;
import com.shailesh.quizweb.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl
        implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    @Override
    public QuestionResponse addQuestion(
            Long quizId,
            QuestionRequest request,
            User teacher) {

        Quiz quiz = getOwnedQuiz(quizId, teacher);

        Question question = Question.builder()
                .questionText(request.getQuestionText())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctAnswer(request.getCorrectAnswer())
                .points(request.getPoints())
                .quiz(quiz)
                .build();

        questionRepository.save(question);

        return map(question);
    }

    @Override
    public List<QuestionResponse> getQuestions(
            Long quizId,
            User teacher) {

        Quiz quiz = getOwnedQuiz(quizId, teacher);

        return questionRepository.findByQuiz(quiz)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public QuestionResponse updateQuestion(
            Long id,
            QuestionRequest request,
            User teacher) {

        Question q = questionRepository.findById(id)
                .orElseThrow();

        validateOwnership(q.getQuiz(), teacher);

        q.setQuestionText(request.getQuestionText());
        q.setOptionA(request.getOptionA());
        q.setOptionB(request.getOptionB());
        q.setOptionC(request.getOptionC());
        q.setOptionD(request.getOptionD());
        q.setCorrectAnswer(request.getCorrectAnswer());
        q.setPoints(request.getPoints());

        questionRepository.save(q);

        return map(q);
    }

    @Override
    public void deleteQuestion(
            Long id,
            User teacher) {

        Question q = questionRepository.findById(id)
                .orElseThrow();

        validateOwnership(q.getQuiz(), teacher);

        questionRepository.delete(q);
    }

    @Override
    public void bulkAdd(
            Long quizId,
            BulkQuestionRequest request,
            User teacher) {

        Quiz quiz = getOwnedQuiz(quizId, teacher);

        for(QuestionRequest req : request.getQuestions()) {

            Question q = Question.builder()
                    .questionText(req.getQuestionText())
                    .optionA(req.getOptionA())
                    .optionB(req.getOptionB())
                    .optionC(req.getOptionC())
                    .optionD(req.getOptionD())
                    .correctAnswer(req.getCorrectAnswer())
                    .points(req.getPoints())
                    .quiz(quiz)
                    .build();

            questionRepository.save(q);
        }
    }

    private Quiz getOwnedQuiz(Long quizId, User teacher){
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow();

        validateOwnership(quiz, teacher);

        return quiz;
    }

    private void validateOwnership(
            Quiz quiz,
            User teacher){

        if(!quiz.getTeacher().getId()
                .equals(teacher.getId())) {
            throw new RuntimeException("Unauthorized");
        }
    }

    private QuestionResponse map(Question q){
        return QuestionResponse.builder()
                .id(q.getId())
                .questionText(q.getQuestionText())
                .optionA(q.getOptionA())
                .optionB(q.getOptionB())
                .optionC(q.getOptionC())
                .optionD(q.getOptionD())
                .correctAnswer(q.getCorrectAnswer())
                .points(q.getPoints())
                .build();
    }
}
