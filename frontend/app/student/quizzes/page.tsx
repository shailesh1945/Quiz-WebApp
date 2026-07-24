"use client";

import { useEffect, useMemo, useState } from "react";
import { getPublicQuizzes } from "@/services/studentQuiz";
import Link from "next/link";

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getPublicQuizzes();
      setQuizzes(data);
    } catch (e) {
      console.log(e);
    }
  };

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(quizzes.map((q) => q.category)),
    ];
  }, [quizzes]);

  const filtered = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      q.category === category;

    const matchesDifficulty =
      difficulty === "All" ||
      q.difficulty === difficulty;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDifficulty
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Explore Quizzes
      </h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">

        <input
          placeholder="Search quizzes..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="bg-slate-900 rounded-xl p-3"
        />

        <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          className="bg-slate-900 rounded-xl p-3"
        >
          {categories.map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e)=>setDifficulty(e.target.value)}
          className="bg-slate-900 rounded-xl p-3"
        >
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {filtered.map((quiz)=>(
          <div
            key={quiz.id}
            className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-blue-500 transition"
          >

            <h2 className="text-2xl font-semibold">
              {quiz.title}
            </h2>

            <p className="text-slate-400 mt-3">
              {quiz.description}
            </p>

            <div className="mt-5 space-y-2 text-sm">

              <p>
                Category:
                <span className="text-blue-400 ml-2">
                  {quiz.category}
                </span>
              </p>

              <p>
                Difficulty:
                <span className="text-yellow-400 ml-2">
                  {quiz.difficulty}
                </span>
              </p>

              <p>
                Time:
                <span className="text-green-400 ml-2">
                  {quiz.timeLimit} mins
                </span>
              </p>

            </div>

            <Link
              href={`/play/${quiz.id}`}
            >
              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3">
                Start Quiz
              </button>
            </Link>

          </div>
        ))}

      </div>

    </div>
  );
}