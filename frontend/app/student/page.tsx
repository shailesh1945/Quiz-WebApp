"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import StudentLayout from "@/components/student/StudentLayout";

export default function StudentPage() {

  return (
    <ProtectedRoute allow={["STUDENT"]}>

      <StudentLayout>

        <h1 className="text-3xl font-bold text-white mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">
              Quizzes Taken
            </p>
            <h2 className="text-3xl text-white font-bold mt-2">
              12
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">
              Avg Score
            </p>
            <h2 className="text-3xl text-green-400 font-bold mt-2">
              82%
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl">
            <p className="text-slate-400">
              Rank
            </p>
            <h2 className="text-3xl text-blue-400 font-bold mt-2">
              #4
            </h2>
          </div>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">

          <h2 className="text-white text-xl mb-4">
            Join Live Quiz
          </h2>

          <input
            placeholder="Enter Join Code"
            className="w-full bg-slate-800 p-3 rounded-xl text-white"
          />

          <button className="mt-4 bg-green-600 px-6 py-3 rounded-xl text-white">
            Join Now
          </button>

        </div>

      </StudentLayout>

    </ProtectedRoute>
  );
}