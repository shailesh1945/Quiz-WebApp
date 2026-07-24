"use client";

import { useEffect, useState } from "react";
import { connectLive } from "@/hooks/useLiveQuiz";

export default function LiveQuizPlayer({
  eventId
}:{
  eventId:number
}){

  const [status,setStatus]=useState("WAITING");
  const [seconds,setSeconds]=useState(0);
  const [rows,setRows]=useState<any[]>([]);

  useEffect(()=>{

    const disconnect = connectLive(
      eventId,
      {
        onBoard:(data)=>setRows(data),
        onTimer:(data)=>setSeconds(data.seconds),
        onStatus:(s)=>setStatus(s)
      }
    );

    return ()=>{
      disconnect().catch(console.error);
    };

  },[eventId]);

  useEffect(()=>{

    if(seconds<=0) return;

    const t = setInterval(()=>{
      setSeconds(prev=>prev-1);
    },1000);

    return ()=>clearInterval(t);

  },[seconds]);

  if(status==="WAITING"){
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-4xl font-bold">
        Waiting for teacher to start...
      </div>
    );
  }

  if(status==="ENDED"){
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-4xl font-bold">
        Event Ended 🎉
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">

        <div className="col-span-2 bg-slate-900 rounded-2xl p-8">

          <h1 className="text-3xl font-bold mb-6">
            Live Quiz Running
          </h1>

          <div className="bg-red-600 inline-block px-5 py-3 rounded-xl text-xl mb-8">
            {Math.floor(seconds/60)}:
            {String(seconds%60).padStart(2,"0")}
          </div>

          <p className="text-slate-400">
            Quiz questions screen goes here.
          </p>

        </div>

        <div className="bg-slate-900 rounded-2xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Leaderboard
          </h2>

          <div className="space-y-3">

            {rows.map((r:any,index:number)=>(
              <div
                key={index}
                className="flex justify-between bg-slate-800 px-4 py-3 rounded-xl"
              >
                <span>
                  #{r.rank} {r.studentName}
                </span>

                <span className="text-green-400">
                  {r.score}
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}