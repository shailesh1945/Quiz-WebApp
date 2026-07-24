"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import QuestionBuilder from "@/components/QuestionBuilder";

export default function EditQuizPage() {

  const { id } = useParams();

  const [form, setForm] =
    useState<any>(null);

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
    loadData();
  }, []);

  const loadData = async () => {

    try {

      const quizRes =
        await api.get(
          `/teacher/quizzes/${id}`
        );

      const questionRes =
        await api.get(
          `/teacher/quizzes/${id}/questions`
        );

      setForm(quizRes.data);

      setQuestions(
        questionRes.data || []
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

      alert("Quiz updated");

    } finally {
      setSaving(false);
    }
  };

  /* -----------------------------
     Publish Quiz
  ----------------------------- */
  const publishQuiz =
    async () => {

      await api.put(
        `/teacher/quizzes/${id}`,
        {
          ...form,
          status:
            "PUBLISHED"
        }
      );

      loadData();
    };

  /* -----------------------------
     Delete Question
  ----------------------------- */
  const deleteQuestion =
    async (
      qid: number
    ) => {

      if (
        !confirm(
          "Delete this question?"
        )
      ) return;

      await api.delete(
        `/teacher/quizzes/questions/${qid}`
      );

      loadData();
    };

  /* -----------------------------
     Loading
  ----------------------------- */
  if (loading || !form)
    return (
      <p className="text-white p-10">
        Loading...
      </p>
    );

  return (
    <ProtectedRoute allow={["TEACHER"]}>

      <DashboardLayout>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            Edit Quiz
          </h1>

          <div className="flex gap-3">

            {form.status !==
              "PUBLISHED" && (
              <button
                onClick={
                  publishQuiz
                }
                className="bg-green-600 px-6 py-3 rounded-xl text-white"
              >
                Publish
              </button>
            )}

            <button
              onClick={saveQuiz}
              disabled={saving}
              className="bg-blue-600 px-6 py-3 rounded-xl text-white"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </div>

        {/* Quiz Form */}
        <div className="bg-slate-900 p-8 rounded-2xl mb-8">

          <div className="grid grid-cols-2 gap-5">

            <input
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value
                })
              }
              placeholder="Quiz Title"
              className="bg-slate-800 p-4 rounded-xl text-white"
            />

            <input
              value={
                form.category
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value
                })
              }
              placeholder="Category"
              className="bg-slate-800 p-4 rounded-xl text-white"
            />

            <textarea
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value
                })
              }
              placeholder="Description"
              className="bg-slate-800 p-4 rounded-xl text-white col-span-2 min-h-[130px]"
            />

            <select
              value={
                form.difficulty
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty:
                    e.target.value
                })
              }
              className="bg-slate-800 p-4 rounded-xl text-white"
            >
              <option>
                Easy
              </option>
              <option>
                Medium
              </option>
              <option>
                Hard
              </option>
            </select>

            <input
              type="number"
              value={
                form.timeLimit
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  timeLimit:
                    Number(
                      e.target
                        .value
                    )
                })
              }
              placeholder="Time Limit"
              className="bg-slate-800 p-4 rounded-xl text-white"
            />

            <input
              type="number"
              value={
                form.passingScore
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  passingScore:
                    Number(
                      e.target
                        .value
                    )
                })
              }
              placeholder="Passing %"
              className="bg-slate-800 p-4 rounded-xl text-white"
            />

          </div>

        </div>

        {/* Existing Questions */}
        <div className="bg-slate-900 p-8 rounded-2xl mb-8">

          <h2 className="text-2xl text-white mb-6">
            Questions (
            {
              questions.length
            }
            )
          </h2>

          {questions.length ===
          0 ? (

            <p className="text-slate-400">
              No questions added yet.
            </p>

          ) : (

            <div className="space-y-4">

              {questions.map(
                (
                  q,
                  index
                ) => (

                  <div
                    key={
                      q.id
                    }
                    className="bg-slate-800 p-5 rounded-xl flex justify-between items-center"
                  >

                    <div>

                      <p className="text-slate-400 text-sm mb-1">
                        Question{" "}
                        {index +
                          1}
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
                      className="bg-red-600 px-4 py-2 rounded-xl text-white"
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
          publishQuiz={
            publishQuiz
          }
          onAdded={loadData}
        />

      </DashboardLayout>

    </ProtectedRoute>
  );
}