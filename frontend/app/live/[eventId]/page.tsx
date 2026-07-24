"use client";

import { useEffect,useState } from "react";
import { connectLive } from "@/hooks/useLiveQuiz";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function LivePage({
 params
}:any){

 const [rows,setRows]=useState([]);

 useEffect(()=>{
   connectLive(
     params.eventId,
     { onBoard: setRows }
   );
 },[]);

 return(
  <ProtectedRoute allow={["STUDENT"]}>
 <div className="p-8 bg-slate-950 text-white">

   <h1 className="text-3xl mb-8">
    Live Leaderboard
   </h1>

   {rows.map((r:any,index)=>(
    <div key={index}
     className="bg-slate-900 p-4 rounded-xl mb-3 flex justify-between">

      <span>{r.rank}. {r.studentName}</span>
      <span>{r.score}</span>

    </div>
   ))}

 </div>
 </ProtectedRoute>
 );
}