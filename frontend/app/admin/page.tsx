"use client";

import { useEffect,useState } from "react";
import api from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPage(){

 const [data,setData]=useState<any>();

 useEffect(()=>{
   api.get("/admin/dashboard")
   .then(res=>setData(res.data));
 },[]);

 if(!data) return null;

 return(
  <ProtectedRoute allow={["ADMIN"]}>
 <div className="min-h-screen bg-slate-950 text-white p-8">

  <h1 className="text-4xl font-bold mb-8">
   Admin Dashboard
  </h1>

  <div className="grid grid-cols-5 gap-5">

   {[
    ["Users",data.totalUsers],
    ["Teachers",data.totalTeachers],
    ["Students",data.totalStudents],
    ["Quizzes",data.totalQuizzes],
    ["Attempts",data.totalAttempts],
   ].map((item:any,i:number)=>(

    <div
     key={i}
     className="bg-slate-900 p-6 rounded-2xl">

      <p>{item[0]}</p>
      <h2 className="text-3xl font-bold">
       {item[1]}
      </h2>

    </div>

   ))}

  </div>

 </div>
 </ProtectedRoute>
 );
}