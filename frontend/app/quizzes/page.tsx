"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { Search, Pencil, Trash2, Eye } from "lucide-react";

export default function QuizzesPage() {

  const [quizzes, setQuizzes] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("ALL");

  useEffect(() => {

    loadQuizzes();

  }, []);

  const loadQuizzes = async () => {

    try {

      const res =
        await api.get(
          "/teacher/quizzes"
        );

      setQuizzes(
        res.data.content || []
      );

    } finally {

      setLoading(false);
    }
  };

  const removeQuiz = async (
    id: number
  ) => {

    if (
      !confirm(
        "Delete this quiz?"
      )
    ) return;

    await api.delete(
      `/teacher/quizzes/${id}`
    );

    loadQuizzes();
  };

  const filtered =
    useMemo(() => {

      return quizzes.filter(
        (q) => {

          const matchSearch =
            q.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchStatus =
            status === "ALL"
              ? true
              : q.status === status;

          return (
            matchSearch &&
            matchStatus
          );
        }
      );

    }, [
      quizzes,
      search,
      status
    ]);

  return (
    <ProtectedRoute allow={["TEACHER"]}>

      <DashboardLayout>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            Quizzes
          </h1>

          <Link
            href="/quizzes/create"
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white"
          >
            Create Quiz
          </Link>

        </div>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-4 mb-8">

          <div className="col-span-2 flex items-center gap-3 bg-slate-900 px-4 rounded-xl">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              placeholder="Search quiz..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full bg-transparent py-4 text-white outline-none"
            />

          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="bg-slate-900 text-white px-4 rounded-xl"
          >
            <option value="ALL">
              All Status
            </option>
            <option value="DRAFT">
              Draft
            </option>
            <option value="PUBLISHED">
              Published
            </option>
          </select>

        </div>

        {/* Loading */}
        {loading && (
          <p className="text-white">
            Loading...
          </p>
        )}

        {/* Empty */}
        {!loading &&
          filtered.length === 0 && (
            <div className="bg-slate-900 p-10 rounded-2xl text-slate-400">
              No quizzes found.
            </div>
          )}

        {/* List */}
        <div className="grid gap-5">

          {filtered.map((quiz) => (

            <div
              key={quiz.id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-2xl font-semibold text-white">
                    {quiz.title}
                  </h2>

                  <p className="text-slate-400 mt-2">
                    {
                      quiz.description
                    }
                  </p>

                  <div className="mt-4 flex gap-3 text-sm">

                    <span className="text-blue-400">
                      {
                        quiz.category
                      }
                    </span>

                    <span className="text-yellow-400">
                      {
                        quiz.difficulty
                      }
                    </span>

                    <span
                      className={`${
                        quiz.status ===
                        "PUBLISHED"
                          ? "text-green-400"
                          : "text-slate-400"
                      }`}
                    >
                      {
                        quiz.status
                      }
                    </span>

                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-2">

                  <Link
                    href={`/quizzes/${quiz.id}`}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700"
                  >
                    <Eye
                      size={18}
                      className="text-white"
                    />
                  </Link>

                  <Link
                    href={`/quizzes/${quiz.id}/edit`}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700"
                  >
                    <Pencil
                      size={18}
                      className="text-white"
                    />
                  </Link>

                  <button
                    onClick={() =>
                      removeQuiz(
                        quiz.id
                      )
                    }
                    className="p-3 rounded-xl bg-red-600 hover:bg-red-500"
                  >
                    <Trash2
                      size={18}
                      className="text-white"
                    />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </DashboardLayout>

    </ProtectedRoute>
  );
}