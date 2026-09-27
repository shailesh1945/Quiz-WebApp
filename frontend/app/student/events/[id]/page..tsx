"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

import api from "@/services/api";
import StudentLayout from "@/components/student/StudentLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

interface EventData {
  id: number;
  title: string;
  status: string;
  startTime: string;
}

interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  points: number;
}

export default function StudentEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.id);

  const [event, setEvent] = useState<EventData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) return;

    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");

      const eventResponse = await api.get(
        `/student/events/${eventId}`
      );

      const questionResponse = await api.get(
        `/student/events/${eventId}/questions`
      );

      setEvent(eventResponse.data);
      setQuestions(questionResponse.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load this event.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answer: string) => {
    const question = questions[currentQuestion];

    if (!question) return;

    setAnswers((previous) => ({
      ...previous,
      [question.id]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allow={["STUDENT"]}>
        <StudentLayout>
          <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            <p className="text-slate-400">
              Loading live event...
            </p>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute allow={["STUDENT"]}>
        <StudentLayout>
          <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-3xl mx-auto bg-slate-900 border border-red-500/30 rounded-2xl p-8">
              <h1 className="text-2xl font-bold text-red-400">
                Unable to Join Event
              </h1>

              <p className="text-slate-400 mt-3">
                {error}
              </p>

              <button
                onClick={() => router.push("/student/events")}
                className="mt-6 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700"
              >
                Back to Events
              </button>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return null;
  }

  if (event.status !== "LIVE") {
    return (
      <ProtectedRoute allow={["STUDENT"]}>
        <StudentLayout>
          <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-3xl mx-auto text-center bg-slate-900 border border-slate-800 rounded-2xl p-10">
              <h1 className="text-3xl font-bold">
                Event is not live
              </h1>

              <p className="text-slate-400 mt-3">
                This event is currently {event.status}.
              </p>

              <button
                onClick={() => router.push("/student/events")}
                className="mt-6 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500"
              >
                Back to Events
              </button>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  if (questions.length === 0) {
    return (
      <ProtectedRoute allow={["STUDENT"]}>
        <StudentLayout>
          <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold">
                {event.title}
              </h1>

              <p className="text-slate-400 mt-4">
                No questions are available for this event.
              </p>
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  const question = questions[currentQuestion];

  const selectedAnswer = answers[question.id];

  const options = [
    {
      key: "A",
      value: question.optionA,
    },
    {
      key: "B",
      value: question.optionB,
    },
    {
      key: "C",
      value: question.optionC,
    },
    {
      key: "D",
      value: question.optionD,
    },
  ];

  return (
    <ProtectedRoute allow={["STUDENT"]}>
      <StudentLayout>
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">
                    {event.title}
                  </h1>

                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-semibold">
                    LIVE
                  </span>
                </div>

                <p className="text-slate-400 mt-2">
                  Answer the questions below.
                </p>
              </div>

              {/* Question counter */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3">
                <p className="text-sm text-slate-400">
                  Question
                </p>

                <p className="text-xl font-bold">
                  {currentQuestion + 1}
                  <span className="text-slate-500">
                    {" "}
                    / {questions.length}
                  </span>
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round(
                    ((currentQuestion + 1) /
                      questions.length) *
                      100
                  )}
                  %
                </span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${
                      ((currentQuestion + 1) /
                        questions.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

              <div className="flex justify-between items-start gap-4 mb-8">
                <div>
                  <p className="text-sm text-blue-400 font-semibold mb-3">
                    Question {currentQuestion + 1}
                  </p>

                  <h2 className="text-2xl font-semibold leading-relaxed">
                    {question.questionText}
                  </h2>
                </div>

                <span className="shrink-0 text-sm text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                  {question.points} pts
                </span>
              </div>

              {/* Options */}
              <div className="space-y-4">

                {options.map((option) => {
                  const selected =
                    selectedAnswer === option.key;

                  return (
                    <button
                      key={option.key}
                      onClick={() =>
                        selectAnswer(option.key)
                      }
                      className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-4 ${
                        selected
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      }`}
                    >
                      <span
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {option.key}
                      </span>

                      <span className="flex-1 text-slate-200">
                        {option.value}
                      </span>

                      {selected && (
                        <CheckCircle
                          size={22}
                          className="text-blue-400"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-800">

                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                {currentQuestion <
                questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-6 py-3 rounded-xl bg-green-600/40 text-green-300 font-semibold cursor-not-allowed"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>

            {/* Question navigation */}
            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-5">

              <p className="text-sm text-slate-400 mb-4">
                Questions
              </p>

              <div className="flex flex-wrap gap-3">
                {questions.map((q, index) => {
                  const answered =
                    answers[q.id] !== undefined;

                  const active =
                    index === currentQuestion;

                  return (
                    <button
                      key={q.id}
                      onClick={() =>
                        setCurrentQuestion(index)
                      }
                      className={`w-10 h-10 rounded-lg font-semibold ${
                        active
                          ? "bg-blue-600 text-white"
                          : answered
                          ? "bg-green-600/20 text-green-400 border border-green-500/30"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}