"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import StudentLayout from "@/components/student/StudentLayout";
import JoinEventForm from "@/components/JoinEventForm";

export default function JoinPage() {
  return (
    <ProtectedRoute allow={["STUDENT"]}>
      <StudentLayout>
        <JoinEventForm />
      </StudentLayout>
    </ProtectedRoute>
  );
}