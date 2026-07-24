"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {

  const [data, setData] = useState<any>();

  useEffect(() => {
    api.get("/teacher/dashboard")
      .then(res => setData(res.data));
  }, []);

  return (
    <ProtectedRoute allow={["TEACHER"]}>

      {!data ? (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          Loading...
        </div>
      ) : (

        <DashboardLayout>

          <h1 className="text-3xl font-bold text-white mb-8">
            Dashboard
          </h1>

          <div className="grid grid-cols-4 gap-6 mb-8">

            <StatCard
              title="Total Quizzes"
              value={String(data.totalQuizzes)}
            />

            <StatCard
              title="Students"
              value={String(data.uniqueStudents)}
            />

            <StatCard
              title="Attempts"
              value={String(data.totalAttempts)}
            />

            <StatCard
              title="Avg Score"
              value={data.averageScore.toFixed(1) + "%"}
            />

          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

              <h2 className="text-white text-xl mb-4">
                Recent Attempts
              </h2>

              {data.recentAttempts.map(
                (item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between py-3 border-b border-slate-800"
                  >
                    <span className="text-slate-300">
                      {item.studentName}
                    </span>

                    <span className="text-blue-400">
                      {item.score}
                    </span>
                  </div>
                )
              )}

            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

              <h2 className="text-white text-xl mb-4">
                Top Quizzes
              </h2>

              {data.topQuizzes.map(
                (item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between py-3 border-b border-slate-800"
                  >
                    <span className="text-slate-300">
                      {item.quizTitle}
                    </span>

                    <span className="text-green-400">
                      {item.averageScore.toFixed(1)}%
                    </span>
                  </div>
                )
              )}

            </div>

          </div>

        </DashboardLayout>
      )}

    </ProtectedRoute>
  );
}