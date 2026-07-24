"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Trophy,
  Award,
  Search
} from "lucide-react";

export default function Leaderboard() {

  const [data, setData] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {

      const res =
        await api.get(
          "/student/quizzes/1/leaderboard"
        );

      setData(
        res.data
      );

    } catch {
      setData([]);
    }
  };

  const filtered =
    data.filter((item) =>
      item.student?.fullName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const badge = (
    rank:number
  ) => {

    if(rank===1)
      return <Trophy className="text-yellow-400" size={20}/>;

    if(rank===2)
      return <Award className="text-slate-300" size={20}/>;

    if(rank===3)
      return <Award className="text-orange-400" size={20}/>;

    return (
      <span className="text-slate-500">
        #{rank}
      </span>
    );
  };

  return (
    <div>

      <h1 className="text-4xl font-bold text-white mb-2">
        Leaderboard
      </h1>

      <p className="text-slate-400 mb-8">
        Top ranked students
      </p>

      {/* Search */}
      <div className="relative mb-6">

        <Search
          size={18}
          className="absolute left-4 top-4 text-slate-500"
        />

        <input
          placeholder="Search student..."
          value={search}
          onChange={(e)=>
            setSearch(
              e.target.value
            )
          }
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white outline-none"
        />

      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

        <div className="grid grid-cols-4 px-6 py-4 text-slate-400 border-b border-slate-800">

          <div>Rank</div>
          <div>Student</div>
          <div>Score</div>
          <div>%</div>

        </div>

        {filtered.length === 0 ? (

          <div className="p-10 text-center text-slate-500">
            No data found
          </div>

        ) : (

          filtered.map(
            (
              item,
              index
            ) => (

            <div
              key={index}
              className="grid grid-cols-4 px-6 py-5 border-b border-slate-800 text-white hover:bg-slate-800/40 transition"
            >

              <div>
                {badge(index+1)}
              </div>

              <div>
                {item.student?.fullName}
              </div>

              <div className="text-blue-400 font-semibold">
                {item.score}
              </div>

              <div className="text-green-400">
                {item.percentage?.toFixed(1)}%
              </div>

            </div>
          )))}

      </div>

    </div>
  );
}