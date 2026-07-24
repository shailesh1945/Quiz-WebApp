"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import QRCode from "react-qr-code";
import {
  CalendarDays,
  Play,
  Square,
  Trash2,
  Copy,
  Plus,
  Clock3,
  QrCode,
  X,
  Monitor,
} from "lucide-react";

export default function Events() {
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [quizId, setQuizId] = useState("");
  const [startTime, setStartTime] = useState("");

  const [loading, setLoading] = useState(false);

  const [qrCode, setQrCode] = useState("");
  const [showQr, setShowQr] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/teacher/events");

      setEvents(
        Array.isArray(res.data)
          ? res.data
          : res.data.content || []
      );
    } catch (err) {
      console.log(err);
      setEvents([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createEvent = async () => {
    if (!title || !quizId || !startTime) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/teacher/events", {
        title,
        quizId: Number(quizId),
        startTime,
      });

      setTitle("");
      setQuizId("");
      setStartTime("");

      load();
    } catch (err) {
      console.log(err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const startEvent = async (id: number) => {
    try {
      await api.put(`/teacher/events/${id}/start`);
      load();
    } catch {
      alert("Failed to start event");
    }
  };

  const endEvent = async (id: number) => {
    try {
      await api.put(`/teacher/events/${id}/end`);
      load();
    } catch {
      alert("Failed to end event");
    }
  };

  const deleteEvent = async (id: number) => {
    const ok = confirm("Delete this event?");
    if (!ok) return;

    try {
      await api.delete(`/teacher/events/${id}`);
      load();
    } catch {
      alert("Failed to delete event");
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    alert("Join code copied");
  };

  const openQR = (code: string) => {
    const url =
      `${window.location.origin}/join?code=${code}`;

    setQrCode(url);
    setShowQr(true);
  };

  const badgeColor = (status: string) => {
    if (status === "LIVE") {
      return "bg-green-500/10 text-green-400 border-green-500/30";
    }

    if (status === "ENDED") {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Events
        </h1>

        <p className="text-slate-400 mt-2">
          Manage live quiz sessions professionally
        </p>
      </div>

      {/* Create Event */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <div className="flex items-center gap-3 mb-6">
          <CalendarDays className="text-blue-500" />

          <h2 className="text-2xl text-white font-semibold">
            Create New Event
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            placeholder="Event title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="bg-slate-800 text-white p-4 rounded-2xl outline-none"
          />

          <input
            placeholder="Quiz ID"
            value={quizId}
            onChange={(e) =>
              setQuizId(e.target.value)
            }
            className="bg-slate-800 text-white p-4 rounded-2xl outline-none"
          />

          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) =>
              setStartTime(e.target.value)
            }
            className="bg-slate-800 text-white p-4 rounded-2xl outline-none"
          />

          <button
            onClick={createEvent}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={18} />

            {loading
              ? "Creating..."
              : "Create Event"}
          </button>

        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">

        {events.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-500">
            No events created
          </div>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
          >
            <div className="flex justify-between gap-6 flex-wrap">

              {/* Left */}
              <div className="space-y-3">

                <h3 className="text-2xl text-white font-bold">
                  {event.title}
                </h3>

                <div className="flex gap-3 flex-wrap">

                  <span
                    className={`px-4 py-1 rounded-full border text-sm ${badgeColor(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>

                  <span className="text-slate-400 flex items-center gap-2">
                    <Clock3 size={16} />
                    {event.startTime}
                  </span>

                </div>

                <div className="text-slate-300">
                  Join Code:

                  <span className="ml-2 text-blue-400 font-bold tracking-widest">
                    {event.joinCode}
                  </span>
                </div>

              </div>

              {/* Right */}
              <div className="flex items-center gap-3 flex-wrap">

                {/* Open Panel */}
                <button
                  onClick={() =>
                    router.push(`/events/${event.id}`)
                  }
                  className="px-5 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
                >
                  <Monitor size={18} />
                  Open Panel
                </button>

                {/* Copy */}
                <button
                  onClick={() =>
                    copyCode(event.joinCode)
                  }
                  className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
                >
                  <Copy size={18} />
                </button>

                {/* QR */}
                <button
                  onClick={() =>
                    openQR(event.joinCode)
                  }
                  className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center"
                >
                  <QrCode size={18} />
                </button>

                {/* Start */}
                {event.status === "SCHEDULED" && (
                  <button
                    onClick={() =>
                      startEvent(event.id)
                    }
                    className="px-5 h-12 rounded-xl bg-green-600 hover:bg-green-500 text-white flex items-center gap-2"
                  >
                    <Play size={18} />
                    Start
                  </button>
                )}

                {/* End */}
                {event.status === "LIVE" && (
                  <button
                    onClick={() =>
                      endEvent(event.id)
                    }
                    className="px-5 h-12 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-2"
                  >
                    <Square size={18} />
                    End
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() =>
                    deleteEvent(event.id)
                  }
                  className="w-12 h-12 rounded-xl bg-red-700 hover:bg-red-600 text-white flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* QR Modal */}
      {showQr && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">

          <div className="bg-white w-[380px] rounded-3xl p-8 relative text-center">

            <button
              onClick={() =>
                setShowQr(false)
              }
              className="absolute top-4 right-4 text-slate-600"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              Scan to Join Quiz
            </h2>

            <div className="bg-white p-4 rounded-2xl inline-block">
              <QRCode
                value={qrCode}
                size={240}
              />
            </div>

            <p className="mt-5 text-sm text-slate-600 break-all">
              {qrCode}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}