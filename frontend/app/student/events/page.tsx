"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

import StudentLayout from "@/components/student/StudentLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import { Calendar, Clock, PlayCircle, Loader2 } from "lucide-react";

export default function StudentEventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/student/events");

      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to load events", error);

      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allow={["STUDENT"]}>
      <StudentLayout>
        <div className="space-y-8">
          {/* Header */}

          <div>
            <h1 className="text-4xl font-bold text-white">Events</h1>

            <p className="text-slate-400 mt-2">
              Join live quiz events and compete with other students.
            </p>
          </div>

          {/* Loading */}

          {loading && (
            <div className="flex items-center gap-3 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              Loading events...
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-5 rounded-2xl">
              {error}
            </div>
          )}

          {/* Empty */}

          {!loading && !error && events.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center">
              <Calendar size={40} className="mx-auto text-slate-500 mb-4" />

              <h2 className="text-xl text-white font-semibold">
                No events available
              </h2>

              <p className="text-slate-400 mt-2">
                There are currently no scheduled or live events.
              </p>
            </div>
          )}

          {/* Events */}

          {!loading && !error && events.length > 0 && (
            <div className="grid gap-5">
              {events.map((event) => (
                <EventCard key={event.id} event={event} onJoin={joinEvent} />
              ))}
            </div>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}

function EventCard({ event, onJoin }: { event: any; onJoin: (eventId: number) => void; }) {
  const isLive = event.status === "LIVE";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-center gap-6">
        {/* Left */}

        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-white">{event.title}</h2>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isLive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-blue-500/10 text-blue-400"
              }`}
            >
              {event.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-5 mt-5 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar size={17} />

              {formatDate(event.startTime)}
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Clock size={17} />

              {formatTime(event.startTime)}
            </div>
          </div>
        </div>

        {/* Right */}

        {isLive ? (
          <button
            onClick={() => onJoin(event.id)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-5 py-3 rounded-xl text-white font-medium"
          >
            <PlayCircle size={18} />
            Join Event
          </button>
        ) : (
          <span className="px-5 py-3 rounded-xl bg-slate-800 text-slate-400">
            Upcoming
          </span>
        )}
      </div>
    </div>
  );
}

const joinEvent = async (
  eventId: number
) => {

  try {

    const res =
      await api.post(
        `/student/events/${eventId}/join`
      );

    console.log(
      "Joined event:",
      res.data
    );

    window.location.href =
      `/student/events/${eventId}`;

  } catch (error) {

    console.error(
      "Failed to join event",
      error
    );

    alert(
      "Unable to join this event."
    );
  }
};

function formatDate(value: string) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: string) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}
