"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function QuizPlayer({
  quizId
}: {
  quizId: number;
}) {

  const storageKey = `quiz_${quizId}`;

  const [questions, setQuestions] =
    useState<any[]>([]);

  const [index, setIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState<any>({});

  const [time, setTime] =
    useState(600);

  const [result, setResult] =
    useState<any>(null);

  /* -----------------------------
     Load Saved Progress
  ----------------------------- */
  useEffect(() => {

    const saved =
      localStorage.getItem(storageKey);

    if (saved) {

      const data =
        JSON.parse(saved);

      setAnswers(data.answers || {});
      setIndex(data.index || 0);
      setTime(data.time || 600);
    }

  }, []);

  /* -----------------------------
     Load Questions
  ----------------------------- */
  useEffect(() => {

    api.get(
      `/student/quizzes/${quizId}/start`
    ).then(res =>
      setQuestions(res.data)
    );

  }, []);

  /* -----------------------------
     Auto Save Progress
  ----------------------------- */
  useEffect(() => {

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        answers,
        index,
        time
      })
    );

  }, [answers, index, time]);

  /* -----------------------------
     Timer
  ----------------------------- */
  useEffect(() => {

    if (time <= 0 || result)
      return;

    const timer =
      setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);

    return () =>
      clearInterval(timer);

  }, [time, result]);

  /* -----------------------------
     Leave Page Warning
  ----------------------------- */
  useEffect(() => {

    const handleBeforeUnload = (
      e: BeforeUnloadEvent
    ) => {

      if (
        !result &&
        questions.length > 0
      ) {

        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };

  }, [result, questions]);

  /* -----------------------------
     Auto Submit
  ----------------------------- */
  useEffect(() => {

    if (time === 0) {
      submitQuiz();
    }

  }, [time]);

  /* -----------------------------
     Select Answer
  ----------------------------- */
  const selectAnswer = (
    value: string
  ) => {

    setAnswers({
      ...answers,
      [questions[index].id]: value
    });
  };

  /* -----------------------------
     Submit Quiz
  ----------------------------- */
  const submitQuiz = async () => {

    const payload = {
      quizId,
      answers: Object.keys(
        answers
      ).map(id => ({
        questionId: Number(id),
        selectedAnswer:
          answers[id]
      }))
    };

    const res =
      await api.post(
        "/student/quizzes/submit",
        payload
      );

    localStorage.removeItem(
      storageKey
    );

    setResult(res.data);
  };

  /* -----------------------------
     Loading
  ----------------------------- */
  if (questions.length === 0)
    return (
      <p className="text-white p-10">
        Loading...
      </p>
    );

  /* -----------------------------
     Result Screen
  ----------------------------- */
  if (result)
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">

        <div className="bg-slate-900 p-10 rounded-2xl text-white w-[520px] border border-slate-800">

          <h1 className="text-4xl font-bold mb-6 text-center">
            Quiz Completed 🎉
          </h1>

          <div className="grid grid-cols-2 gap-4 mb-6">

            <div className="bg-slate-800 p-4 rounded-xl">
              Score: {result.score}
            </div>

            <div className="bg-slate-800 p-4 rounded-xl">
              Correct:
              {result.correctAnswers}
            </div>

            <div className="bg-slate-800 p-4 rounded-xl">
              Wrong:
              {result.wrongAnswers}
            </div>

            <div className="bg-green-600 p-4 rounded-xl font-bold">
              {result.percentage.toFixed(1)}%
            </div>

          </div>

          <button
            onClick={() =>
              window.location.href =
                "/student"
            }
            className="w-full bg-blue-600 py-4 rounded-xl"
          >
            Back To Dashboard
          </button>

        </div>

      </div>
    );

  const q = questions[index];

  /* -----------------------------
     Quiz Screen
  ----------------------------- */
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between mb-6">

          <h1 className="text-2xl font-bold">
            Quiz Running
          </h1>

          <div className="bg-red-600 px-4 py-2 rounded-xl">
            {Math.floor(time / 60)}:
            {String(time % 60).padStart(2, "0")}
          </div>

        </div>

        {/* Progress */}
        <div className="w-full bg-slate-800 h-3 rounded-full mb-3">

          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${((index + 1) / questions.length) * 100}%`
            }}
          />

        </div>

        <p className="text-slate-400 text-sm mb-8">
          Answered {
            Object.keys(answers).length
          } of {questions.length}
        </p>

        <div className="bg-slate-900 p-8 rounded-2xl">

          <p className="text-slate-400 mb-3">
            Question {index + 1} / {questions.length}
          </p>

          <h2 className="text-2xl font-semibold mb-8">
            {q.questionText}
          </h2>

          <div className="grid grid-cols-2 gap-4">

            {["A", "B", "C", "D"].map(
              (opt) => {

                const value =
                  q["option" + opt];

                return (
                  <button
                    key={opt}
                    onClick={() =>
                      selectAnswer(opt)
                    }
                    className={`p-4 rounded-xl border ${
                      answers[q.id] === opt
                        ? "bg-blue-600 border-blue-600"
                        : "bg-slate-800 border-slate-700"
                    }`}
                  >
                    {opt}. {value}
                  </button>
                );
              }
            )}

          </div>

          <div className="flex justify-between mt-10">

            <button
              disabled={index === 0}
              onClick={() =>
                setIndex(index - 1)
              }
              className="px-6 py-3 bg-slate-700 rounded-xl"
            >
              Previous
            </button>

            {index ===
            questions.length - 1 ? (

              <button
                onClick={
                  submitQuiz
                }
                className="px-8 py-3 bg-green-600 rounded-xl"
              >
                Submit Quiz
              </button>

            ) : (

              <button
                onClick={() =>
                  setIndex(index + 1)
                }
                className="px-8 py-3 bg-blue-600 rounded-xl"
              >
                Next
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}