"use client";

import LiveQuizPlayer from "@/components/LiveQuizPlayer";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function LivePlayPage({
  params
}: any) {

  return (
    <ProtectedRoute allow={["STUDENT"]}>
      <LiveQuizPlayer
        eventId={params.eventId}
      />
    </ProtectedRoute>
  );
}