"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import QuestionBuilder from "@/components/QuestionBuilder";

export default function EditQuizPage() {
  const { id } = useParams();

  const [form, setForm] = useState<any>(null);

  const [questions, setQuestions] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /* -----------------------------
     Load Quiz + Questions
  ----------------------------- */
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const quizRes = await api.get(
        `/teacher/quizzes/${id}`
      );

      const questionRes = await api.get(
        `/teacher/quizzes/${id}/questions`
      );

      setForm({
        ...quizRes.data,

        // If old quizzes don't have visibility,
        // default them to PUBLIC.
        visibility:
          quizRes.data.visibility || "PUBLIC",
      });

      setQuestions(
        questionRes.data || []
      );
    } catch (error) {
      console.error(
        "Failed to load quiz:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Save Quiz
  ----------------------------- */
  const saveQuiz = async () => {
    try {
      setSaving(true);

      await api.put(
        `/teacher/quizzes/${id}`,
        form
      );

      alert("Quiz updated successfully");

      await loadData();
    } catch (error) {
      console.error(
        "Update quiz error:",
        error
      );

      alert("Failed to update quiz");
    } finally {
      setSaving(false);
    }
  };

  /* -----------------------------
     Publish Quiz
  ----------------------------- */
  const publishQuiz = async () => {
    try {
      setSaving(true);

      await api.put(
        `/teacher/quizzes/${id}`,
        {
          ...form,
          status: "PUBLISHED",
        }
      );

      alert("Quiz published successfully");

      await loadData();
    } catch (error) {
      console.error(
        "Publish quiz error:",
        error
      );

      alert("Failed to publish quiz");
    } finally {
      setSaving(false);
    }
  };

  /* -----------------------------
     Delete Question
  ----------------------------- */
  const deleteQuestion = async (
    qid: number
  ) => {
    if (
      !confirm(
        "Delete this question?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/teacher/quizzes/questions/${qid}`
      );

      await loadData();
    } catch (error) {
      console.error(
        "Delete question error:",
        error
      );

      alert("Failed to delete question");
    }
  };

  /* -----------------------------
     Loading
  ----------------------------- */
  if (loading || !form) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white text-lg">
          Loading quiz...
        </p>
      </div>
    );
  }

  return (
    <ProtectedRoute allow={["TEACHER"]}>
      <DashboardLayout>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-white">
              Edit Quiz
            </h1>

            <p className="text-slate-400 mt-2">
              Update your quiz details and questions.
            </p>
          </div>

          <div className="flex gap-3">

            {form.status !==
              "PUBLISHED" && (
              <button
                onClick={publishQuiz}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-6 py-3 rounded-xl text-white font-medium transition"
              >
                {saving
                  ? "Publishing..."
                  : "Publish"}
              </button>
            )}

            <button
              onClick={saveQuiz}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-xl text-white font-medium transition"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>
        </div>

        {/* Quiz Form */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl mb-8">

          <h2 className="text-2xl font-semibold text-white mb-6">
            Quiz Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quiz Title
              </label>

              <input
                value={form.title || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
                placeholder="Quiz Title"
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>

              <input
                value={
                  form.category || ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    category:
                      e.target.value,
                  })
                }
                placeholder="Category"
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>

              <textarea
                value={
                  form.description || ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:border-blue-500 min-h-[130px]"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Difficulty
              </label>

              <select
                value={
                  form.difficulty ||
                  "Easy"
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    difficulty:
                      e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white"
              >
                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Time Limit (minutes)
              </label>

              <input
                type="number"
                min="1"
                value={
                  form.timeLimit || 1
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    timeLimit:
                      Number(
                        e.target.value
                      ),
                  })
                }
                placeholder="Time Limit"
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white"
              />
            </div>

            {/* Passing Score */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Passing Score (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={
                  form.passingScore || 0
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    passingScore:
                      Number(
                        e.target.value
                      ),
                  })
                }
                placeholder="Passing %"
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white"
              />
            </div>

          </div>

          {/* Visibility */}
          <div className="mt-8 border border-slate-700 rounded-2xl p-6">

            <h3 className="text-lg font-semibold text-white">
              Quiz Visibility
            </h3>

            <p className="text-sm text-slate-400 mt-1 mb-5">
              Choose how students can access this quiz.
            </p>

            <div className="grid md:grid-cols-2 gap-4">

              {/* Public */}
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    visibility:
                      "PUBLIC",
                  })
                }
                className={`text-left p-5 rounded-xl border transition ${
                  form.visibility ===
                  "PUBLIC"
                    ? "border-green-500 bg-green-500/10"
                    : "border-slate-700 bg-slate-800 hover:border-slate-500"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      form.visibility ===
                      "PUBLIC"
                        ? "border-green-500"
                        : "border-slate-500"
                    }`}
                  >
                    {form.visibility ===
                      "PUBLIC" && (
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    )}
                  </div>

                  <span className="text-white font-semibold">
                    Public Quiz
                  </span>

                </div>

                <p className="text-sm text-slate-400 mt-3 ml-8">
                  Students can discover this quiz from Explore Quizzes.
                </p>

              </button>

              {/* Private */}
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    visibility:
                      "PRIVATE",
                  })
                }
                className={`text-left p-5 rounded-xl border transition ${
                  form.visibility ===
                  "PRIVATE"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-slate-700 bg-slate-800 hover:border-slate-500"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      form.visibility ===
                      "PRIVATE"
                        ? "border-orange-500"
                        : "border-slate-500"
                    }`}
                  >
                    {form.visibility ===
                      "PRIVATE" && (
                      <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                    )}
                  </div>

                  <span className="text-white font-semibold">
                    Private Quiz
                  </span>

                </div>

                <p className="text-sm text-slate-400 mt-3 ml-8">
                  This quiz won't appear in public quiz discovery.
                </p>

              </button>

            </div>
          </div>

          {/* Current status */}
          <div className="mt-6 flex items-center gap-3">

            <span className="text-slate-400 text-sm">
              Current status:
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                form.status ===
                "PUBLISHED"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {form.status}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                form.visibility ===
                "PUBLIC"
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-orange-500/10 text-orange-400"
              }`}
            >
              {form.visibility}
            </span>

          </div>

        </div>

        {/* Existing Questions */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl mb-8">

          <h2 className="text-2xl text-white mb-6">
            Questions ({questions.length})
          </h2>

          {questions.length ===
          0 ? (
            <p className="text-slate-400">
              No questions added yet.
            </p>
          ) : (
            <div className="space-y-4">

              {questions.map(
                (q, index) => (
                  <div
                    key={q.id}
                    className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex justify-between items-center gap-4"
                  >

                    <div>

                      <p className="text-slate-400 text-sm mb-1">
                        Question{" "}
                        {index + 1}
                      </p>

                      <h3 className="text-white">
                        {
                          q.questionText
                        }
                      </h3>

                    </div>

                    <button
                      onClick={() =>
                        deleteQuestion(
                          q.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white transition"
                    >
                      Delete
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* Question Builder */}
        <QuestionBuilder
          quizId={id}
          publishQuiz={publishQuiz}
          onAdded={loadData}
        />

      </DashboardLayout>
    </ProtectedRoute>
  );
}