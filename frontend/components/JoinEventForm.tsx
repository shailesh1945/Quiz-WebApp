"use client";

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function JoinEventForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const join = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        "/student/events/join",
        { joinCode: code }
      );

      router.push(
        `/live/${res.data.id}/play`
      );

    } catch {
      alert("Invalid code or event not live");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">

      <div className="bg-slate-900 p-10 rounded-2xl w-[420px] border border-slate-800 mx-auto mt-10">

        <h1 className="text-3xl font-bold text-white mb-3">
          Join Live Quiz
        </h1>

        <p className="text-slate-400 mb-6">
          Enter your event code
        </p>

        <input
          value={code}
          onChange={(e)=>setCode(e.target.value.toUpperCase())}
          placeholder="ABC123"
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6 tracking-[0.35em] uppercase text-center"
        />

        <button
          onClick={join}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 transition text-white py-4 rounded-xl"
        >
          {loading ? "Joining..." : "Join Event"}
        </button>

      </div>

    </div>
  );
}