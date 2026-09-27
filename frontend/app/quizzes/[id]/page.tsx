"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Link from "next/link";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function QuizDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>();

  const [questions, setQuestions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const quizRes = await api.get(`/teacher/quizzes/${id}`);

      const questionRes = await api.get(`/teacher/quizzes/${id}/questions`);

      setQuiz(quizRes.data);
      setQuestions(questionRes.data);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async () => {
    if (!confirm("Delete this quiz?")) return;

    await api.delete(`/teacher/quizzes/${id}`);

    router.push("/quizzes");
  };

  const publishQuiz = async () => {
    await api.put(`/teacher/quizzes/${id}`, {
      ...quiz,
      status: "PUBLISHED",
    });

    loadData();
  };

  if (loading) return <p className="text-white p-10">Loading...</p>;

  return (
    <ProtectedRoute allow={["TEACHER"]}>
      <DashboardLayout>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">{quiz.title}</h1>

            <p className="text-slate-400 mt-2">{quiz.description}</p>

            <div className="flex gap-3 mt-4 text-sm items-center">
              {/* Category */}
              <span className="text-blue-400">{quiz.category}</span>

              {/* Difficulty */}
              <span className="text-yellow-400">{quiz.difficulty}</span>

              {/* Visibility */}
              <span
                className={
                  quiz.visibility === "PUBLIC"
                    ? "text-green-400"
                    : "text-purple-400"
                }
              >
                {quiz.visibility}
              </span>

              {/* Status */}
              <span
                className={`${
                  quiz.status === "PUBLISHED"
                    ? "text-green-400"
                    : "text-slate-400"
                }`}
              >
                {quiz.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/quizzes/${id}/edit`}
              className="bg-slate-800 px-5 py-3 rounded-xl text-white"
            >
              <Pencil size={18} />
            </Link>

            <button
              onClick={deleteQuiz}
              className="bg-red-600 px-5 py-3 rounded-xl text-white"
            >
              <Trash2 size={18} />
            </button>

            {quiz.status !== "PUBLISHED" && (
              <button
                onClick={publishQuiz}
                className="bg-green-600 px-5 py-3 rounded-xl text-white"
              >
                Publish
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">Questions</p>
            <h2 className="text-3xl text-white font-bold mt-2">
              {questions.length}
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">Time Limit</p>
            <h2 className="text-3xl text-white font-bold mt-2">
              {quiz.timeLimit} min
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">Passing Score</p>
            <h2 className="text-3xl text-white font-bold mt-2">
              {quiz.passingScore}%
            </h2>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-slate-900 p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white font-semibold">Questions</h2>

            <Link
              href={`/quizzes/${id}/edit`}
              className="bg-blue-600 px-5 py-3 rounded-xl text-white flex gap-2 items-center"
            >
              <PlusCircle size={18} />
              Add Question
            </Link>
          </div>

          {questions.length === 0 ? (
            <p className="text-slate-400">No questions added yet.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-slate-800 p-5 rounded-xl">
                  <p className="text-slate-400 mb-2">Question {index + 1}</p>

                  <h3 className="text-white font-medium">{q.questionText}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
