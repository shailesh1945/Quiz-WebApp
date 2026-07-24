"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

type Props = {
  children: React.ReactNode;
  allow: ("TEACHER" | "STUDENT" | "ADMIN")[];
};

export default function ProtectedRoute({
  children,
  allow
}: Props) {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const check = async () => {
      try {

        const token =
          localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const res = await api.get("/user/me");

        const role = res.data.role;

        if (!allow.includes(role)) {

          if (role === "TEACHER") {
            router.push("/dashboard");
          }
          else if (role === "STUDENT") {
            router.push("/student");
          }
          else if (role === "ADMIN") {
            router.push("/admin");
          }

          return;
        }

        setLoading(false);

      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    check();

  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}