"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import QRCode from "react-qr-code";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function EventLivePanel({
  eventId,
}: {
  eventId: number;
}) {
  const [event, setEvent] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const load = async () => {
    try {
      const e = await api.get(
        `/teacher/events/${eventId}`
      );

      const p = await api.get(
        `/teacher/events/${eventId}/participants`
      );

      const l = await api.get(
        `/teacher/events/${eventId}/leaderboard`
      );

      setEvent(e.data);
      setUsers(p.data);
      setLeaders(l.data);
    } catch (error) {
      console.log(error);
    }
  };

  const startEvent = async () => {
    try {
      await api.put(
        `/teacher/events/${eventId}/start`
      );

      load();
    } catch (error) {
      console.log(error);
    }
  };

  const endEvent = async () => {
    try {
      await api.put(
        `/teacher/events/${eventId}/end`
      );

      load();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  if (!eventId) return;

  load();

  const timer = setInterval(load, 3000);

  const client = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws"),

    reconnectDelay: 5000,

    onConnect: () => {
      client.subscribe(
        `/topic/event/${eventId}`,
        (message) => {
          setLogs((prev) => [
            message.body,
            ...prev,
          ]);

          load();
        }
      );
    },
  });

  client.activate();

  return () => {
    clearInterval(timer);
    client.deactivate();
  };
}, [eventId]);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading Event...
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            {event.title}
          </h1>

          <p className="text-slate-400 mt-2">
            Live Event Control Panel
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={startEvent}
            className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold"
          >
            Start Event
          </button>

          <button
            onClick={endEvent}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold"
          >
            End Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-5 mb-6">
        <div className="bg-slate-900 p-5 rounded-2xl">
          <p className="text-slate-400 text-sm">
            Status
          </p>

          <h3 className="text-2xl font-bold mt-2 text-blue-400">
            {event.status}
          </h3>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl">
          <p className="text-slate-400 text-sm">
            Participants
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {users.length}
          </h3>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl">
          <p className="text-slate-400 text-sm">
            Join Code
          </p>

          <h3 className="text-2xl font-bold mt-2 text-yellow-400 tracking-widest">
            {event.joinCode}
          </h3>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl">
          <p className="text-slate-400 text-sm">
            Top Score
          </p>

          <h3 className="text-2xl font-bold mt-2 text-green-400">
            {leaders[0]?.score || 0}
          </h3>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* QR */}
        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-xl mb-5 font-semibold">
            Join Event
          </h2>

          <div className="bg-white p-4 rounded-xl inline-block">
            <QRCode
              value={`http://localhost:3000/join?code=${event.joinCode}`}
              size={220}
            />
          </div>

          <p className="mt-4 text-blue-400 text-xl tracking-widest font-bold">
            {event.joinCode}
          </p>

          <p className="text-slate-400 mt-2 text-sm">
            Students scan QR to join instantly
          </p>
        </div>

        {/* Participants */}
        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-xl mb-5 font-semibold">
            Participants ({users.length})
          </h2>

          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            {users.length === 0 && (
              <p className="text-slate-500">
                No students joined
              </p>
            )}

            {users.map((u) => (
              <div
                key={u.id}
                className="bg-slate-800 p-3 rounded-xl"
              >
                {u.fullName}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-xl mb-5 font-semibold">
            Leaderboard
          </h2>

          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            {leaders.length === 0 && (
              <p className="text-slate-500">
                No scores yet
              </p>
            )}

            {leaders.map(
              (u: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between bg-slate-800 p-3 rounded-xl"
                >
                  <span>
                    #{index + 1} {u.name}
                  </span>

                  <span className="text-green-400 font-semibold">
                    {u.score}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-slate-900 p-6 rounded-2xl mt-6">
        <h2 className="text-xl font-semibold mb-4">
          Live Activity
        </h2>

        <div className="space-y-3 max-h-[250px] overflow-auto">
          {logs.length === 0 && (
            <p className="text-slate-500">
              Waiting for live activity...
            </p>
          )}

          {logs.map((log, i) => (
            <div
              key={i}
              className="bg-slate-800 p-3 rounded-xl text-sm"
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}