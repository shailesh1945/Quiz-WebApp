"use client";

import { useParams } from "next/navigation";
import EventLivePanel from "@/components/EventLivePanel";

export default function Page() {
  const params = useParams();

  const rawId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const eventId = Number(rawId);

  if (!eventId || isNaN(eventId)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Invalid Event ID
      </div>
    );
  }

  return <EventLivePanel eventId={eventId} />;
}