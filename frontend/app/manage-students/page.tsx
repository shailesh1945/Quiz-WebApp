"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ManageStudentsPage() {

  const [students,setStudents] =
    useState<any[]>([]);

  const [search,setSearch] =
    useState("");

  const load = async()=>{

    const res =
      await api.get(
        "/teacher/students"
      );

    setStudents(res.data);
  };

  useEffect(()=>{
    load();
  },[]);

  const toggle = async(id:number)=>{

    await api.put(
      `/teacher/students/${id}/toggle`
    );

    load();
  };

  const filtered =
    students.filter(s =>
      s.fullName
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
    );

  return(
  <ProtectedRoute allow={["TEACHER"]}>

   <DashboardLayout>

    <div className="flex justify-between mb-8">

      <h1 className="text-4xl font-bold text-white">
        Students
      </h1>

      <input
       placeholder="Search..."
       value={search}
       onChange={(e)=>
        setSearch(e.target.value)
       }
       className="bg-slate-900 text-white px-5 py-3 rounded-xl"
      />

    </div>

    <div className="bg-slate-900 rounded-2xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-800">

          <tr className="text-left text-slate-300">

            <th className="p-4">
              Name
            </th>

            <th className="p-4">
              Attempts
            </th>

            <th className="p-4">
              Avg Score
            </th>

            <th className="p-4">
              Status
            </th>

            <th className="p-4">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

        {filtered.map((s)=>(
          <tr
           key={s.id}
           className="border-t border-slate-800"
          >

            <td className="p-4 text-white">
              {s.fullName}
              <div className="text-slate-400 text-sm">
                {s.email}
              </div>
            </td>

            <td className="p-4 text-white">
              {s.quizzesTaken}
            </td>

            <td className="p-4 text-green-400">
              {s.averageScore.toFixed(1)}%
            </td>

            <td className="p-4">
              {s.active ? (
                <span className="text-green-400">
                  Active
                </span>
              ):(
                <span className="text-red-400">
                  Disabled
                </span>
              )}
            </td>

            <td className="p-4">

              <button
               onClick={()=>
                toggle(s.id)
               }
               className="bg-blue-600 px-4 py-2 rounded-xl text-white"
              >
               {s.active
                ? "Disable"
                : "Enable"}
              </button>

            </td>

          </tr>
        ))}

        </tbody>

      </table>

    </div>

   </DashboardLayout>

  </ProtectedRoute>
  );
}