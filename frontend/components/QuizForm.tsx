"use client";

import { useState } from "react";
import api from "@/services/api";
import QuestionBuilder from "./QuestionBuilder";

export default function QuizForm() {
  const [step, setStep] = useState(1);

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Easy",
    timeLimit: 10,
    passingScore: 50,
    randomQuestions: true,
    instantResults: true,
    status: "DRAFT",

    // NEW
    visibility: "PUBLIC",
  });

  const [quizId, setQuizId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const createQuiz = async () => {
    try {
      if (!quiz.title.trim()) {
        alert("Please enter a quiz title");
        return;
      }

      if (!quiz.category.trim()) {
        alert("Please enter a category");
        return;
      }

      setLoading(true);

      console.log("Creating quiz:", quiz);

      const res = await api.post(
        "/teacher/quizzes",
        quiz
      );

      setQuizId(res.data.id);
      setStep(2);

    } catch (error) {
      console.error("Create quiz error:", error);
      alert("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  const publishQuiz = async () => {
    try {
      if (!quizId) return;

      setLoading(true);

      await api.put(
        `/teacher/quizzes/${quizId}`,
        {
          ...quiz,
          status: "PUBLISHED",
        }
      );

      alert("Quiz Published Successfully!");

    } catch (error) {
      console.error("Publish quiz error:", error);
      alert("Failed to publish quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl text-white font-bold">
          Create Quiz
        </h1>

        <p className="text-slate-400 mt-2">
          Create a quiz and choose who can access it.
        </p>
      </div>

      {/* STEP 1 */}

      {step === 1 && (

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6">

          {/* TITLE */}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quiz Title
            </label>

            <input
              placeholder="e.g. Java Fundamentals"
              value={quiz.title}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  title: e.target.value,
                })
              }
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>

            <textarea
              placeholder="Describe your quiz..."
              value={quiz.description}
              rows={4}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>

            <input
              placeholder="e.g. Java, React, SQL"
              value={quiz.category}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  category: e.target.value,
                })
              }
            />
          </div>

          {/* DIFFICULTY / TIME / PASSING */}

          <div className="grid md:grid-cols-3 gap-4">

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Difficulty
              </label>

              <select
                value={quiz.difficulty}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    difficulty: e.target.value,
                  })
                }
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Time Limit (minutes)
              </label>

              <input
                type="number"
                min="1"
                value={quiz.timeLimit}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    timeLimit: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Passing Score (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={quiz.passingScore}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    passingScore: Number(e.target.value),
                  })
                }
              />
            </div>

          </div>

          {/* VISIBILITY */}

          <div className="border border-slate-700 rounded-2xl p-6">

            <h2 className="text-lg font-semibold text-white">
              Quiz Visibility
            </h2>

            <p className="text-sm text-slate-400 mt-1 mb-5">
              Choose how students can access this quiz.
            </p>

            <div className="grid md:grid-cols-2 gap-4">

              {/* PUBLIC */}

              <button
                type="button"
                onClick={() =>
                  setQuiz({
                    ...quiz,
                    visibility: "PUBLIC",
                  })
                }
                className={`text-left p-5 rounded-xl border transition ${
                  quiz.visibility === "PUBLIC"
                    ? "border-green-500 bg-green-500/10"
                    : "border-slate-700 bg-slate-800 hover:border-slate-500"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      quiz.visibility === "PUBLIC"
                        ? "border-green-500"
                        : "border-slate-500"
                    }`}
                  >
                    {quiz.visibility === "PUBLIC" && (
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    )}
                  </div>

                  <span className="text-white font-semibold">
                    Public Quiz
                  </span>

                </div>

                <p className="text-sm text-slate-400 mt-3 ml-8">
                  Students can discover and start this quiz from the Explore Quizzes page.
                </p>

              </button>

              {/* PRIVATE */}

              <button
                type="button"
                onClick={() =>
                  setQuiz({
                    ...quiz,
                    visibility: "PRIVATE",
                  })
                }
                className={`text-left p-5 rounded-xl border transition ${
                  quiz.visibility === "PRIVATE"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-slate-700 bg-slate-800 hover:border-slate-500"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      quiz.visibility === "PRIVATE"
                        ? "border-orange-500"
                        : "border-slate-500"
                    }`}
                  >
                    {quiz.visibility === "PRIVATE" && (
                      <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                    )}
                  </div>

                  <span className="text-white font-semibold">
                    Private Quiz
                  </span>

                </div>

                <p className="text-sm text-slate-400 mt-3 ml-8">
                  This quiz won't appear publicly. Students need an event or private access code.
                </p>

              </button>

            </div>

          </div>

          {/* CONTINUE */}

          <div className="pt-2">

            <button
              onClick={createQuiz}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-3 rounded-xl text-white font-medium transition"
            >
              {loading ? "Creating..." : "Continue"}
            </button>

          </div>

        </div>
      )}

      {/* STEP 2 */}

      {step === 2 && quizId && (

        <QuestionBuilder
          quizId={quizId}
          publishQuiz={publishQuiz}
        />

      )}

    </div>
  );
}